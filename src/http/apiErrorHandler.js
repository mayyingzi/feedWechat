import Vue from 'vue';
import _ from 'lodash';
import errorCode from './errorCode';

const errorHandler = {};

errorHandler['106'] = () => {
    Vue.$store.dispatch('toast', '请先登录');
};

errorHandler.common = (err, opt) => {
    const errMsg = err.errmsg || errorCode[err.errcode] || '未定义错误';

    if (!opt || !opt.noToast) {
        Vue.$store.dispatch('toast', errMsg);
    }
};

const handleError = (err, opt = null) => {
    const errCode = err.errcode;

    if (_.has(errorHandler, errCode)) {
        errorHandler[errCode]();
    } else {
        errorHandler.common(err, opt);
    }
};

export default handleError;
