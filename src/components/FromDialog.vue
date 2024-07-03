<template>
    <el-dialog v-model="dialogVisible" :title="title" :width="width" :destroy-on-close="destroyOnClose"
        :draggable="true" :close-on-click-modal="false" :close-on-press-escape="false">
        <!-- 插槽 -->
        <slot></slot>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit" :loading="btnloading">
                    {{ confirmText }}
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>


<script setup>
import { ref } from 'vue';

const dialogVisible = ref(false);
const btnloading = ref(false);


const open = () => {
    dialogVisible.value = true
}

const close = () => {
    dialogVisible.value = false
}

const showBtnLoading = () => btnloading.value = true
const hideBtnLoading = () => btnloading.value = false


const props = defineProps({
    title: {
        type: String,
        default: '标题'
    },
    width: {
        type: String,
        default: '30%'
    },
    destroyOnClose: {
        type: Boolean,
        default: true
    },
    confirmText: {
        type: String,
        default: '确定'
    }
})


const emit = defineEmits(['submit'])
const submit = () => {
    emit('submit')
}






defineExpose({ open, close, showBtnLoading, hideBtnLoading })


</script>