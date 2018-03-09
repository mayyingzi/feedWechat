import storeModules from '@/store/modules';
import _ from 'lodash';
import { testAction } from '../../utils';
// import store from '@/store';

const {
    actions,
    getters,
    modules
} = storeModules;
const {ALERT_SHOW,
    ALERT_HIDE
} = modules.alert.mutations;
const {
    alert,
    hideAlert
} = actions;
const {alertOpts} = getters;

describe('alert mutations', () => {
    describe('ALERT_SHOW', () => {
        it('no message params, throw error', () => {
            const state = {
                message: '',
            };
            expect(() => {
                ALERT_SHOW(state, {});
            }).throw(Error);
        });
        it('send a message', () => {
            const state = {
                message: ''
            };
            const message = 'test alert message';
            ALERT_SHOW(state, {message});
            expect(state.message).to.eql(message);
        });
        it('set buttons === 1, reset singleBtn', () => {
            const state = {
                message: '',
                buttons:'',
                singleBtn: {
                    text:'',
                    handler: ''
                }
            };
            const settings = {
                message: 'set buttons === 1',
                buttons: 1,
                singleBtn: {
                    text:'确认',
                    handler: 'close'
                }
            };
            ALERT_SHOW(state, {...settings});
            expect(_.pick(state, ['message', 'buttons', 'singleBtn'])).to.eql(settings);
        });
        it('no reset singleBtn, should use default,leftBtn&rightBtn in null', () => {
            const state = {
                message: '',
                buttons:'',
                singleBtn: null
            };
            const settings = {
                message: 'set buttons === 1',
                buttons: 1,
            };
            ALERT_SHOW(state, {...settings});
            expect(state.singleBtn).to.eql(null);
            expect(state.leftBtn).to.eql(null);
            expect(state.rightBtn).to.eql(null);
        });
        it('set button !==1, should leftBtn && rightBtn reset by default', () => {
            const state = {
                message: '',
                buttons: 1,
                singleBtn: {
                    text: '确认',
                    handler: 'close'
                },
                leftBtn: null,
                rightBtn: null
            };
            const settings = {
                message: 'set buttons!==1',
                buttons: 2
            };
            const expectDate = {
                message: settings.message,
                buttons: settings.buttons,
                singleBtn: null,
                leftBtn: {
                    text: '返回',
                    handler: 'goBack'
                },
                rightBtn: {
                    text: '确定',
                    handler: 'close'
                }
            };
            ALERT_SHOW(state, {...settings});
            expect(state).to.eql(expectDate);
        });
        it('set button !==1, should leftBtn && rightBtn reset by settings', () => {
            const state = {
                message: '',
                buttons: 1,
                singleBtn: {
                    text: '确认',
                    handler: 'close'
                },
                leftBtn: null,
                rightBtn: null
            };
            const settings = {
                message: 'set buttons!==1',
                buttons: 2,
                leftBtn: {
                    text: '取消',
                    handler: 'close'
                },
                rightBtn: {
                    text: '确认',
                    handler: 'goBack'
                }
            };
            const expectDate = {
                message: settings.message,
                buttons: settings.buttons,
                singleBtn: null,
                leftBtn: settings.leftBtn,
                rightBtn: settings.rightBtn
            };
            ALERT_SHOW(state, {...settings});
            expect(state).to.eql(expectDate);
        });
    });

    describe('ALERT_HIDE', () => {
        it('should ALERT_HIDE use right ', () => {
            const state = {
                message: '',
            };
            const settings = {
                message: 'add a message'
            };
            const expectData = {
                message: '',
                buttons: 1,
                leftBtn: null,
                rightBtn: null,
                singleBtn: {
                    text: '确定',
                    handler: 'close'
                }
            };
            ALERT_SHOW(state, settings);
            ALERT_HIDE(state);
            expect(state).to.eql(expectData);
        });
    });
});

describe('alert actions', () => {
    it('shuold alert show right', (done) => {
        const alertParams = {
            message: 'test alert action in alert',
            buttons: 1,
            singleBtn: {
                text: '确认',
                handler: 'close'
            }
        };
        testAction(alert, [alertParams], {}, [
            {type: 'ALERT_SHOW', payload :alertParams}
        ], done);
    });
    it('shuold alert hide right', (done) => {
        const expectData = {
            message: '',
            buttons: 1,
            leftBtn: null,
            rightBtn: null,
            singleBtn: {
                text: '确定',
                handler: 'close'
            }
        };
        testAction(hideAlert, [], {}, [
            {type: 'ALERT_HIDE', payload : expectData}
        ], done);
    });
});

describe('alert getter', () => {
    it('should gets alert options correct', () => {
        const state = {
            alert: {
                message: 'alert message',
                buttons: 1,
                leftBtn: null,
                rightBtn: null,
                singleBtn: {
                    text: '确认',
                    handler: 'goBack'
                }
            }
        };
        const alertFromGetter = alertOpts(state);
        expect(alertFromGetter).to.eql(state.alert);
    });
});
