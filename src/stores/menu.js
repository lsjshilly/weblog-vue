import { defineStore } from "pinia";
import { ref } from 'vue';

export const useMenuStore = defineStore('menu', () => {
    const menuWidth = ref("250px");

    function handleMenuWidth() {
        menuWidth.value = menuWidth.value == '250px' ? '64px' : '250px'
    }


    return { menuWidth, handleMenuWidth }


})


