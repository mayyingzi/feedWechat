import Vue from 'vue';

export default (router) => {
    let firstFlag = true;
    router.beforeEach((to, from, next) => {
        if (firstFlag) {
            const goPath = {
                path: to.path,
                query: to.query
            };
            firstFlag = false;
            if (!to.query.userName) {
                // 非登录页面进入&url中不存在userName参数
                Vue.$store.dispatch('getUserNameL');
            } else if (to.query.userName) {
                // url中存在userName参数
                Vue.$store.dispatch('setUserName', to.query.userName);
                // 去掉url中的userName，安全考虑
                goPath.query.userName = '';
                next(goPath);
                return;
            }
        }
        next();
    });
};
