const AdmZip = require('adm-zip');
const axios = require('axios');
const xmlParser = require('xml2json');
const fs = require('fs');
const _uniq = require('lodash.uniq');
const _get = require('lodash.get');

const config = {
    zipUrl: 'https://www.dropbox.com/s/liqnievb8llw255/metadata.zip?dl=1',
    locales: ['da'],
    files: {
        account: 'Account',
        initiative: 'Initiative__c',
        initiativeActivity: 'Initiative_Activity__c',
        initiativeActivityGoal: 'Initiative_Activity_Goal__c',
        initiativeActivitySuccessMetric:
            'Initiative_Activity_Success_Metric__c',
        initiativeCollaborator: 'Initiative_Collaborator__c',
        initiativeEmployeeFunded: 'Initiative_Employee_Funded__c',
        initiativeFunder: 'Initiative_Funder__c',
        initiativeGoal: 'Initiative_Goal__c',
        initiativeReport: 'Initiative_Report__c',
        initiativeReportDetail: 'Initiative_Report_Detail__c',
        initiativeReportDetailEntry: 'Initiative_Report_Detail_Entry__c',
        initiativeReportDetailGoal: 'Initiative_Report_Detail_Goal__c',
        initiativeTeamMember: 'Initiative_Team_Member__c',
        initiativeUpdate: 'Initiative_Update__c',
        initiativeUpdateContent: 'Initiative_Update_Content__c',
    },
};

class zipExtractor {
    constructor(zipData) {
        this.zip = new AdmZip(zipData);
    }

    _asJson(fileName) {
        return JSON.parse(
            xmlParser.toJson(this.zip.readAsText(`unpackaged/${fileName}`))
        );
    }

    _asKeys(fileName, path, key) {
        return _get(this._asJson(fileName), path, []).reduce(
            (acc, value) => ({
                ...acc,
                [value[key]]: value,
            }),
            {}
        );
    }

    _combineValueArrays(values, translatedValues) {
        return values.reduce((acc, value) => {
            const translatedValue = translatedValues.find(tValue => {
                return tValue.masterLabel === value.label;
            });

            const translatedLabel = translatedValue?.translation ?? {};

            const valueObject = {
                fullName: value.fullName,
                default: value.default,
                label:
                    Object.keys(translatedLabel).length > 0
                        ? translatedLabel
                        : value.label,
            };

            if ('isActive' in value) {
                valueObject.isActive = value.isActive;
            }

            return [...acc, valueObject];
        }, []);
    }

    _runThroughFiles(method) {
        return Object.keys(config.files).reduce(
            (acc, key) => ({
                ...acc,
                [key]: method(config.files[key]),
            }),
            {}
        );
    }

    customLabelsDefault() {
        return this._asJson(
            'labels/CustomLabels.labels'
        ).CustomLabels.labels.reduce(
            (acc, label) => ({
                ...acc,
                [label.fullName]: { label: label.value },
            }),
            {}
        );
    }

    customLabelsLocale(locale) {
        return this._asJson(
            `translations/${locale}.translation`
        ).Translations.customLabels.reduce(
            (acc, label) => ({
                ...acc,
                [label.name]: { label: label.label },
            }),
            {}
        );
    }

    objectLabelsDefault() {
        const _reduceObject = fileName => {
            return this._asJson(
                `objects/${fileName}.object`
            ).CustomObject.fields.reduce(
                (acc, label) => ({
                    ...acc,
                    [label.fullName]: {
                        label: label.label ?? null,
                        helpText: label.inlineHelpText ?? null,
                    },
                }),
                {}
            );
        };

        return this._runThroughFiles(_reduceObject.bind());
    }

    objectLabelsLocale(locale) {
        const _reduceObject = fileName =>
            this._asJson(
                `objectTranslations/${fileName}-${locale}.objectTranslation`
            ).CustomObjectTranslation.fields.reduce(
                (acc, label) => ({
                    ...acc,
                    [label.name]: {
                        label: label.label ?? null,
                        helpText: label.help ?? null,
                    },
                }),
                {}
            );

        return this._runThroughFiles(_reduceObject.bind());
    }

