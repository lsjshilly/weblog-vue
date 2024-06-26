<template>
    <el-container>

        <el-aside :width="menuStore.menuWidth" class="transition-all">

            <AdminMenu></AdminMenu>

        </el-aside>


        <!-- 主内容区域 -->
        <el-container>

            <el-header>
                <AdminHeader></AdminHeader>
            </el-header>


            <el-main>
                <AdminTagList></AdminTagList>

                <!-- 主内容（根据路由动态展示不同页面） -->
                <router-view></router-view>
            </el-main>

            <!-- 底栏容器 -->
            <el-footer>
                <AdminFooter></AdminFooter>
            </el-footer>


        </el-container>


    </el-container>
</template>

<script setup>
import AdminHeader from './components/AdminHeader.vue';
import AdminFooter from './components/AdminFooter.vue';
import AdminMenu from './components/AdminMenu.vue';
import AdminTagList from './components/AdminTagList.vue';
import { useMenuStore } from '@/stores/menu';

const menuStore = useMenuStore();






</script>

<style scoped>
.el-header {
    padding: 0;
}

.el-main {
    padding: 0;
}

.el-footer {
    padding: 0;
}
</style>