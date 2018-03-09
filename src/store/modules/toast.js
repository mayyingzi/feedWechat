import { TOAST_SHOW, TOAST_HIDE } from '../mutationTypes';

// state
const state = {
    message: '',
};

// mutations
export const mutations = {
    [TOAST_SHOW](state, toastMsg) {
        state.message = toastMsg;
    },

    [TOAST_HIDE](state) {
        state.message = '';
    },
};

// action
export const actions = {
    toast({ commit }, toastMsg) {
        if (!toastMsg) {
            throw new Error('toast组件dispatch的action，必须传入toastMsg参数，请检查！');
        }

        if (typeof toastMsg !== 'string') {
            throw new Error('toast组件dispatch的action，toastMsg参数类型必须为字符串，请检查！');
        }
        // toast时长
        const toastLength = 2000;
        // 触发toast
        commit(TOAST_SHOW, toastMsg);
        // 定时隐藏toast
        const toastTimer = setTimeout(() => {
            commit(TOAST_HIDE);
            clearTimeout(toastTimer);
        }, toastLength);
    },
};

// getter
export const getters = {
    toastMsg(state) {
        return state.toast.message;
    },
};

export default {
    state,
    mutations,
};
