const asId = string => {
    if (typeof asId === 'string') {
        return string?.toLowerCase().replace(/ /g, '-');
    } else {
        return string;
    }
};

export default asId;
