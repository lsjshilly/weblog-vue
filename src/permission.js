import router from "./router";
import { getToken } from "./stores/cookie";
import { showMessage } from "./utils/message/message";
import { showPageLoading, hidePageLoading } from "./utils/loading"


// 全局路由守卫
router.beforeEach((to, from, next) => {
    console.log(to, from);

    showPageLoading();

    let title = (to.meta.title ? to.meta.title : '') + ' - ' + 'Weblog';
    document.title = title;
    let token = getToken()
    if (!token && to.path.startsWith('/admin')) {
        showMessage('请先登录', 'error')
        next({
            path: '/login',
            query: {
                redirect: to.fullPath
            }
        })

    } else if (token && to.path === '/login') {

        showMessage('请勿重复登录', 'error')
        next({
            path: '/admin/index',
        })

    } else {
        next();
    }

    hidePageLoading()

});