import storeModules from '@/store/modules';
// import store from '@/store';
import {testAction} from '../../utils';
import {setAuthSession} from '../../../../src/utils/storage';

const {
    modules,
    actions,
    getters
} = storeModules;
const {
    SET_USERNAME,
    CLEAR_USERNAME
 } = modules.auth.mutations;
const {
    setUserName,
    clearUserName,
    getUserNameL
} = actions;

const {
    authStore
} = getters;

describe('auth mutations', () => {
    it('SET_USERNAME', () => {
        const state = {
            userName: null
        };
        const userName = 'set user name';
        SET_USERNAME(state, userName);
        expect(state.userName).to.eql(userName);
    });
    it('CLEAR_USERNAME', () => {
        const state = {
            userName: 'init userName'
        };
        CLEAR_USERNAME(state);
        expect(state.userName).to.eql(null);
    });
});

describe('auth actions', () => {
    afterEach(() =>  {
        localStorage.clear();
    });
    it('should setUserName correct', (done) => {
        const userName = 'setUserName';
        testAction(setUserName, [userName], {}, [
            {type: 'SET_USERNAME', payload: userName}
        ], done);
    });
    it('should clearUserName correct', (done) => {
        testAction(clearUserName, [], {}, [
            {type: 'CLEAR_USERNAME', payload: null}
        ], done);
    });
    it('should getUserNameL corect', (done) => {
        const authMsg = {
            userName: 'get from local'
        };
        setAuthSession({...authMsg});
        testAction(getUserNameL, [], {}, [
            {type: 'SET_USERNAME', payload: authMsg.userName}
        ], done);
    });
});

describe('auth getters', () => {
    it('should get auth getter correct', () => {
        const state = {
            auth: {
                userName: 'test auth getters authStore'
            }
        };
        const authFromGetters = authStore(state);
        expect(state.auth).to.eql(authFromGetters);
    });
});

