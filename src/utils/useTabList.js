
import { useMenuStore } from "@/stores/menu"
import { useRoute, useRouter } from "vue-router"
import { ref } from "vue"
import { onBeforeRouteUpdate } from "vue-router"
import { getTabList, setTabList } from "@/stores/cookie"

export function useTabList() {


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
        addTab(tab)
    })

    function addTab(tab) {
        activeTab.value = tab.path

        let isTabNotExisted = tabList.value.findIndex(item => item.path == tab.path) == -1
        if (isTabNotExisted) {
            tabList.value.push(tab)
        }
        setTabList(tabList.value)
    }


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
        activeTab.value = targetName
        router.push(targetName)
    }


    const handleCommand = (command) => {

        let indexPath = '/admin/index'

        if (command == 'closeOthers') {
            tabList.value = tabList.value.filter(item => item.path == indexPath || item.path == activeTab.value)

        } else if (command == 'closeAll') {
            activeTab.value = indexPath
            tabList.value = tabList.value.filter(item => item.path == '/admin/index')
            changeTab(indexPath)
        }
        setTabList(tabList.value)


    }

    return {
        menuStore,
        tabList,
        activeTab,
        removeTab,
        changeTab,
        handleCommand
    }
}