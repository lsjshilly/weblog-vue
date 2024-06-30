import { getUserInfo } from "@/api/admin/user";
import { defineStore } from "pinia";
import { ref } from "vue";
import { removeToken } from "./cookie";


export const useUserStore = defineStore('user', () => {
    const userInfo = ref({})

    function setUserInfo() {
        getUserInfo().then(res => {
            userInfo.value = res
            console.log(res)
        })
    }

    function logout() {
        userInfo.value = {}
        removeToken()
    }


    return { userInfo, setUserInfo, logout }

},
    {
        persist: {
            enabled: true,
            strategies: [
                {
                    key: 'user',
                    storage: localStorage,
                }
            ]
        }
    }


)