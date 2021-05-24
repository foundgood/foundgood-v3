// React
import React, { useState, useEffect, useRef } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useController } from 'react-hook-form';
import DayPicker from 'react-day-picker/DayPicker';
import 'react-day-picker/lib/style.css';
import dayjs from 'dayjs';

// Utilities

// Components

// Icons
import { FiX } from 'react-icons/fi';

const SearchFilterDateComponent = ({ controller, label, name, options }) => {
    // Local state
    const [listWrapper, toggleListWrapper] = useState(false);

    // Ref: Mobile navigation wrapper
    const listWrapperRef = useRef(null);

    // Effect: Catch outside clicks and close
    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [listWrapper]);

    // Function: Event wrapper for closing outside click
    function handleClick(event) {
        if (
            listWrapper &&
            listWrapperRef.current &&
            !listWrapperRef.current.contains(event.target)
        ) {
            toggleListWrapper(false);
        }
    }

    // Controller from useForm
    const {
        field: { onChange, value },
    } = useController({
        name,
        control: controller,
    });

    return (
        <div className="relative flex m-8">
            <button
                className={cc([
                    ' py-6 text-left text-blue-300 outline-none pt-11 focus:ring-2 bg-blue-20 t-small focus:ring-blue-100 focus:outline-none',
                    {
                        'rounded-l-4 pr-8 pl-16': value,
                        'rounded-4 px-16': !value,
                    },
                ])}
                onClick={event => {
                    event.preventDefault();
                    toggleListWrapper(!listWrapper);
                }}>
                {`${label} `}
                <span className="font-bold">
                    {value ? dayjs(value).format('DD.MM.YYYY') : '...'}
                </span>
            </button>
            {value && (
                <button
                    onClick={() => onChange(null)}
                    className="pl-8 pr-16 text-blue-300 outline-none focus:ring-2 bg-blue-20 t-small focus:ring-blue-100 focus:outline-none rounded-r-4">
                    <FiX />
                </button>
            )}
            <div
                ref={listWrapperRef}
                className={cc([
                    'absolute flex flex-col p-16 mt-8 space-y-16 text-blue-300 t-h6 bg-blue-20 top-full rounded-4 z-above transition-default',
                    {
                        'opacity-100 pointer-events-auto': listWrapper,
                        'opacity-0 pointer-events-none': !listWrapper,
                    },
                ])}>
                <DayPicker
                    firstDayOfWeek={1}
                    selectedDays={value}
                    onDayClick={event => {
                        toggleListWrapper(!listWrapper);
                        if (event === value) {
                            onChange(null);
                        } else onChange(event);
                    }}
                />
            </div>
            <style global jsx>
                {`
                    .DayPicker-Day {
                        line-height: 1 !important;
                    }
                `}
            </style>
        </div>
    );
};

SearchFilterDateComponent.propTypes = {
    name: t.string,
};

SearchFilterDateComponent.defaultProps = {};

export default SearchFilterDateComponent;
