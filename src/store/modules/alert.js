import { ALERT_SHOW, ALERT_HIDE } from '../mutationTypes';

// state
const state = {
    // alert的信息，默认为空
    message: '',
    // alert弹窗的按钮数，默认为单个按钮
    buttons: 1,
    // 单按钮时，按钮的默认设置
    singleBtn: {
        // 按钮文字
        text: '确定',
        // 点击按钮后的触发的方法
        // 方法定义见src/components/alert/buttonHandlers.js
        handler: 'close',
    },
    // 双按钮时，左边按钮的设置，默认为null
    leftBtn: null,
    // 双按钮时，右边按钮的设置，默认为null
    rightBtn: null,
};

// mutations
const mutations = {
    [ALERT_SHOW](state, settings) {
        if (!settings.message) {
            throw new Error('请指定alert的信息');
        }

        state.message = settings.message;

        if (settings.buttons) {
            state.buttons = settings.buttons;
        }

        if (state.buttons === 1) {
            if (settings.singleBtn) {
                // 合并用户对单按钮的设置
                Object.assign(state.singleBtn, settings.singleBtn);
            }
            // 清空双按钮设置
            state.leftBtn = null;
            state.rightBtn = null;
        } else {
            const defaultLeftBtn = {
                text: '返回',
                handler: 'goBack',
            };

            const defaultRightBtn = {
                text: '确定',
                handler: 'close',
            };

            // 左右两个按钮，读取用户设置，或赋予默认值
            state.leftBtn = settings.leftBtn
                            ? Object.assign(defaultLeftBtn, settings.leftBtn)
                            : defaultLeftBtn;

            state.rightBtn = settings.rightBtn
                            ? Object.assign(defaultRightBtn, settings.rightBtn)
                            : defaultRightBtn;

            // 清空单按钮设置
            state.singleBtn = null;
        }
    },
    [ALERT_HIDE](state) {
        // 每次关闭，都reset alert组件到初始状态
        // 否则在多次设置后，各种设置过的状态会混杂在一起
        state.message = '';
        state.buttons = 1;
        state.leftBtn = null;
        state.rightBtn = null;
        state.singleBtn = {
            text: '确定',
            handler: 'close',
        };
    },
};

// actions
export const actions = {
    alert({ commit }, settings) {
        commit(ALERT_SHOW, settings);
    },
    hideAlert({ commit }) {
        commit(ALERT_HIDE);
    },
};

// getters
export const getters = {
    alertOpts(state) {
        return state.alert;
    },
};


export default {
    state,
    mutations,
};
