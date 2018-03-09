import storeModules from '@/store/modules';
import store from '@/store';
import { testAction } from '../../utils';

const { actions, getters, modules } = storeModules;
const { TOAST_SHOW, TOAST_HIDE } = modules.toast.mutations;
const { toast } = actions;
const { toastMsg } = getters;

describe('toast mutations', () => {
    it('TOAST_SHOW', () => {
        const state = { message: '' };
        const message = 'test msg';

        TOAST_SHOW(state, message);

        expect(state.message).to.eql(message);
    });

    it('TOAST_HIDE', () => {
        const state = { message: 'already has msg' };

        TOAST_HIDE(state);

        expect(state.message).to.eql('');
    });
});

describe('toast action', () => {
    it('不传入toastMsg参数，报错', () => {
        expect(() => {
            store.dispatch('toast');
        }).throw(Error);
    });

    it('toastMsg参数类型不为string，报错', () => {
        expect(() => {
            store.dispatch('toast', 123);
        }).throw(Error);

        expect(() => {
            store.dispatch('toast', { key: 'value' });
        }).throw(Error);

        expect(() => {
            store.dispatch('toast', [1, 2, 3]);
        }).throw(Error);

        expect(() => {
            store.dispatch('toast', undefined);
        }).throw(Error);

        expect(() => {
            store.dispatch('toast', null);
        }).throw(Error);
    });

    it('show and hide', (done) => {
        testAction(toast, ['test msg'], {}, [
            { type: 'TOAST_SHOW', payload: 'test msg' },
            { type: 'TOAST_HIDE' },
        ], done);
    }).timeout(3500);
});

describe('toast getter', () => {
    it('gets toast message', () => {
        const state = { toast: { message: 'toast message' } };
        const msgFromGetter = toastMsg(state);

        expect(msgFromGetter).to.deep.equal(state.toast.message);
    });
});
