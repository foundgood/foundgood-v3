// Remove undefined values from array
const stripUndefined = array => {
    var result = [];
    array.forEach(function (item) {
        if (Array.isArray(item) && item.length != 0) {
            // Item is a nested array, go one level deeper recursively
            result.push(stripUndefined(item));
        } else if (typeof item !== 'undefined') {
            result.push(item);
        }
    });
    return result;
};

export default stripUndefined;
