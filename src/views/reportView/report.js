import { mapGetters, mapActions } from 'vuex';
import DataPicker from 'vue-ios-datepicker';
import _ from 'lodash';
import VuePickers from 'vue-pickers';
import fullTime from '../../utils/date';
import { setUnitSession, getUnitSession, getUnitSelected } from '../../utils/storage';


const initNowDate = fullTime();
const initYestDate = fullTime(true);
const SMALAPIREG = /(^sale$)|(^income$)/;

export default {
    name: 'reportView',
    components: {
        loading: require('@/components/Loading'),
        alert: require('@/components/Alert'),
        toast  : require('@/components/Toast'),
        VuePickers
    },
    filters: {
        floatMoney(value) {
            value = value || 0;
            return Math.floor(value  * 100) / 100;
        },
        floatWe(value) {
            value = value || 0;
            return Math.floor(value  * 1000) / 1000;
        },
        pareDate(date) {
            if (date) {
                return date.replace(/-/g, '.');
            }
            return '';
        }
    },
    data() {
        return {
            curUpDetail:'', // 当前打开的明细
            loadingText: '加载中',
            // 是否显示 选择对象
            isShowUnit: false,
            cashCode:'',
            recivieDate:`${initYestDate.getFullYear}.${initYestDate.getMonth}.${initYestDate.getDate}`,
            // 设置日期阶梯
            dateDuration: [`${initNowDate.getFullYear - 20}-1-1`, `${initYestDate.getFullYear}-${initYestDate.getMonth}-${initYestDate.getDate}`],
            // 当前显示报表数据
            curTabRep: {
                // sale销量（默认选中），income收入，receivable应收账款
                tabType: 'sale',
                // 报表日期格式： daliy日报表， month月报表
                dateType: 'daliy',
                selectedDate: `${initYestDate.getFullYear}.${initYestDate.getMonth}.${initYestDate.getDate}`,
                selectedYm: `${initNowDate.getFullYear}.${initNowDate.getMonth}`
            },
            // 是否显示搜索匹配列表
            isShowSearch: false,
            inputSeach: '',
            pickMatchList:[],
            // 选择组织对象picker
            showUnitPicker: false,
            domPickers: {
                dom:'',
                top:'',
                translate:''
            },
            // 报表线详情
            reDetail:{
                curDetail:{
                    data:{
                        name:'总计',
                        total: 0
                    }
                },
                // 销量
                sale:{
                    daliy:{
                        time:'',
                        apiData:{}
                    },
                    month:{
                        time:'',
                        apiData:{}
                    }
                },
                // 收入
                income: {
                    daliy:{
                        time:'',
                        apiData:{}
                    },
                    month:{
                        time:'',
                        apiData:{}
                    }
                },
                // 应收账款
                receivable: {
                    daliy:{
                        time:'',
                        apiData:{}
                    },
                    month:{
                        time:'',
                        apiData:{}
                    }
                }
            }
        };
    },
    watch: {
        reportStore: {
            deep: true,
            handler(val) {
                if (val.error.message && val.error.status !== 1 && !this.isShowUnit) {
                    this.alert({ message: val.error.message });
                } else if (val.unitMsg.apiData.pianlians) {
                    setUnitSession(val.unitMsg.apiData);
                }
            }
        },
        seUnitData: {
            deep: true,
            handler() {
                if (!this.canFetchData || this.isShowUnit || this.inputSeach) {
                    return;
                }
                this.updateDetailRe();
            }
        },
        inputSeach: {
            handler(val) {
                const _val = _.trim(val);
                if (_val.length) {
                    this.isShowSearch = true;
                    this.pickMatchList = this.pickMatchListFn(_val);
                } else {
                    this.isShowSearch = false;
                }
            }
        }
    },
    mounted() {
        this.resetDatePlug('date', '.curDate');
        this.resetDatePlug('ym', '.curYm');
        this.resetUnitMsg();
        this.domPickers.dom = document.querySelector('.area_province');
    },
    computed: {
        ...mapGetters([
            'alertOpts',
            'reportStore',
            'authStore',
            'toastMsg',
            'allMacthList'
        ]),
        seUnitData() {
            // 返回已选择的报表参数
            const unitData = this.$store.state.report.unitMsg.selectedData;
            const curTabMsg = this.curTabRep;
            const params = {
                ...unitData,
                curTabMsg
            };
            return params;
        },
        canFetchData() {
            return !!this.reportStore.unitMsg.selectedData;
        }
    },
    methods: {
        ...mapActions([
            'alert',
            'toast',
            'fetchUnitMsg',
            'unitUpdatePicker',
            'comfirmUnitPer',
            'fetchReportDetail'
        ]),
        resetUnitMsg() {
            const localUnit = getUnitSession();
            const localUnitSelect = getUnitSelected();
            const param = {
                query:{
                    userName: this.authStore.userName
                },
                needFetch: true
            };
            if (localUnit) {
                param.needFetch = false;
                param.data = localUnit;
            }
            // 暂时都不做缓存
            if (false && localUnitSelect) {
                param.selected = localUnitSelect;
            }
            this.fetchUnitMsg(param);
        },
        /**
         * 修改报表类型
         * type 取值 ：sale销量（默认选中），income收入，receivable应收账款
         * @param type
         */
        changeReTab(type) {
            this.curTabRep.tabType = type;
        },
        selectUnitFn() {
            this.isShowUnit = true;
            this.cashCode = this.seUnitData.code;
        },
        changetUnitFn() {
            // 确认修改 组织对象
            this.isShowUnit = false;
            if (this.cashCode !== this.seUnitData.code) {
                // console.log('确认修改，并且设置不一样');
                this.updateDetailRe(true);
            }
        },
        /**
         * 切换报表日期格式
         * type: daliy 日报表， month 月报表
         * @param type
         */
        changeDateTab(type) {
            if (type === this.curTabRep.dateType) return;
            this.curTabRep.dateType = type;
        },
        // 初始还日期信息
        resetDatePlug(type, trigger) {
            const calendar = new DataPicker();
            const self = this;
            calendar.init({
                // 按钮选择器，用于触发弹出插件
                trigger,
                // 模式：date日期；ym年月；
                type,
                // 最小日期
                minDate: self.dateDuration[0],
                // 最大日期
                maxDate: self.dateDuration[1],
                // 确认时触发事件
                onSubmit() {
                    // console.log('确定');
                    // console.log(calendar.value);
                    if (type === 'date') {
                        self.curTabRep.selectedDate = calendar.value.replace(/-/g, '.');
                    } else {
                        self.curTabRep.selectedYm = calendar.value.replace(/-/g, '.');
                    }
                },
                // 取消时触发事件
                onClose() {
                    // console.log('关闭2');
                }
            });
        },
        // 关闭组织选择弹窗
        closeUnitPick() {
            this.showUnitPicker = false;
            this.resetUnitPickSty();
        },
        resetUnitPickSty(top, translate) {
            const _top = top || 0;
            const _translate = translate || 0;
            this.domPickers.dom.setAttribute('top', _top);
            this.domPickers.dom.style['-webkit-transform'] = `translate3d(0, ${_translate}, 0)`;
        },
        confirmUnitPick(data) {
            /**
             * 当前选中数据
             * {
             *      text:"山东经营特区_片区级",
             *      type: "pianlian",
             *      value: "S202
             * }
             */
            const selectData = data.select1;
            this.showUnitPicker = false;
            if (this.isPickerRest(selectData)) {
                this.comfirmUnitPer(selectData);
            }
            this.resetUnitPickSty();
        },
        confirmRecPick(data) {
            const selectData = {};
            const curType = this.seUnitData.type;
            if (curType === 'companys') {
                // && Number(this.reportStore.unitMsg.apiData.type) > 4
                return;
            }
            const childNode = {
                pianlians: 'pianqu',
                pianqus: 'company',
            };
            selectData.type = childNode[curType];
            selectData.value = data.code;
            selectData.text = data.name;

            if (this.isPickerRest(selectData)) {
                this.comfirmUnitPer(selectData);
            }
            this.resetUnitPickSty();
        },
        isPickerRest(data) {
            const {type, value} = data;
            if (value && value === this.reportStore.unitMsg.selectedData[type].code) {
                return false;
            }
            return true;
        },
        updatePicker(type) {
            const storeSelected = this.reportStore.unitMsg.selectedData;
            /**
             * param:{,type,code}
             * type: pianlians,pianqus,companys
             * code: 对应分类code
             */
            const params = {
                type,
                code:''
            };
            const parentName = type === 'pianqus' ? 'pianlian' : 'pianqu';


            if (type !== 'pianlians') {
                params.code = storeSelected[parentName].code;
            }
            if (!params.code && type !== 'pianlians') {
                this.toast('请按照顺序，选择关联对象');
                return;
            }
            this.showUnitPicker = true;
            this.unitUpdatePicker(params);
        },
        async updateDetailRe(forceUpdate) {
            const selectTab = this.seUnitData;
            const feParams = {
                type: selectTab.curTabMsg.tabType,
                ouCode: selectTab.code,
                dateType: selectTab.curTabMsg.dateType,
                time: (selectTab.curTabMsg.dateType === 'daliy' ? selectTab.curTabMsg.selectedDate : selectTab.curTabMsg.selectedYm).replace(/\./g, '/')
            };
            if (feParams.type === 'receivable') {
                feParams.dateType = 'daliy';
                feParams.time = this.recivieDate.replace(/\./g, '/');
            }
            const cashData = this.reDetail[feParams.type][feParams.dateType];
            let detail = null;
            if (!forceUpdate && feParams.type !== 'receivable' && cashData.time === feParams.time) {
                detail = cashData.apiData;
            } else {
                this.reDetail = {
                    curDetail:{
                        data:{
                            name:'总计',
                            total: 0
                        }
                    },
                    // 销量
                    sale:{
                        daliy:{
                            time:'',
                            apiData:{}
                        },
                        month:{
                            time:'',
                            apiData:{}
                        }
                    },
                    // 收入
                    income: {
                        daliy:{
                            time:'',
                            apiData:{}
                        },
                        month:{
                            time:'',
                            apiData:{}
                        }
                    },
                    // 应收账款
                    receivable: {
                        daliy:{
                            time:'',
                            apiData:{}
                        },
                        month:{
                            time:'',
                            apiData:{}
                        }
                    }
                };
                detail = await this.fetchReportDetail(feParams);
                this.inputSeach = '';
            }
            const pickParams = {
                type: feParams.type,
                dateType: selectTab.curTabMsg.dateType,
                time: feParams.time,
                data: detail
            };
            this.packSaleIncome(pickParams);
        },
        // 整理销售和收入数据
        packSaleIncome(data) {
            // console.log(data.data);
            // data.type=sale|| income， 销量和收入使用同一个接口
            if (SMALAPIREG.test(data.type)) {
                this.reDetail.sale[data.dateType].time = data.time;
                this.reDetail.sale[data.dateType].apiData = data.data;
                this.reDetail.income[data.dateType].time = data.time;
                this.reDetail.income[data.dateType].apiData = data.data;
            } else {
                this.reDetail[data.type][data.dateType].time = data.time;
                this.reDetail[data.type][data.dateType].apiData = data.data;
            }
            this.reDetail.curDetail = {
                ...data
            };
        },
        // 点击出现下拉报表明细
        openDetail(hasMore, className) {
            if (hasMore && className) {
                const _addClass = className === this.curUpDetail ? '' : className;
                this.curUpDetail = _addClass;
            }
        },
        matchNames(inputVal, unitName) {
            const reg = new RegExp(inputVal);
            return reg.test(unitName);
        },
        // 根据文案检错
        pickMatchListFn(key) {
            const result = [];
            _.map(this.allMacthList, (itemBlock) => {
                if (this.matchNames(key, itemBlock.text)) {
                    result.push(itemBlock);
                }
            });
            return result;
        },
        // 搜索匹配点击
        searchConfrim(data) {
            data.isBySearch = true;
            this.comfirmUnitPer(data);
            this.isShowUnit = false;
            if (this.cashCode !== this.seUnitData.code) {
                // console.log('确认修改，并且设置不一样');
                this.updateDetailRe(true);
            }
        }
    }
};
