import stroeModules from '@/store/modules';
import _ from 'lodash';

const {
    modules
} = stroeModules;

const {
    REPORT_UNIT_REQUEST,
    REPORT_USERNAME_UNIT,
    REPORT_UNIT_SUCCESS,
    REPORT_UNIT_FAILURE,
    REPORT_UNIT_SELECTED
} = modules.report.mutations;

describe('report mutations', () => {
    it('REPORT_UNIT_REQUEST', () => {
        const state = {
            loading: false,
            error: {
                status: '',
                message: ''
            }
        };
        const expDate = {
            loading: true,
            error: {
                status: '',
                message: ''
            }
        };
        REPORT_UNIT_REQUEST(state);
        expect(state).to.eql(expDate);
    });

    it('REPORT_USERNAME_UNIT', () => {
        const state = {
            userName: ''
        };
        const expDate = {
            userName: 'test with REPORT_USERNAME_UNIT'
        };
        REPORT_USERNAME_UNIT(state, expDate.userName);
        expect(state).to.eql(expDate);
    });

    it('REPORT_UNIT_SUCCESS', () => {
        const state = {
            loading: true,
            unitMsg: {
                apiData: null
            },
            error: {
                status: '',
                message: ''
            }
        };
        const expData = {
            loading: false,
            unitMsg: {
                apiData: {
                    code: 'dskskj',
                    name: '测试数据'
                }
            },
            error: {
                status: '',
                message: ''
            }
        };
        REPORT_UNIT_SUCCESS(state, expData.unitMsg.apiData);
        expect(state).to.eql(expData);
    });

    it('REPORT_UNIT_FAILURE', () => {
        const state = {
            loading: true,
            unitMsg: {
                apiData:{

                }
            },
            error: {
                status: '',
                message: ''
            }
        };
        const mockData = {
            status: '-1',
            message: '非法操作'
        };
        const expeData = {
            loading: false,
            unitMsg: {
                apiData:{
                    pianlians: []
                }

            },
            error: {
                ...mockData
            }
        };
        REPORT_UNIT_FAILURE(state, mockData);
        expect(state).to.eql(expeData);
    });

    describe('REPORT_UNIT_SELECTED', () => {
        const initState = {
            unitMsg: {
                apiData: {
                    pianlians:[],
                    type:''
                },
                selectedData: null,
                curPickerData:{
                    columns: 1, // 两列
                    pData1:[]
                }
            },
        };
        let state = null;
        beforeEach(() => {
            state = _.cloneDeep(initState);
            localStorage.clear();
        });
        it('should selected data from local correct, with same type', () => {
            const type = '2';
            state.unitMsg.apiData.type = type;
            const mockSelected = {
                localFlag: true,
                selected:{
                    data: {
                        code: 'S201',
                        type: 'pianlians',
                        company: {
                            code: '',
                            name:''
                        },
                        pianlian:{
                            code: 'S201',
                            name: '成都片联_片区级'
                        },
                        pianqu: {
                            code: '',
                            name: ''
                        }
                    },
                    type,
                }
            };
            const expData = _.cloneDeep(state);
            expData.unitMsg.selectedData = mockSelected.selected.data;
            REPORT_UNIT_SELECTED(state, mockSelected);
            expect(state).to.eql(expData);
        });
        it('should selected data from local correct, with diffrent type', () => {
            state.unitMsg.apiData = {
                type: '1',
                pianlians:[
                    {
                        code: 'S202',
                        pianlianName: '成都_片连',
                        pianqus: [
                            {
                                code: 'S011',
                                pianquName: '川北片区',
                                companys:[
                                    {
                                        code: '1009',
                                        ouname: '测试使用的公司名称'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
            const mockSelected = {
                localFlag: true,
                selected:{
                    type: 0,
                }
            };
            const expData = _.cloneDeep(state);
            expData.unitMsg.selectedData = mockSelected.selected.data;
        });
    });
});
