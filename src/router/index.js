import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';
import applyRouterMiddleware from './applyMiddleware';

Vue.use(Router);

const router = new Router({
    routes,
    // mode: 'history'
});

applyRouterMiddleware(router);

export default router;
