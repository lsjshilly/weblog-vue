<template>
    <div class="fixed bg-white top-[64px] px-2 right-0 h-[44px] flex items-center"
        :style="{ left: menuStore.menuWidth }">



        <el-tabs v-model="activeTab" type="card" @tab-remove="removeTab" @tab-change="changeTab"
            style="min-width: 10px;">
            <el-tab-pane v-for="item in tabList" :key="item.path" :label="item.title" :name="item.path"
                :closable="item.path != '/admin/index'">
                {{ item.content }}
            </el-tab-pane>
        </el-tabs>

        <span class="ml-auto flex items-center justify-center h-[32px] w-[32px] mr-2">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>关闭其他</el-dropdown-item>
                        <el-dropdown-item>关闭所有</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>


    </div>
    <div class="h-[44px]"></div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useMenuStore } from '@/stores/menu'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { getTabList, setTabList } from '@/stores/tag-list';

const menuStore = useMenuStore()
const route = useRoute()
const router = useRouter()

const activeTab = ref(route.path)

const tabList = ref([
    {
        title: '仪表盘',
        path: "/admin/index"
    }
])


onBeforeRouteUpdate((to, form) => {

    // Assuming 'to.meta.title' is a string
    let titleParts = to.meta.title.split(' '); // Split the title by space
    let lastPart = titleParts[titleParts.length - 1]; // Get the last part of the split array

    let tab = {
        title: lastPart,
        path: to.path
    }

    activeTab.value = tab.path

    let isTabNotExisted = tabList.value.findIndex(item => item.path == tab.path) == -1
    if (isTabNotExisted) {
        tabList.value.push(tab)
    }

    setTabList(tabList.value)

})

function initTabList() {
    let tabs = getTabList()
    if (tabs && tabs.length != 0) {
        tabList.value = tabs
    }
}

initTabList()


const removeTab = (targetName) => {

    let tabs = tabList.value
    let actTab = activeTab.value

    if (actTab == targetName) {
        console.log(targetName)
        tabs.forEach((tab, index) => {
            if (tab.path == targetName) {
                console.log(index)
                let nextTab = tabs[index - 1] || tabs[index + 1]
                if (nextTab) {
                    actTab = nextTab.path
                }
            }
        })
    }

    activeTab.value = actTab

    tabList.value = tabList.value.filter(item => item.path != targetName)
    setTabList(tabList.value)

    changeTab(actTab)
}


const changeTab = (targetName) => {
    console.log(targetName)
    router.push(targetName)
}





</script>



<style>
.el-tabs__item {
    font-size: 12px;
    border: 1px solid #d8dce5 !important;
    border-radius: 3px !important;
}

.el-tabs--card>.el-tabs__header .el-tabs__item {
    margin-left: 0.1rem !important;
    margin-right: 0.1rem !important;
}

.el-tabs__item.is-active {
    background-color: var(--el-color-primary) !important;
    color: #fff;
}

.el-tabs__item.is-active::before {
    content: "";
    background-color: #fff;
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: relative;
    margin-right: 4px;
}

.el-tabs {
    height: 32px;
}

.el-tabs__header {
    margin-bottom: 0;
}

.el-tabs--card>.el-tabs__header .el-tabs__nav {
    border: 0;
}

.el-tabs--card>.el-tabs__header .el-tabs__item {
    height: 32px;
    line-height: 32px;
    border: 0;
    background: #fff;
}

.el-tabs--card>.el-tabs__header {
    border: 0;
}

.el-tabs__nav-prev,
.el-tabs__nav-next {
    line-height: 35px;
}

.is-disabled {
    cursor: not-allowed;
    color: #d1d5db;
}
</style>