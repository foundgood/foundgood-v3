// React
import React, { useState } from 'react';

// Packages
import { useRouter } from 'next/router';

// Utilities
import {
    useLabels,
    useContext,
    useElseware,
    useModalState,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';
import Permission from 'components/permission';
import ConfirmModal from 'components/_modals/confirmModal';

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
    const { INITIATIVE_ID, REPORT_ID } = useContext();
    const { ewUpdate } = useElseware();
    const {
        modalState,
        modalOpen,
        modalClose,
        modalSaving,
        modalNotSaving,
    } = useModalState();

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
            router.push(`/report/${INITIATIVE_ID}/introduction/${REPORT_ID}`);
        } catch (error) {
            console.warn(error);
        }
    }

    async function completeReport() {
        // Modal save button state
        modalSaving();
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
            modalClose();

            // Modal save button state
            modalNotSaving();
        } catch (error) {
            // Modal save button state
            modalNotSaving();
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
                <div className="flex items-center self-end space-x-12">
                    <Permission
                        {...{
                            rules: [
                                'grantee.admin',
                                'grantee.collaborator',
                                'super',
                            ],
                            additionalRules: [
                                currentReport.Status__c !==
                                    CONSTANTS.REPORTS.REPORT_PUBLISHED,
                            ],
                        }}>
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
                            action={modalOpen}>
                            {label('ButtonSubmit')}
                        </Button>
                    </Permission>
                </div>
            </div>
            <ConfirmModal
                {...{
                    onCancel() {
                        modalClose();
                    },
                    async onSave() {
                        await completeReport();
                    },
                    saveText: label('ButtonSubmit'),
                    title: label('ModalReportCompleteHeader'),
                    ...modalState,
                }}>
                <p className="t-preamble">{label('ModalReportCompleteBody')}</p>
            </ConfirmModal>
        </>
    );
};

WizardStatusComponent.propTypes = {};

WizardStatusComponent.defaultProps = {};

export default WizardStatusComponent;
