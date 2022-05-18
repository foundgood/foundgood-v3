// React
import React from 'react';

// Packages
import t from 'prop-types';
import Image from 'next/image';

// Utilities
import { useLabels, useUser } from 'utilities/hooks';

// Components
import Button from 'components/button';

// Icons
import { FiImage } from 'react-icons/fi';

const OrganisationsListComponent = ({
    collaborators = [],
    funders = [],
    action,
}) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col p-24 bg-teal-10 rounded-8">
            {/* Collaborators List */}
            <h5 className="mb-16 t-h5">
                {label('OrganisationsListHeadingCollaborators')}
            </h5>
            <List
                {...{
                    organisations: collaborators,
                    organisationType: 'Initiative_Collaborator__c',
                    action,
                    noOrganisationsLabel: 'OrganisationsListNoCollaborators',
                }}
            />

            {/* Funders List */}
            <h5 className="mt-48 mb-16 t-h5">
                {label('OrganisationsListHeadingFunders')}
            </h5>

            <List
                {...{
                    organisations: funders,
                    organisationType: 'Initiative_Funder__c',
                    action,
                    noOrganisationsLabel: 'OrganisationsListNoFunders',
                }}
            />
        </div>
    );
};

const List = ({
    organisations = [],
    organisationType,
    action,
    noOrganisationsLabel,
}) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();
    const { getUserAccountId } = useUser();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col space-y-16">
            {organisations.length > 0 ? (
                organisations.map(organisation => (
                    <div
                        key={organisation?.Id}
                        className="flex items-center p-16 space-x-16 bg-white border-4 border-teal-20 rounded-8">
                        <div className="flex items-center justify-center flex-shrink-0 w-64 h-64 text-teal-100 border-2 rounded-4 border-teal-20">
                            <FiImage size="36" className="stroke-current" />
                        </div>
                        <div className="t-sh4 whitespace-nowrap">
                            {organisation?.Account__r?.Name}
                        </div>
                        {getUserAccountId() === organisation?.Account__c && (
                            <div className="px-8 pt-3 pb-1 t-sh7 text-teal-120 bg-teal-20 rounded-4">
                                {label('OrganisationsListYourOrganisation')}
                            </div>
                        )}
                        {getUserAccountId() !== organisation?.Account__c && (
                            <Button
                                theme="teal"
                                className="!ml-auto"
                                variant={'secondary'}
                                action={() =>
                                    action(organisation, organisationType)
                                }>
                                {label('ButtonEdit')}
                            </Button>
                        )}
                    </div>
                ))
            ) : (
                <p className="flex items-center justify-center p-16 t-sh5 bg-teal-20 rounded-8">
                    {label(noOrganisationsLabel)}
                </p>
            )}
        </div>
    );
};

OrganisationsListComponent.propTypes = {};

OrganisationsListComponent.defaultProps = {};

export default OrganisationsListComponent;
