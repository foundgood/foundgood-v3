const createQuerystring = params => {
    return Object.keys(params).length > 0
        ? `?${Object.keys(params)
              .map(key => key + '=' + params[key])
              .join('&')}`
        : '';
};

export default createQuerystring;
