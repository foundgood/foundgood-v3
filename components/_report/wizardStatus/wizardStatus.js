// React
import React, { useState } from 'react';

// Packages
import { useRouter } from 'next/router';

// Utilities
import { useLabels, useContext, useAuth, useElseware } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';
import Modal from 'components/modal';

const WizardStatusComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities, CONSTANTS } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const router = useRouter();
    const { label } = useLabels();
    const { userInitiativeRights } = useAuth();
    const { INITIATIVE_ID, REPORT_ID } = useContext();
    const { ewUpdate } = useElseware();

    // ///////////////////
    // STATE
    // ///////////////////

    const [showModal, setShowModal] = useState(false);

    // ///////////////////
    // METHODS
    // ///////////////////

    async function reportInProgress() {
        try {
            const { data: reportData } = await ewUpdate(
                'initiative-report/initiative-report',
                REPORT_ID,
                {
                    Status__c: CONSTANTS.REPORTS.REPORT_IN_PROGRESS,
                }
            );

            // Update store
            utilities.updateInitiativeData('_reports', reportData);

            // Change location
            router.push(`/wizard/${INITIATIVE_ID}/introduction/${REPORT_ID}`);
        } catch (error) {
            console.warn(error);
        }
    }

    async function completeReport() {
        try {
            const { data: reportData } = await ewUpdate(
                'initiative-report/initiative-report',
                REPORT_ID,
                {
                    Status__c: CONSTANTS.REPORTS.REPORT_IN_REVIEW,
                }
            );

            // Update store
            utilities.updateInitiativeData('_reports', reportData);

            // Close modal
            setShowModal(false);
        } catch (error) {
            console.warn(error);
        }
    }

    // ///////////////////
    // DATA
    // ///////////////////

    const currentReport = utilities.reports.get(REPORT_ID);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <div className="flex flex-col py-12 md:items-center md:justify-end md:flex-row bg-teal-20 page-px">
                <p className="flex items-center mb-12 mr-12 lg:mr-24 t-sh6 text-teal-60 md:flex md:mb-0">
                    {label('ReportViewReportStatus')}
                    <span className="px-8 pt-3 pb-1 mb-2 ml-8 text-blue-100 bg-blue-10 rounded-4 t-sh7">
                        {currentReport.Status__c}
                    </span>
                </p>
                {/* TODO: Out for now */}
                {/* <p className="mb-12 mr-12 lg:mr-24 t-small text-teal-60 md:flex md:mb-0 line-clamp-2">
                    <span className="mr-4 font-bold">
                        {labelTodo('6 more sections')}
                    </span>
                    <span>{labelTodo('needed before you can submit')}</span>
                </p>
                */}
                <div className="flex items-center self-end space-x-12">
                    {userInitiativeRights.canEdit &&
                        currentReport.Status__c !==
                            CONSTANTS.REPORTS.REPORT_PUBLISHED && (
                            <Button
                                theme="teal"
                                variant={
                                    [
                                        CONSTANTS.REPORTS.REPORT_IN_REVIEW,
                                        CONSTANTS.REPORTS.REPORT_PUBLISHED,
                                    ].includes(currentReport.Status__c)
                                        ? 'tertiary'
                                        : 'primary'
                                }
                                action={reportInProgress}>
                                {label('ButtonRunWizard')}
                            </Button>
                        )}
                    {userInitiativeRights.canEdit &&
                        currentReport.Status__c !==
                            CONSTANTS.REPORTS.REPORT_PUBLISHED && (
                            <Button
                                theme="teal"
                                variant={
                                    currentReport.Status__c ===
                                    CONSTANTS.REPORTS.REPORT_NOT_STARTED
                                        ? 'tertiary'
                                        : 'primary'
                                }
                                disabled={
                                    currentReport.Status__c ===
                                    CONSTANTS.REPORTS.REPORT_IN_REVIEW
                                }
                                action={() => setShowModal(true)}>
                                {label('ButtonSubmit')}
                            </Button>
                        )}
                </div>
            </div>
            <Modal
                isOpen={showModal}
                title={label('ModalReportCompleteHeader')}
                onCancel={() => setShowModal(false)}
                saveText={label('ButtonSubmit')}
                onSave={() => {
                    completeReport();
                }}>
                <p className="t-preamble">{label('ModalReportCompleteBody')}</p>
            </Modal>
        </>
    );
};

WizardStatusComponent.propTypes = {};

WizardStatusComponent.defaultProps = {};

export default WizardStatusComponent;
