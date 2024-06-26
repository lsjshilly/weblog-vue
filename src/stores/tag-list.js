import { useCookies } from "@vueuse/integrations/useCookies";


const TAB_LIST_KEY = "TAB_LIST_KEY"

const cookies = useCookies()


export function getTabList() {
    return cookies.get(TAB_LIST_KEY) || []
}


export function setTabList(tabList) {
    cookies.set(TAB_LIST_KEY, tabList)
}