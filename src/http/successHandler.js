import _ from 'lodash';

const hasValidData = (res) => {
    if (!_.has(res, 'data')) {
        // 返回的数据中没有data字段
        return false;
    } else if (typeof res.data === 'object' &&
        // 返回的数据中data字段为空对象或空数组
        _.isEmpty(res.data)) {
        return false;
    } else if (typeof res.data === 'string' &&
        !res.data.length) {
        // 返回的数据中data字段为空字符串
        return false;
    }

    return true;
};

const successHandler = (res) => {
    if (!hasValidData(res)) return res;

    const finalData = res.data;

    if (process.env.NODE_ENV === 'testing' && res.req) {
        finalData.req = res.req;
    }

    return finalData;
};

export default successHandler;
