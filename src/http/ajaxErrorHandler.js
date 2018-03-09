const ajaxErrorHandler = (err) => {
    let message = '';

    if (err.status === 404) {
        message = `[404] ${err.response.body.message}`;
    } else if (err.timeout) {
        message = '请求超时，请重新查询！';
    } else {
        message = JSON.stringify(err);
    }

    return {
        errorType: 'ajaxError',
        errmsg: message,
    };
};

export default ajaxErrorHandler;
