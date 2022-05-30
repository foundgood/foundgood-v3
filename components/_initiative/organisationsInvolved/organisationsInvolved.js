// Packages
import Image from 'next/image';

// Utilities
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import { getPermissionRules } from 'utilities';
import UpdateButton from 'components/updateButton';
import SectionWrapper from 'components/sectionWrapper';

// Icons
import { FiImage } from 'react-icons/fi';

const OrganisationsInvolvedComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();

    // ///////////////////
    // DATA
    // ///////////////////

    // Get all funders
    const funders = utilities.funders.getAll();

    // Get all collaborators
    const collaborators = utilities.collaborators.getAll();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <SectionWrapper className="bg-white rounded-8">
            <div className="flex justify-between">
                <h2 className="t-h3">
                    {label('InitiativeViewOrganisationsInvolvedHeading')}
                </h2>
                <UpdateButton
                    {...{
                        context: 'create',
                        rules: getPermissionRules(
                            'create',
                            'organisationsInvolved',
                            'update'
                        ),
                        baseUrl: 'organisations-involved',
                    }}
                />
            </div>

            {/* Collaborators List */}
            <h5 className="mt-24 mb-16 t-h5">
                {label('InitiativeViewOrganisationsInvolvedCollaborators')}
            </h5>
            <List {...{ organisations: collaborators }} />

            {/* Funders List */}
            <h5 className="mt-24 mb-16 t-h5">
                {label('InitiativeViewOrganisationsInvolvedFunders')}
            </h5>
            <List {...{ organisations: funders }} />
        </SectionWrapper>
    );
};

const List = ({ organisations }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="flex flex-col space-y-16">
            {organisations.length > 0 ? (
                organisations.map(organisation => (
                    <div
                        key={organisation.Id}
                        className="flex items-center p-16 space-x-16 bg-white border-4 border-amber-10 rounded-8">
                        <div className="flex items-center justify-center flex-shrink-0 w-64 h-64 text-teal-100 border-2 rounded-4 border-amber-10">
                            <FiImage size="36" className="stroke-current" />
                        </div>
                        <div className="t-sh4 whitespace-nowrap">
                            {organisation?.Account__r?.Name}
                        </div>
                    </div>
                ))
            ) : (
                <p className="flex items-center justify-center p-16 t-sh5 bg-teal-20 rounded-8">
                    {label(
                        'InitiativeViewOrganisationsInvolvedNoOrganisations'
                    )}
                </p>
            )}
        </div>
    );
};

OrganisationsInvolvedComponent.propTypes = {};

OrganisationsInvolvedComponent.defaultProps = {};

export default OrganisationsInvolvedComponent;
