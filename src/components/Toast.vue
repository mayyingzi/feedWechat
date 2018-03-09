<template lang="html">
    <transition name="fade" mode="in-out">
        <div class="toast" v-if="show">{{ message }}</div>
    </transition>
</template>

<script lang='babel'>
    export default {
        name: 'Toast',
        props: {
            message: String
        },
        computed: {
            show() {
                return !!this.message;
            }
        }
    };
</script>

<style lang="stylus">
@import '../assets/styles/mixins';

    .toast
        position fixed
        bottom rem(30)
        left 50%
        width 80%
        margin-left -40%
        font-size rem(16)
        color white
        padding rem(10)
        background-color rgba(0, 0, 0, 50%)
        border-radius 5px
        box-sizing border-box
        text-align center
        z-index 1050
</style>
