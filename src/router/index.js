import { createWebHashHistory, createRouter } from "vue-router";
import Index from "@/pages/frontend/index.vue";
import Login from "@/pages/admin/login.vue";
import AdminIndex from "@/pages/admin/index.vue";
import Admin from "@/layouts/admin/admin.vue";
import ArticleList from "@/pages/admin/article-list.vue";
import BlogSetting from "@/pages/admin/blog-setting.vue";
import CategoryList from "@/pages/admin/category-list.vue";
import TagsList from "@/pages/admin/tags-list.vue";



// 统一在这里声明所有路由
const routes = [
    {
        path: '/', // 路由地址
        component: Index, // 对应组件
        meta: { // meta 信息
            title: 'Weblog 首页' // 页面标题
        }
    },
    {
        path: '/login', // 登录页
        component: Login,
        meta: {
            title: 'Weblog 登录页'
        }
    },
    {
        path: '/admin', // 登录页
        component: Admin,
        children: [
            {
                path: '/admin/index', // 登录页
                component: AdminIndex,
                meta: {
                    title: 'Weblog 后台管理'
                }
            },
            {
                path: '/admin/article/list', // 登录页
                component: ArticleList,
                meta: {
                    title: 'Weblog 文章管理'
                }
            },
            {
                path: '/admin/category/list', // 登录页
                component: CategoryList,
                meta: {
                    title: 'Weblog 归档管理'
                }
            },
            {
                path: '/admin/blog/setting', // 登录页
                component: BlogSetting,
                meta: {
                    title: 'Weblog 博客设置'
                }
            },
            {
                path: '/admin/tag/list', // 登录页
                component: TagsList,
                meta: {
                    title: 'Weblog 标签管理'
                }
            }

        ]
    },
]


// 创建路由
const router = createRouter({
    // 指定路由的历史管理方式，hash 模式指的是 URL 的路径是通过 hash 符号（#）进行标识
    history: createWebHashHistory(),
    // routes: routes 的缩写
    routes,
})

export default router;