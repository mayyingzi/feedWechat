<template lang="html">
    <section class="menuView">
        <!-- 首页菜单目录 -->
        <div class="menuWrap" @click="goDerect('/report')">
            <div class="itemIcon iconList"></div>
            <p class="tit">饲料报表</p>
        </div>
        <!-- 后端 确认暂时不需要 -->
        <!-- <div class="menuWrap" @click="goDerect('/user-center')">
            <div class="itemIcon iconSet"></div>
            <p class="tit">账号管理</p>
        </div> -->
    </section>
  
</template>

<script>
export default {
    name: 'menuView',
    // data() {
    //     return {

    //     };
    // }
    methods: {
        goDerect(path) {
            console.log(`路由跳转到 path： ${path}`);
            this.$router.push({path});
        }
    }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/mixins'

.menuView
    font-size rem(14)
    padding rem(20)
    display flex
    .menuWrap
        width rem(72)
        margin-right rem(25)
        .itemIcon
            width rem(72)
            padding-top 100%
            background url('../../assets/images/icon_list.png') no-repeat center center
            background-size rem(72)
            border-radius rem(4)
            &.iconSet
                background-image url('../../assets/images/icon_setting.png')
        .tit
            text-align center
            padding rem(9) 0
</style>

