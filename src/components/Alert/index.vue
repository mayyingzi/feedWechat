<template lang="html">
    <transition name="fade" mode="in-out">
        <div class="alertWrapper mask" v-if="show">
            <div class="alert">
                <div class="message">{{ message }}</div>
                <div class="singleBtn"
                    v-if="buttons === 1"
                    @click="btnHandler('single')">
                    {{ singleBtn.text }}
                </div>
                <div class="buttonSection" v-if="buttons === 2">
                    <div class="alertBtn alertLeft"
                        @click="btnHandler('left')">
                        {{ leftBtn.text }}
                    </div>
                    <div class="alertBtn alertRight"
                        @click="btnHandler('right')">
                        {{ rightBtn.text }}
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script src="./alert.js" lang="babel"></script>
<style src="./alert.styl" lang="stylus" scoped></style>
