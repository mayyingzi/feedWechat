import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'loginView',
    components: {
        toast: require('@/components/Toast'),
        loading: require('@/components/Loading'),
        alert  : require('@/components/Alert')
    },
    data() {
        return {
            // 账户
            userid:'',
            // 密码
            userpsw:'',
            openID: this.$route.query.openID || '',
            loadingText: '提交中'
        };
    },
    computed: {
        ...mapGetters(['toastMsg', 'bindWx', 'alertOpts']),
    },
    watch: {
        bindWx: {
            deep: true,
            handler(val) {
                if (val.error.msg && val.error.status !== 1) {
                    this.alert({message: val.error.msg});
                }
                if (val.error.status === 1) {
                    // 保存用户名称
                    this.setUserName(this.userid);
                }
            },
        },
    },
    mounted() {
    },
    methods: {
        ...mapActions(['toast', 'alert', 'goBindWx', 'setUserName']),
        inUserId(val) {
            // 限制用户账号输入
            return val;
        },
        /**
         * 判断账号是否合法
         *
         * @param {string} text 要验证的字符串
         * @return {bool} true||false
         */
        isUserId(text) {
            return /^[0-9a-zA-Z_\u4e00-\u9fa5]+$/.test(text);
        },
        /**
         * 判断密码是否合法
         *
         * @param {string} text 要验证的字符串
         * @return {bool} true||false
         */
        isPassword(text) {
            return text.length >= 6 && text.length <= 20;
        },
        goBind() {
            if (!this.openID.length) {
                this.toast('非法环境登录');
                return;
            }
            if (!this.isUserId(this.userid)) {
                this.toast('请输入正确格式的账号');
                return;
            }
            if (!this.isPassword(this.userpsw)) {
                this.toast('请输入正确格式的密码');
                return;
            }
            this.goBindWx({
                openID: this.openID,
                userName: this.userid,
                passWord: this.userpsw
            });
        }
    }
};
