// React
import React, { useEffect, useState } from "react";

// Packages
import cc from "classcat";
import t from "prop-types";
import Link from 'next/link';
import Image from 'next/image';

// Utilities
import { useContext, useElseware, useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/stores';

// Components

const BaseCardComponent = ({ prop }) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { CONTEXTS, MODE } = useContext();
    const { label } = useLabels();

    // ///////////////////
    // STATE
    // ///////////////////

    const [loading, setLoading] = useState(false);

    // ///////////////////
    // METHODS
    // ///////////////////

    function BaseCardMethod() {}

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {}, [])

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div className="">Base card</div>
    );
};

BaseCardComponent.propTypes = {};

BaseCardComponent.defaultProps = {};

export default BaseCardComponent;