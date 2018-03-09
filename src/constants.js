// import { name, version } from '../../package.json';

export const ENV = process.env.NODE_ENV;
export const API_ENV = process.env.API_ENV;

export const API_VERSION = '1.0';      // 正式开发时记得删除

// 接口设置
export const API_HOST = {
    alpha  : '//192.168.0.206/',
    beta   : '//bifeedservice.oak.net.cn',
    abtest : '//bifeedservice.oak.net.cn',
    release: '//bifeedservice.oak.net.cn',
};
