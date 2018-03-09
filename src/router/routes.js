import pageTitle from '@/lang/pageTitle';

const view = name => (resolve) => {
    require([`@/views/${name}/index.vue`], resolve); // eslint-disable-line
};

const title = page => ({
    title: pageTitle[page]
});

export default [
    {
        path: '*',
        name: 'pageNotFound',
        meta: title('pageNotFound'),
        component: view('pageNotFound')
    },
    {
        path: '/login',
        name: 'loginView',
        meta: title('loginView'),
        component: view('loginView'),
    },
    {
        path: '/',
        name: 'menuView',
        meta: title('menuView'),
        component: view('menuView'),
    },
    {
        path: '/user-center',
        name: 'userCenter',
        meta: title('userCenter'),
        component: view('userCenter'),
    },
    {
        path: '/report',
        name: 'reportView',
        meta: title('reportView'),
        component: view('reportView'),
    },
    // {
    //     path: '/test-page',
    //     name: 'testPage',
    //     meta: title('testPage'),
    //     component: view('testPage'),
    // },
];
