import Vue from 'vue';
// import _ from 'lodash';

const buttonHandlers = {};

/**
 * 页面redirect
 * @param params {Object} 跳转页面所需参数，必须有url这个key
 */
// buttonHandlers.redirect = (params) => {
//     const errMsg = (msg) => {
//         const msgStart = 'alert组件的buttonHandlers.redirect方法';
//         const msgEnd = '请检查！';
//         throw new Error(`${msgStart}，${msg}，${msgEnd}`);
//     };

//     if (!params) {
//         errMsg('必须传入params参数');
//     }

//     if (typeof params !== 'object' && _.isArray(params)) {
//         errMsg('params参数的类型必须为对象');
//     }

//     const { url } = params;

//     if (!url) {
//         errMsg('params参数必须包含键值url');
//     }

//     Vue.$store.dispatch('hideAlert');
//     Vue.$router.push(url);
// };

/**
 * 关闭alert弹窗，并返回上一页
 */
// buttonHandlers.goBack = () => {
//     Vue.$store.dispatch('hideAlert');
//     Vue.$router.back();
// };

/**
 * 关闭alert弹窗
 */
buttonHandlers.close = () => {
    Vue.$store.dispatch('hideAlert');
};
/**
 * 取消绑定微信账号
 */
buttonHandlers.unbindWx = () => {
    console.log('解绑账号');
    Vue.$store.dispatch('hideAlert');
};

export default buttonHandlers;
