<template lang="html">
    <transition name="fade" mode="in-out">
        <div class="loading-wrapper mask">
            <div class="loading">
                <div class="spinner"></div>
                <div class="text">{{ text }}</div>
            </div>
        </div>
    </transition>
</template>

<script lang="babel">
    export default {
        name: 'Loading',
        props: {
            text: {
                type: String,
                default: '正在加载'
            }
        },
    };
</script>

<style lang="stylus" scoped>
@import '../assets/styles/mixins';

    .loading-wrapper
        .loading
            position absolute
            top 35%
            left 50%
            padding 0 rem(10)
            transform translate(-50%, 0)
            width rem(90)
            height @width
            color white
            background-color rgba(0, 0, 0, 50%)
            border-radius 5px
            box-sizing border-box
        .spinner
            width rem(40)
            height @width
            margin rem(12) auto
            box-sizing border-box
            background-image url('../assets/images/loading.svg')
            background-size contain
            background-position center center
            background-repeat no-repeat
        .text
            text-align center
</style>
