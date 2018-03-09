import Vue from 'vue';
import _ from 'lodash';
import {setUnitSelected} from '../../utils/storage';

import {
    REPORT_UNIT_REQUEST,
    REPORT_UNIT_SUCCESS,
    REPORT_UNIT_FAILURE,
    REPORT_UNIT_SELECTED,
    REPORT_UNIT_PICKER_UPDATE,
    REPORT_DETAIL_SUCCESS,
    REPORT_DETAIL_FAILURE,
    REPORT_DETAIL_CHANGE,
    REPORT_USERNAME_UNIT
} from '../mutationTypes';

// 排序对象字段
export const sortByKey = (sortArr, sortObject) => {
    if (!sortArr) {
        return sortObject;
    }
    const newObj = {};// 创建一个新的对象，用于存放排好序的键值对
    for (let i = 0; i < sortArr.length; i++) { // 遍历newkey数组
        newObj[sortArr[i]] = sortObject[sortArr[i]];// 向新创建的对象中按照排好的顺序依次增加键值对
    }
    return newObj;// 返回排好序的新对象
};

const state = {
    loading: false,
    unitMsg: {
        /**
         * apiData{type,status}接口返回组织对象信息
         * type: 可以操作对象权限，1 所有可选， 2可操作片区及以下，3可操作公司，4显示，不可选择
         */
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
    error: {
        status: '',
        message: ''
    },
    // 销量信息
    apiDataSale: {
    },
    userName:''
};
// mutations
export const mutations = {
    [REPORT_UNIT_REQUEST](state) {
        state.loading = true;
        state.error.status = '';
        state.error.message = '';
    },
    [REPORT_USERNAME_UNIT](state, userName) {
        state.userName = userName;
    },
    [REPORT_UNIT_SUCCESS](state, res) {
        state.loading = false;
        state.unitMsg.apiData = res;
        state.error.status = '';
        state.error.message = '';
    },
    [REPORT_UNIT_FAILURE](state, res) {
        state.loading = false;
        state.unitMsg.apiData = {
            pianlians:[]
        };
        state.error.status = res.status;
        state.error.message = res.message;
    },
    [REPORT_UNIT_SELECTED](state, data) {
        if (data && data.localFlag) {
            if (data.selected.type === state.unitMsg.apiData.type) {
                state.unitMsg.selectedData =  data.selected.data;
                return;
            }
            data = null;
        }
        if (!data) {
            const unitMsg = state.unitMsg.apiData.pianlians;
            const operType = state.unitMsg.apiData.type;
            if (!unitMsg || !unitMsg[0]) {
                return;
            }
            // 1 可进行所有对象操作，2除片区以为，其余对象均可操作
            state.unitMsg.selectedData = {
                code:unitMsg[0].code,
                type: 'pianlians',
                pianlian:{
                    name: unitMsg[0].pianlianName,
                    code:unitMsg[0].code
                },
                pianqu:{
                    name:'',
                    code:''
                },
                company:{
                    name:'',
                    code:''
                }
            };
            if (operType === '3') {
                // 只能进行公司权限操作
                const initData = {
                    type:'pianqus',
                    code: unitMsg[0].pianqus[0].code,
                    pianqu:{
                        name: unitMsg[0].pianqus[0].pianquName,
                        code: unitMsg[0].pianqus[0].code
                    },
                    company:{
                        name:'',
                        code:''
                    }
                };
                _.extend(state.unitMsg.selectedData, initData);
            }
            if (operType === '4') {
                // 不能进行对象选择
                const initData = {
                    type:'companys',
                    code: unitMsg[0].pianqus[0].companys[0].code,
                    pianqu:{
                        name: unitMsg[0].pianqus[0].pianquName,
                        code: unitMsg[0].pianqus[0].code
                    },
                    company:{
                        name:unitMsg[0].pianqus[0].companys[0].ouname,
                        code:unitMsg[0].pianqus[0].companys[0].code
                    }
                };
                _.extend(state.unitMsg.selectedData, initData);
            }
            // 设置存储local选中的信息
            const localD = {
                data: {
                    ...state.unitMsg.selectedData
                },
                type: state.unitMsg.apiData.type,
                userName: state.userName
            };
            setUnitSelected(localD);

            return;
        }
        const  _data = state.unitMsg.selectedData;
        const dataKeyI = {
            name:'',
            code:''
        };
        const initData = {
            pianlian:{
                pianqu:{
                    ...dataKeyI
                },
                company:{
                    ...dataKeyI
                }
            },
            pianqu: {
                company:{
                    ...dataKeyI
                }
            }
        };
        if (data.isBySearch) {
            const operType = data.type;
            const lastCode = data.code;
            _data.type = operType;
            _data.code = data.value;
            if (operType === 'pianlians') {
                if (lastCode !== _data.code) {
                    const result = {
                        pianlian:{
                            code: data.value,
                            name: data.text
                        },
                        ...initData.pianlian
                    };
                    _.extend(_data, result);
                }
            } else if (operType === 'pianqus') {
                if (lastCode !== _data.code) {
                    const result = {
                        pianlian:{
                            code: data.parent.value,
                            name: data.parent.text
                        },
                        pianqu:{
                            code: data.value,
                            name: data.text
                        },
                        ...initData.pianqu
                    };
                    _.extend(_data, result);
                }
            } else {
                const result = {
                    pianlian:{
                        code: data.parent.parent.value,
                        name: data.parent.parent.text
                    },
                    pianqu:{
                        code: data.parent.value,
                        name: data.parent.text
                    },
                    company: {
                        code: data.value,
                        name: data.text
                    }
                };
                _.extend(_data, result);
            }
        } else {
            _data.type = `${data.type}s`;
            _data.code = data.value;
            _data[data.type].name = data.text;
            _data[data.type].code = data.value;
            if (!_data.code) {
                // 选择空数据，即不做选择
                if (_data.type === 'pianqus') {
                    // 片区为空, 其子关联公司为空处理,设置code为 片连code
                    _data.code = state.unitMsg.selectedData.pianlian.code;
                    _data.type = 'pianlians';
                } else if (_data.type === 'companys') {
                     // 公司为空, 设置code为 片区code
                    _data.code = state.unitMsg.selectedData.pianqu.code;
                    _data.type = 'pianqus';
                }
            }
            if (initData[data.type]) {
                _.extend(_data, initData[data.type]);
            }
        }
        _.extend(state.unitMsg.selectedData, _data);
        const localD = {
            data: {
                ...state.unitMsg.selectedData
            },
            type: state.unitMsg.apiData.type,
            userName: state.userName
        };
        setUnitSelected(localD);
    },
    [REPORT_UNIT_PICKER_UPDATE](state, params) {
        const {type, code} = params;
        const listUnit = state.unitMsg.apiData.pianlians;
        const result = [];
        if (type === 'pianlians' && !code) {
            // 设置一个空选项
            // result.push({text:'', value: null, type:'pianlian'});
            // console.log('返回片联数组');
            _.map(listUnit, (pianlian) => {
                result.push({text:pianlian.pianlianName, value: pianlian.code, type:'pianlian'});
            });
        } else if (type === 'pianqus' && code) {
            // 设置一个空选项
            result.push({text:'', value: null, type:'pianqu'});

            // console.log('返回片区数组');
            _.map(listUnit, (pianlian) => {
                if (pianlian.code === code) {
                    _.map(pianlian.pianqus, (item) => {
                        result.push({text:item.pianquName, value: item.code, type:'pianqu'});
                    });
                }
            });
        } else {
            // 设置一个空选项
            result.push({text:'', value: null, type:'company'});
            // console.log('返回公司数组');
            _.map(listUnit, (pianlian) => {
                _.map(pianlian.pianqus, (pianqu) => {
                    if (pianqu.code === code) {
                        console.log(code);
                        _.map(pianqu.companys, (company) => {
                            result.push({text:company.ouname, value: company.code, type:'company'});
                        });
                    }
                });
            });
        }

        state.unitMsg.curPickerData.pData1 = result;
    },
    [REPORT_DETAIL_SUCCESS](state) {
        // console.log(config);
        state.loading = false;
        state.error.status = '';
        state.error.message = '';
    },
    [REPORT_DETAIL_FAILURE](state, res) {
        state.loading = false;
        state.error.status = res.status;
        state.error.message = res.message;
    },
    [REPORT_DETAIL_CHANGE]() {

    },
};
// actions
// 根据类型获取报表详情
const fetchReportDetail = async ({ commit }, param) => {
    const apiName = {
        daliy:{
            sale: 'getSaleMsg',
            income: 'getSaleMsg',
            receivable: 'getReceivable'
        },
        month: {
            sale: 'getSaleMsgM',
            income: 'getSaleMsgM',
            receivable: ''
        }
    };
    let query = {};
    // 测试 'S032'
    query.ouCode = param.ouCode;
    query.time = param.time;
    commit(REPORT_UNIT_REQUEST);
    // 接口参数 ouCode=S032&time=2017/12/8
    let res = {
        status:-1,
        message:''
    };
    if (query.ouCode) {
        if (param.type === 'receivable') {
            // 应收帐，返回接口时间，无需时间参数
            query = _.omit(query, 'time');
        }
        res = await Vue.$ajax.get(apiName[param.dateType][param.type], query);
        res.TabType = param.type;
    } else {
        res.message = '非法操作';
    }

    if (Number(res.status === 1) || res.name) {
        if (param.type !== 'receivable') {
            const SORTKEY = ['pigbean', 'birdbean', 'fishbean', 'otherbean', 'name', 'total', 'totalMount'];
            res = sortByKey(SORTKEY, res);
        }
        commit(REPORT_DETAIL_SUCCESS, res);
    } else {
        commit(REPORT_DETAIL_FAILURE, res);
    }
    return res;
};

const fetchUnitMsg = async ({ commit }, param) => {
    let initSelect = {};
    if (param.selected) {
        initSelect.localFlag = true;
        initSelect.selected = param.selected;
    } else {
        initSelect = null;
    }
    const query = param.query;
    commit(REPORT_USERNAME_UNIT, query.userName);
    commit(REPORT_UNIT_REQUEST);
    let res = null;
    if (!param.needFetch) {
        res = {
            status: 1,
            ...param.data

        };
        commit(REPORT_UNIT_SUCCESS, res);
        commit(REPORT_UNIT_SELECTED, initSelect);
        return;
    }
    res = await Vue.$ajax.get('getUnitMsg', query);
    if (res.status === 1 || res.type) {
        commit(REPORT_UNIT_SUCCESS, res);
        commit(REPORT_UNIT_SELECTED, initSelect);
    } else {
        commit(REPORT_UNIT_FAILURE, res);
    }
};
const unitUpdatePicker = ({commit}, params) => {
    /**
     * param:{,type,code}
     * type: pianlians,pianqus,companys
     * code: 对应分类code
     */
    commit(REPORT_UNIT_PICKER_UPDATE, params);
};

const comfirmUnitPer = ({commit}, data) => {
    commit(REPORT_UNIT_SELECTED, data);
};

export const actions = {
    fetchUnitMsg,
    fetchReportDetail,
    unitUpdatePicker,
    comfirmUnitPer
};

// getters
const reportStore = state => state.report;
const allMacthList = (state) => {
    const apiData = state.report.unitMsg.apiData;
    const type = Number(apiData.type);
    const result = [];
    const blockType = ['pianlians', 'pianqus', 'companys'];
    _.map(apiData[blockType[0]], (pianlian) => {
        let curPL = {};
        let curPq = {};
        curPL = {
            text: pianlian.pianlianName,
            value: pianlian.code,
            type: blockType[0]
        };
        if (type === 1) {
            result.push(curPL);
        }
        _.map(pianlian[blockType[1]], (pianqu) => {
            curPq = {
                text: pianqu.pianquName,
                value: pianqu.code,
                type: blockType[1],
                parent:{
                    ...curPL
                }
            };
            if (type < 3) {
                result.push(curPq);
            }
            _.map(pianqu[blockType[2]], (company) => {
                if (type < 4) {
                    const firm = {
                        text: company.ouname,
                        value: company.code,
                        type: blockType[2],
                        parent:{
                            ...curPq,
                        }
                    };
                    result.push(firm);
                }
            });
        });
    });

    return result;
};
export const getters = {
    reportStore,
    allMacthList
};

export default {
    state,
    mutations
};

