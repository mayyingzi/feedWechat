import storeModules from '@/store/modules';
// import sion from 'sinon';
// import {testAction} from '../../utils';
// import store from '@/store';

const {
    modules,
    getters,
    // actions
} = storeModules;
const {
    USER_BIND_REQUEST,
    USER_BIND_SUCCESS,
    USER_BIND_FAILURE
} = modules.login.mutations;

const {
    bindWx
} = getters;

// const {
//     goBindWx
// } = actions;

describe('login mutaions', () => {
    it('USER_BIND_REQUEST', () => {
        const state = {
            loading: false,
            error: {
                type: 2,
                msg: '微信账号绑定-请求状态中'
            }
        };
        const expData = {
            loading: true,
            error: {
                type: '',
                msg: ''
            }
        };
        USER_BIND_REQUEST(state);
        expect(state).to.eql(expData);
    });
    it('USER_BIND_SUCCESS', () => {
        const state = {
            loading: true,

            error: {
                type: 1,
                msg: ''
            }
        };
        const expData = {
            loading: false,
            apiMsg: '绑定信息成功',
            error: {
                type:'',
                msg:''
            }
        };
        USER_BIND_SUCCESS(state, {data: expData.apiMsg});
        expect(state).to.eql(expData);
    });
    it('USER_BIND_FAILURE', () => {
        const state = {
            loading: true,
            apiMsg: '预留接口信息字段，暂时没有使用',
            error: {
                type: 9,
                msg: '初始化报错信息'
            }
        };
        const error = {
            status: -1,
            message: '接口请求绑定失败'
        };
        const expData = {
            loading: false,
            apiMsg: '',
            error: {
                type: -1,
                msg: '接口请求绑定失败'
            }
        };
        USER_BIND_FAILURE(state, {...error});
        expect(state).to.eql(expData);
    });
});

describe('login getters', () => {
    it('should gets login options correct', () => {
        const state = {
            login: {
                loading: true,
                apiMsg: '',
                error: {
                    type: '',
                    msg: ''
                }
            }

        };
        const loginFromGetter = bindWx(state);

        expect(loginFromGetter).to.eql(state.login);
    });
});

describe('login actions', () => {
    // const fakeSuccessResponse = {
    //     status: 1,
    //     errmsg: '',
    //     data: {

    //     }
    // };

    // const fakeFailResponse = {
    //     errcode: -1,
    //     message: '账户/密码输入错误',
    // };
    // const okJSON = JSON.stringify(fakeSuccessResponse);
    // const failJSON = JSON.stringify(fakeFailResponse);
    // let server;
    beforeEach(() => {
        // server = sion.fakeServer.create();
    });
    afterEach(() => {
        // sion.restore();
    });
    // it('goBindWx should fetch correct status ===1', (done) => {
    //     const query = {
    //         openID: 'sdhjshd562289shdhd',
    //         userName: 'jokes',
    //         passWord: '1234ee56'
    //     };
    //     testAction(goBindWx, [{...query}], {}, [
    //         {type:'USER_BIND_REQUEST', payload:{}}
    //     ]);
    // });
});
