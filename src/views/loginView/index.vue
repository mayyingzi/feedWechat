<template lang="html">
    <section class="loginView">
        <div class="logo"></div>
        <p class="pageTit">请输入账号密码绑定到微信</p>
        <!-- 登录信息录入 -->
        <div class="loginIn">
            <label class="inWrap">账号
                <input class="inItem" 
                    type="text"
                    @keyup="userid=inUserId(userid)"
                    v-model="userid" 
                    maxlength="11"
                    placeholder="请输入账号">
            </label>
            <label class="inWrap">密码
                <input class="inItem" 
                    type="password" 
                    v-model="userpsw"
                    maxlength="12"
                    placeholder="请输入密码">
            </label>
            <div class="submitBtn" @click="goBind">绑定</div>
        </div>
        <!-- 提示信息 -->
        <toast :message="toastMsg"/>
        <loading v-if="bindWx.loading" :text="loadingText" />
        <alert :message="bindWx.error.msg"
            :buttons="alertOpts.buttons"
            :left-btn="alertOpts.leftBtn"
            :right-btn="alertOpts.rightBtn"
            :single-btn="alertOpts.singleBtn" />
    </section>
</template>
<script src='./login.js' lang='babel'></script>
<style src='./login.styl' lang='stylus' scoped></style>

