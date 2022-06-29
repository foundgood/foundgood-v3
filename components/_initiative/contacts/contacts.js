// Packages
import Image from 'next/image';

// Utilities
import { getPermissionRules } from 'utilities';
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import UpdateButton from 'components/updateButton';
import SectionWrapper from 'components/sectionWrapper';

const ContactsComponent = () => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, getValueLabel } = useLabels();

    // ///////////////////
    // DATA
    // ///////////////////

    // Get all members
    const teamMembers = utilities.teamMembers.getAll();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <SectionWrapper className="bg-white rounded-8">
            <div className="flex justify-between">
                <h2 className="t-h3">
                    {label('InitiativeViewContactsHeading')}
                </h2>
                <UpdateButton
                    {...{
                        context: 'create',
                        rules: getPermissionRules(
                            'create',
                            'shareWithContacts',
                            'update'
                        ),
                        baseUrl: 'share-with-contacts',
                    }}
                />
            </div>
            <div className="flex flex-col mt-48 space-y-16">
                <table>
                    <thead>
                        <tr>
                            <td className="p-8 t-footnote-bold">
                                {label('InitiativeViewContactsTableContact')}
                            </td>
                            <td className="p-8 t-footnote-bold">
                                {label(
                                    'InitiativeViewContactsTableOrganisation'
                                )}
                            </td>
                            <td className="p-8 t-footnote-bold">
                                {label('InitiativeViewContactsTablePermission')}
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {teamMembers.length > 0 ? (
                            teamMembers.map((member, index) => (
                                <tr
                                    key={member.Id + index}
                                    className="border-t-2 border-amber-10">
                                    <td className="px-8 pb-12 pt-18 t-caption">
                                        {member.User__r?.Name}
                                    </td>
                                    <td className="px-8 pb-12 pt-18 t-caption">
                                        {member.Account__c}
                                    </td>
                                    <td className="flex px-8 pb-12 pt-18 t-caption">
                                        <div className="px-8 pt-3 pb-1 -mt-3 t-sh7 text-blue-80 bg-blue-20 rounded-4">
                                            {getValueLabel(
                                                'Custom.InviteContactsPermission',
                                                member.Team_Member_Role__c
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    className="px-8 pb-12 pt-18 t-caption"
                                    colSpan={3}>
                                    {label('InviteContactsAssignedEmpty')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </SectionWrapper>
    );
};

ContactsComponent.propTypes = {};

ContactsComponent.defaultProps = {};

export default ContactsComponent;
