import { configParams, configAjax } from './helpers';
import successHandler from './successHandler';
import ajaxErrorHandler from './ajaxErrorHandler';

const ajaxRequest = httpMethod => async (apiName, params = {}) => {
    if (typeof apiName !== 'string') {
        throw new Error('参数apiName的类型必须为string，请检查');
    }

    if (typeof params !== 'object' || Array.isArray(params)) {
        throw new Error('参数params的类型必须为object，请检查');
    }

    const ajaxOpts = {
        httpMethod,
        apiName,
        reqParams: configParams(params),
    };

    const ajax = configAjax(ajaxOpts);

    try {
        const ajaxResp = await ajax;
        const res = ajaxResp.body;

        if (process.env.NODE_ENV === 'testing' && ajaxResp.req) {
            // 为方便测试时拿到req params
            // 把superagent ajaxResp的req对象放进来
            res.req = ajaxResp.req;
        }

        if (res.errcode || res.errmsg) {
            return Object.assign({}, res, {
                errorType: 'apiError',
            });
        }

        return successHandler(res);
    } catch (err) {
        return ajaxErrorHandler(err);
    }
};

const $ajax = {
    get: ajaxRequest('get'),
    post: ajaxRequest('post')
};

export default $ajax;
