<template>

    <div class="bg-slate-800 text-white h-screen transition-all" :style="{ width: menuStore.menuWidth }">

        <div class="flex items-center justify-center h-[64px]">
            <img src="../../../assets/weblog_log.jpg" />

        </div>

        <el-menu active-text-color="#ffd04b" class="el-menu-vertical-demo" :default-active="defaultActive"
            @select="handleSelect" :collapse="isCollapse" :collapse-transition="false">

            <template v-for="(item, index) in menus" :key="index">
                <el-menu-item :index="item.path">

                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>

                    <span>{{ item.name }}</span>

                </el-menu-item>
            </template>


        </el-menu>
    </div>

</template>



<script setup>
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMenuStore } from '@/stores/menu';

const menuStore = useMenuStore();
const route = useRoute()
const router = useRouter()

const isCollapse = computed(() => menuStore.menuWidth === '64px')



// 根据路由地址判断哪个菜单被选中
const defaultActive = ref(route.path)

const menus = [
    {
        "name": "仪表盘",
        "icon": "Monitor",
        "path": "/admin/index"
    },
    {
        'name': '文章管理',
        'icon': 'Document',
        'path': '/admin/article/list',
    },
    {
        'name': '分类管理',
        'icon': 'FolderOpened',
        'path': '/admin/category/list',
    },
    {
        'name': '标签管理',
        'icon': 'PriceTag',
        'path': '/admin/tag/list',
    },
    {
        'name': '博客设置',
        'icon': 'Setting',
        'path': '/admin/blog/setting',
    },
];


// 菜单选择事件
const handleSelect = (path) => {
    router.push(path)
}



</script>


<style>
.el-menu {
    background-color: rgb(30 41 59);
    border-right: 0;
}

.el-sub-menu__title {
    color: #fff;
}

.el-sub-menu__title:hover {
    background-color: #ffffff10;
}


.el-menu-item {
    color: #fff;
}

.el-menu-item.is-active {
    background-color: var(--el-color-primary);
    color: #fff;
}

.el-menu-item.is-active:hover {
    background-color: var(--el-color-primary);
    color: #fff;
}

.el-menu-item:hover {
    background-color: #ffffff10;
}
</style>