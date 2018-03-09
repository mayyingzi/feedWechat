<template lang="html">
    <div class="testPage">
        <p class="test-tit">组件demo测试</p>
        <div class="test-compentent">
            <p class="item-i" @click="cshowAlert">显示弹窗</p>
            <p class="item-i" @click="cshowToast">显示toast</p>
            <p class="item-i" @click="cshowLoading">显示loading</p>
            <p id="data" class="item-i showData">{{selectedData}}</p>
        </div>
        <loading v-if="loading" :text="loadingText" />

        <toast :message="toastMsg" />
        <alert :message="error.msg"
            :buttons="error.buttons"
            :left-btn="error.leftBtn"
            :right-btn="error.rightBtn"
            :single-btn="alertOpts.singleBtn" />
    </div>  
</template>

<script>
import {mapActions, mapGetters } from 'vuex';
import DataPicker from 'vue-ios-datepicker';

export default {
    components: {
        loading: require('@/components/Loading'),
        toast  : require('@/components/Toast'),
        alert  : require('@/components/Alert'),
    },
    data() {
        return {
            error: {
                msg: '测试吧',
                buttons: 2,
                leftBtn: {
                    text:'取消',
                    handler: 'close'
                },
                rightBtn:{
                    text:  '确定',
                    handler: 'unbindWx'
                }
            },
            loading: false,
            loadingText: '加载中',
            selectedData:'请选择日期'
        };
    },
    computed: {
        ...mapGetters([
            'toastMsg',
            'alertOpts'
        ]),
    },
    created() {
    },
    mounted() {
        const calendar = new DataPicker();
        const self = this;
        calendar.init({
            // 按钮选择器，用于触发弹出插件
            trigger: '.showData',
            // 模式：date日期；datetime日期时间；time时间；ym年月；
            type: 'date',
            // 最小日期
            minDate: '2004-1-1',
            // 最大日期
            maxDate: '2020-12-31',
            // 确认时触发事件
            onSubmit() {
                console.log('确定');
                console.log(calendar.value);
                self.selectedData = calendar.value;
            },
            // 取消时触发事件
            onClose() {
                console.log('关闭2');
            }
        });
    },
    methods: {
        ...mapActions(['alert', 'toast']),
        cshowAlert() {
            this.alert({message: this.error.msg});
        },
        cshowToast() {
            this.toast('测试显示toast');
        },
        cshowLoading() {
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
            }, 1000);
        }
    },
};
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/mixins'

.testPage
    font-size rem(14)
    color $fcGrey
    text-align center
    .test-tit
        margin-bottom rem(56)
        padding-top rem(20)
    .item-i
        font-size rem(16)
        color #ff4d6a
        border 1px solid #cccccc
        text-align center
        padding rem(10) 0
        width 80%
        border-radius 10px
        margin 0 auto rem(10)
</style>

