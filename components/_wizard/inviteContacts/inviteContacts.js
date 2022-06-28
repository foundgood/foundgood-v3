// React
import React, { useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useController, useFormState } from 'react-hook-form';

// Utilities
import { useLabels, useUser } from 'utilities/hooks';

// Components
import { Select } from 'components/_inputs';
import Button from 'components/button';

// Icons
import { FiUser, FiCheckCircle } from 'react-icons/fi';

const InviteContactsComponent = ({ contacts, organisations, form }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();

    // ///////////////////
    // FORMS
    // ///////////////////

    const {
        field: { onChange },
    } = useController({
        name: 'contacts',
        control: form.control,
        rules: { required: true },
    });
    const { errors } = useFormState({ control: form.control });

    // ///////////////////
    // STATE
    // ///////////////////

    const [list, setList] = useState({});

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div
            className={cc([
                'flex flex-col p-24 bg-teal-10 border-teal-10 border-2 rounded-8 bord',
                {
                    'border-error': errors.contacts,
                },
            ])}>
            <h5 className="mb-16 t-h5">
                {label('InviteContactsHeadingAdditional')}
            </h5>
            <ListComponent
                {...{
                    contactList: Object.values(contacts).reduce(
                        (acc, item) => [...acc, ...item],
                        []
                    ),
                    organisations,
                    list,
                    setList,
                    form,
                    onChange,
                }}
            />
        </div>
    );
};

const ListComponent = ({
    contactList,
    organisations,
    list,
    setList,
    form,
    onChange,
}) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label, pickList, getValueLabel } = useLabels();
    const { getUserId } = useUser();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="bg-white rounded-8">
            {/* Header */}
            <div className="grid grid-cols-10">
                <div className="col-span-4 p-8 px-12 t-footnote-bold text-teal-60">
                    {label('InviteContactsColumnOrganisation')} /{' '}
                    {label('InviteContactsColumnContact')}
                </div>
                <div className="col-span-4 p-8 px-12 t-footnote-bold text-teal-60">
                    {label('InviteContactsColumnPermission')}
                </div>
                <div className="col-span-2 p-8 px-12"></div>
            </div>

            {/* Map users */}
            {contactList.length > 0 ? (
                contactList.map(contact => (
                    <div key={contact.Id} className="grid grid-cols-10">
                        {/* Row (with border) */}
                        <div className="h-2 col-span-10 bg-teal-10"></div>
                        <div className="flex flex-col justify-center col-span-4 p-12 text-teal-100 t-caption">
                            <div className="truncate t-caption-bold">
                                {organisations.find(
                                    organisation =>
                                        organisation.Account__c ===
                                        contact.AccountId
                                )?.Account__r?.Name ?? ''}
                            </div>
                            <div className="flex items-center ">
                                <div className="flex items-center justify-center flex-shrink-0 w-20 h-20 mr-8 text-white rounded-full bg-teal-60">
                                    <FiUser className="w-16 h-16 stroke-current" />
                                </div>
                                <span
                                    className="mt-6 truncate"
                                    title={`${contact.FirstName} ${contact.LastName}`}>
                                    {`${contact.FirstName} ${contact.LastName}`}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center col-span-4 p-12">
                            {list[contact.Id] ? (
                                <div className="px-8 pt-3 pb-1 t-sh7 text-teal-120 bg-teal-20 rounded-4">
                                    <span className="mt-2">
                                        {getValueLabel(
                                            'Custom.InviteContactsPermission',
                                            list[contact.Id].type
                                        )}
                                    </span>
                                </div>
                            ) : (
                                <Select
                                    placeholder={'Select'}
                                    name={`permission-${contact.Id}`}
                                    controller={form.control}
                                    defaultValue={'Admin'}
                                    options={pickList(
                                        'Custom.InviteContactsPermission'
                                    )}
                                />
                            )}
                        </div>
                        <div className="flex items-center justify-end col-span-2 p-12 pl-8 t-caption text-teal-60">
                            {list[contact.Id] ? (
                                <>
                                    <FiCheckCircle className="w-16 h-16 mr-8 stroke-current" />
                                    <span className="mt-6">
                                        {contact.Id === getUserId()
                                            ? label('InviteContactsInvitedYou')
                                            : label('InviteContactsInvited')}
                                    </span>
                                </>
                            ) : (
                                <Button
                                    theme="teal"
                                    variant="secondary"
                                    action={() => {
                                        // Get next list
                                        const nextList = {
                                            ...list,
                                            [contact.Id]: {
                                                ...contact,
                                                type: form.getValues()[
                                                    `permission-${contact.Id}`
                                                ],
                                            },
                                        };

                                        // Update local state
                                        setList(nextList);

                                        // Update form
                                        onChange(nextList);
                                    }}>
                                    {label('InviteContactsInvite')}
                                </Button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex items-center px-8 py-16 text-teal-100 t-caption">
                    {label('InviteContactsAssignedEmpty')}
                </div>
            )}
        </div>
    );
};

InviteContactsComponent.propTypes = {
    contacts: t.object,
    organisations: t.array,
    form: t.object.isRequired,
};

InviteContactsComponent.defaultProps = {
    contacts: {},
    organsations: [],
};

export default InviteContactsComponent;