    valueSetsDefault() {
        const _reduceValueSet = fileName =>
            this._asJson(
                `objects/${fileName}.object`
            ).CustomObject.fields.reduce((acc, field) => {
                // Basic value set from object
                if (field.valueSet && field.valueSet.valueSetDefinition) {
                    let values = field.valueSet.valueSetDefinition.value;

                    // Check for array
                    values = Array.isArray(values) ? values : [values];

                    return {
                        ...acc,
                        [field.fullName]: { values },
                    };
                }

                // Value set with controlling field and labels from a globalValueSet
                if (
                    field.valueSet &&
                    field.valueSet.controllingField &&
                    field.valueSet.valueSettings
                ) {
                    // Extract unique field names from controllingFieldValues
                    // We do this in order to make it easier in the frontend
                    // to work with controlled fields
                    const uniqueControllingFieldValues = _uniq(
                        field.valueSet.valueSettings
                            .reduce(
                                (acc, s) => [...acc, s.controllingFieldValue],
                                []
                            )
                            .flat()
                    );

                    // Extract the external value set based on the value set name
                    // This is used to enrich the controlled values
                    const externalValueSet = this._asKeys(
                        `globalValueSets/${field.valueSet.valueSetName}.globalValueSet`,
                        'GlobalValueSet.customValue',
                        'fullName'
                    );

                    // Based on the unique field names, we look into the valueSettings
                    // to extract the controlled values for each of the values in
                    // valueSettings
                    // These will be enriched with data from the externalValueSet
                    const controlledValues = uniqueControllingFieldValues.reduce(
                        (acc, uniqueValue) => {
                            const values = field.valueSet.valueSettings
                                .filter(value =>
                                    value.controllingFieldValue.includes(
                                        uniqueValue
                                    )
                                )
                                .map(item =>
                                    _get(externalValueSet, item.valueName, null)
                                );

                            return {
                                ...acc,
                                [uniqueValue]: values,
                            };
                        },
                        {}
                    );

                    return {
                        ...acc,
                        [field.fullName]: {
                            controlledBy: field.valueSet.controllingField,
                            valueSetName: field.valueSet.valueSetName,
                            controlledValues,
                        },
                    };
                }

                // Value set from a globalValueSet
                if (field.valueSet && field.valueSet.valueSetName) {
                    let values = this._asJson(
                        `globalValueSets/${field.valueSet.valueSetName}.globalValueSet`
                    ).GlobalValueSet.customValue;

                    // Check for array
                    values = Array.isArray(values) ? values : [values];
                    return {
                        ...acc,
                        [field.fullName]: {
                            values,
                            valueSetName: field.valueSet.valueSetName,
                        },
                    };
                }

                // Catch all for backup
                if (field.valueSet) {
                    return {
                        ...acc,
                        [field.fullName]: field.valueSet,
                    };
                }

                return acc;
            }, {});

        return this._runThroughFiles(_reduceValueSet.bind());
    }

