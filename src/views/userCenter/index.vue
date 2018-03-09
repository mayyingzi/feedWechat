<template lang="html">
    <div class="userCenter">
        <div class="itemWrap">
            <p class="itemCell">已绑定账号：{{userId}}</p>
            <p class="itemRight"
                @click="goUnbindWx"
            >解除绑定</p>
        </div>
        <!-- 提示信息 -->
        <alert :message="error.msg"
            :buttons="error.buttons"
            :left-btn="error.leftBtn"
            :right-btn="error.rightBtn"
            :single-btn="alertOpts.singleBtn" />
    </div>
</template>

<script>
import {mapActions, mapGetters } from 'vuex';

export default {
    name: 'userCenter',
    components: {
        alert: require('@/components/Alert')
    },
    data() {
        return {
            // 账号信息
            userId:'需要接口信息',
            error: {
                msg: '是否确认解绑当前微信？',
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
        };
    },
    computed: {
        ...mapGetters([
            'alertOpts'
        ]),
    },
    methods: {
        ...mapActions(['alert']),
        goUnbindWx() {
            this.alert({message: this.error.msg});
            console.log('处理账号解绑');
        }
    }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/mixins'

.userCenter
    padding rem(10) rem(5) rem(20)
    font-size rem(14)    
    .itemWrap
        display flex
        line-height 1.2em      
        .itemCell
            flex 1
            padding-top rem(10)
            padding-bottom rem(10)
        .itemRight
            text-align right 
            color $fcBlue
            padding rem(10)
</style>

