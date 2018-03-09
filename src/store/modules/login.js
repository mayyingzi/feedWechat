import Vue from 'vue';
import {
    USER_BIND_REQUEST,
    USER_BIND_SUCCESS,
    USER_BIND_FAILURE,
    SET_USERNAME,
} from '../mutationTypes';

const state = {
    loading: false,
    // 预留一个绑定成功字段
    apiMsg: '',
    error: {
        type: '',
        msg: '',
    }
};
export const mutations = {
    [USER_BIND_REQUEST](state) {
        state.loading = true;

        // reset noData info
        state.error.type = '';
        state.error.msg = '';
    },
    [USER_BIND_SUCCESS](state, res) {
        state.loading = false;
        state.apiMsg = res.data;

        // reset noData info
        state.error.type = '';
        state.error.msg = '';
    },
    [USER_BIND_FAILURE](state, res) {
        state.loading = false;
        state.apiMsg = '';
        state.error.type = res.status;
        state.error.msg = res.message;
    },
};

// actions
const goBindWx = async ({ commit }, query) => {
    commit(USER_BIND_REQUEST);
    const res = await Vue.$ajax.get('goBindWx', query);
    if (res.status === 1) {
        commit(USER_BIND_SUCCESS, res);
        commit(SET_USERNAME, query.userName);
        Vue.$router.replace({path:'/'});
    } else {
        commit(USER_BIND_FAILURE, res);
    }
};
export const actions = {
    goBindWx
};

// getters
const bindWx = state => state.login;
export const getters = {
    bindWx,
};

export default {
    state,
    mutations,
};
