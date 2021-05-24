const asId = string => {
    return string?.toLowerCase().replace(/ /g, '-');
};

export default asId;
