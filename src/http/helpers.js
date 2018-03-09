import request from 'superagent/lib/client';
import {
    API_VERSION,
    API_HOST, API_ENV,
    // ENV
} from '@/constants';
// import store from '@/store';
import apiMapping from '@/api/apiMapping';

const resolveApi = (apiName) => {
    const regex = new RegExp(/(http:\/\/|https:\/\/)/g);
    const absoluteAddr = regex.test(apiName);

    // 传入的为绝对请求路径，直接返回
    if (absoluteAddr) return apiName;

    // 传入的为api name，到mapping处找出对应的url
    const apiUrl = apiMapping[apiName];

    if (!apiUrl) {
        throw new Error(
            `没有找到对应的api路径，请检查API名称：${apiName} 是否正确`
        );
    }

    const formatUrl = apiUrl[0] !== '/' ? `/${apiUrl}` : apiUrl;
    const apiHost = API_HOST[API_ENV];

    return apiHost + formatUrl;
};

export const configParams = (reqParams) => {
    const params = {};
    // const token = (ENV === 'testing' || API_ENV !== 'release')
    //             ? Math.ceil(Math.random() * 100000).toString()
    //             : store.state.auth.token;
    // const token = store.state.auth.token;
    // 加入共同参数
    Object.assign(params, reqParams, {
        api_version: API_VERSION,
        // token,
    });

    return params;
};

export const configAjax = (options) => {
    const { httpMethod, apiName, reqParams } = options;
    const ajaxTimeout = 20000;
    // const ajaxTimeout = 200; // 测试timeout用的时间限制

    const ajax = request[httpMethod](resolveApi(apiName))
                .timeout(ajaxTimeout)
                .accept('application/json');

    if (httpMethod === 'get') {
        ajax.query(reqParams);
    } else {
        const serializeType = 'application/x-www-form-urlencoded';
        const reqParamsStr = request.serialize[serializeType](reqParams);
        ajax.send(reqParamsStr);
    }

    return ajax;
};