    valueSetsLocale(locale) {
        const _reduceValueSet = fileName =>
            this._asJson(
                `objects/${fileName}.object`
            ).CustomObject.fields.reduce((acc, field) => {
                // Basic value set from object
                if (field.valueSet && field.valueSet.valueSetDefinition) {
                    // Get values from object
                    let values = field.valueSet.valueSetDefinition.value;

                    // Check for array
                    values = Array.isArray(values) ? values : [values];

                    // Get translated object as keys
                    let translatedValues = this._asKeys(
                        `objectTranslations/${fileName}-${locale}.objectTranslation`,
                        'CustomObjectTranslation.fields',
                        'name'
                    )[field.fullName].picklistValues;

                    // Check for array
                    translatedValues = Array.isArray(translatedValues)
                        ? translatedValues
                        : [translatedValues];

                    return {
                        ...acc,
                        [field.fullName]: {
                            values: this._combineValueArrays(
                                values,
                                translatedValues
                            ),
                        },
                    };
                }

                // Value set with controlling field and labels from a globalValueSet
                if (
                    field.valueSet &&
                    field.valueSet.controllingField &&
                    field.valueSet.valueSettings
                ) {
                    // Extract unique field names from controllingFieldValues
                    // We do this in order to make it easier in the frontend
                    // to work with controlled fields
                    const uniqueControllingFieldValues = _uniq(
                        field.valueSet.valueSettings
                            .reduce(
                                (acc, s) => [...acc, s.controllingFieldValue],
                                []
                            )
                            .flat()
                    );

                    // Extract the external value set based on the value set name
                    // This is used to enrich the controlled values
                    let externalValueSet = this._asJson(
                        `globalValueSets/${field.valueSet.valueSetName}.globalValueSet`
                    ).GlobalValueSet.customValue;

                    // Check for array
                    externalValueSet = Array.isArray(externalValueSet)
                        ? externalValueSet
                        : [externalValueSet];

                    // Extract the external translated value set based on the value set name
                    // This is used to enrich the controlled values
                    let externalTranslatedValueSet = this._asJson(
                        `globalValueSetTranslations/${field.valueSet.valueSetName}-${locale}.globalValueSetTranslation`
                    ).GlobalValueSetTranslation.valueTranslation;

                    // Check for array
                    externalTranslatedValueSet = Array.isArray(
                        externalTranslatedValueSet
                    )
                        ? externalTranslatedValueSet
                        : [externalTranslatedValueSet];

                    // Merge the two value sets and create object with keys = fullName
                    const mergedValueSets = this._combineValueArrays(
                        externalValueSet,
                        externalTranslatedValueSet
                    ).reduce(
                        (acc, value) => ({
                            ...acc,
                            [value.fullName]: value,
                        }),
                        {}
                    );

                    // Based on the unique field names, we look into the valueSettings
                    // to extract the controlled values for each of the values in
                    // valueSettings
                    // These will be enriched with data from the externalValueSet
                    const controlledValues = uniqueControllingFieldValues.reduce(
                        (acc, uniqueValue) => {
                            const values = field.valueSet.valueSettings
                                .filter(value =>
                                    value.controllingFieldValue.includes(
                                        uniqueValue
                                    )
                                )
                                .map(item =>
                                    _get(mergedValueSets, item.valueName, null)
                                );

                            return {
                                ...acc,
                                [uniqueValue]: values,
                            };
                        },
                        {}
                    );

                    return {
                        ...acc,
                        [field.fullName]: {
                            controlledBy: field.valueSet.controllingField,
                            valueSetName: field.valueSet.valueSetName,
                            controlledValues,
                        },
                    };
                }

                // Value set from a globalValueSet
                if (field.valueSet && field.valueSet.valueSetName) {
                    let values = this._asJson(
                        `globalValueSets/${field.valueSet.valueSetName}.globalValueSet`
                    ).GlobalValueSet.customValue;

                    // Check for array
                    values = Array.isArray(values) ? values : [values];

                    // Get translated object as json
                    let translatedValues = this._asJson(
                        `globalValueSetTranslations/${field.valueSet.valueSetName}-${locale}.globalValueSetTranslation`
                    ).GlobalValueSetTranslation.valueTranslation;

                    // Check for array
                    translatedValues = Array.isArray(translatedValues)
                        ? translatedValues
                        : [translatedValues];

                    return {
                        ...acc,
                        [field.fullName]: {
                            values: this._combineValueArrays(
                                values,
                                translatedValues
                            ),
                            valueSetName: field.valueSet.valueSetName,
                        },
                    };
                }

                // Catch all for backup
                if (field.valueSet) {
                    return {
                        ...acc,
                        [field.fullName]: field.valueSet,
                    };
                }

                return acc;
            }, {});

        return this._runThroughFiles(_reduceValueSet.bind());
    }

    objectTypes() {
        const _reduceObject = fileName =>
            this._asJson(
                `objects/${fileName}.object`
            ).CustomObject.fields.reduce(
                (acc, field) => ({
                    ...acc,
                    [field.fullName]: field.type ?? null,
                }),
                {}
            );

        return this._runThroughFiles(_reduceObject.bind());
    }
}

async function extract() {
    try {
        // Download zip file to buffer
        const { data } = await axios({
            method: 'GET',
            url: config.zipUrl,
            responseType: 'arraybuffer',
            responseEncoding: 'binary',
        });

        // Create instance of zip extractor file based on buffered data
        const zip = new zipExtractor(data);

        return {
            // Create labels object
            labels: {
                // Default labels (en)
                en: {
                    custom: zip.customLabelsDefault(),
                    objects: zip.objectLabelsDefault(),
                },

                // All other locales
                ...config.locales.reduce(
                    (acc, locale) => ({
                        ...acc,
                        [locale]: {
                            custom: zip.customLabelsLocale(locale),
                            objects: zip.objectLabelsLocale(locale),
                        },
                    }),
                    {}
                ),
            },

            // Create value sets object
            valueSets: {
                // Default value sets (en)
                en: zip.valueSetsDefault(),

                // All other locales
                ...config.locales.reduce(
                    (acc, locale) => ({
                        ...acc,
                        [locale]: zip.valueSetsLocale(locale),
                    }),
                    {}
                ),
            },

            // Create types object
            types: zip.objectTypes(),
        };
    } catch (error) {
        console.log(error);
    }
}

async function extractToJsonFile() {
    try {
        const data = await extract();
        fs.rmSync('_metadata', { recursive: true, force: true });
        fs.mkdirSync('_metadata', { recursive: true });
        fs.writeFile('_metadata/metadata.json', JSON.stringify(data), err => {
            console.info('Metadata from zip written to file');
        });
    } catch (error) {
        throw new Error(err);
    }
}

module.exports = { extract, extractToJsonFile };
