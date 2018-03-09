import {
    // SET_TOKEN,
    // CLEAR_TOKEN,
    SET_USERNAME,
    CLEAR_USERNAME
} from '../mutationTypes';
import {setAuthSession, getAuthSession} from '../../utils/storage';

const state = {
    // token: null,
    // 用户名称，作为用户标识
    userName:null,
    // userName: 'LIUDAN5'
};

const mutations = {
    // [SET_TOKEN](state, token) {
    //     state.token = token;
    // },
    // [CLEAR_TOKEN](state) {
    //     state.token = null;
    // },
    [SET_USERNAME](state, userName) {
        state.userName = userName;
    },
    [CLEAR_USERNAME](state) {
        state.userName = null;
    },
};

// actions
export const actions = {
    // setToken({ commit }, token) {
    //     commit(SET_TOKEN, token);
    // },

    // clearToken({ commit }) {
    //     commit(CLEAR_TOKEN);
    // },
    setUserName({commit}, userName) {
        commit(SET_USERNAME, userName);
        setAuthSession({userName});
    },

    clearUserName({ commit }) {
        commit(CLEAR_USERNAME);
    },
    getUserNameL({commit}) {
        // 从本地session中获取用户信息
        const authLocal = getAuthSession();
        commit(SET_USERNAME, authLocal.userName);
    }
};
// getters
const authStore = state => state.auth;

export const getters = {
    authStore
};

export default {
    state,
    mutations,
};
