<template>
    <el-affix :offset="0">
        <div class="bg-white h-[64px] flex pr-4 border-b border-slate-100">

            <div class="w-[42px] h-[64px] cursor-pointer flex items-center justify-center text-gray-700 hover:bg-gray-200"
                @click="handleMenuWidth">
                <!-- 左边栏收缩、展开 -->
                <el-icon v-if="menuStore.menuWidth === '250px'">
                    <Fold />
                </el-icon>

                <el-icon v-if="menuStore.menuWidth === '64px'">
                    <Expand />
                </el-icon>
            </div>

            <div class="ml-auto flex items-center">

                <!-- 点击全屏展示 -->
                <el-tooltip content="刷新" placement="bottom">
                    <div class="w-[42px] h-[64px] cursor-pointer flex items-center justify-center text-gray-700 mr-2 hover:bg-gray-200"
                        @click="handleRefresh">
                        <el-icon>
                            <Refresh />
                        </el-icon>
                    </div>

                </el-tooltip>



                <!-- 点击全屏展示 -->
                <el-tooltip content="全屏" placement="bottom">
                    <div class="w-[42px] h-[64px] cursor-pointer flex items-center justify-center text-gray-700 mr-2 hover:bg-gray-200"
                        @click="toggle">
                        <el-icon>
                            <FullScreen v-if="!isFullscreen" />
                        </el-icon>

                        <el-icon>
                            <Aim v-if="isFullscreen" />
                        </el-icon>

                    </div>

                </el-tooltip>


                <el-dropdown>
                    <span class="el-dropdown-link text-gray-700 flex items-center text-xs hover:border-none">
                        <!-- 头像 Avatar -->
                        <el-avatar :size="25" class="mr-2"
                            src="https://img.quanxiaoha.com/quanxiaoha/f97361c0429d4bb1bc276ab835843065.jpg" />
                        {{ userStore.userInfo.nickname }}
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="dialogVisible = true">修改密码</el-dropdown-item>
                            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>

                        </el-dropdown-menu>
                    </template>
                </el-dropdown>


                <el-dialog v-model="dialogVisible" title="修改密码" width="500">

                    <el-form :model="updatePasswordForm" :rules="rules" label-width="auto" style="max-width: 600px"
                        ref="updatePasswordFormRef">
                        <el-form-item label="用户名">
                            <el-input v-model="updatePasswordForm.username" disabled />
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="updatePasswordForm.password" type="password" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="确认密码" prop="confirmPassword">
                            <el-input v-model="updatePasswordForm.confirmPassword" type="password" autocomplete="off" />
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button @click="clearFormValue">取消</el-button>
                            <el-button type="primary" @click="updatePasswordAction(updatePasswordFormRef)"
                                :loading="loginloading">
                                确认
                            </el-button>
                        </div>
                    </template>
                </el-dialog>


            </div>

        </div>
    </el-affix>

</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useMenuStore } from '@/stores/menu';
import { useFullscreen } from '@vueuse/core';
import { useUserStore } from '@/stores/user';
import { showMessage, showModel } from '@/utils/message/message';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { reactive } from 'vue';
import { rule } from 'postcss';
import { updatePassword } from '@/api/admin/user';

const dialogVisible = ref(false)

const loginloading = ref(false)


const router = useRouter();

const userStore = useUserStore();


const updatePasswordForm = reactive({
    username: userStore.userInfo.username,
    password: '',
    confirmPassword: '',
})

const updatePasswordFormRef = ref()


const { isFullscreen, toggle } = useFullscreen();

const handleRefresh = () => {
    window.location.reload()
}

const menuStore = useMenuStore();

const handleMenuWidth = () => {
    console.log('clicksss')
    menuStore.handleMenuWidth()
}


const logout = () => {

    showModel('确定要退出吗？', '提示', 'warning').then(() => {
        userStore.logout()
        router.push('/login')
    })

    userStore.logout()
}


const updatePasswordAction = (formEl) => {

    if (!formEl) return
    // 表单验证
    formEl.validate(async (valid) => {

        if (!valid) {
            console.log('修改密码表单验证不通过')
            return false
        }

        if (updatePasswordForm.password !== updatePasswordForm.confirmPassword) {
            showMessage('密码不一致', 'error')
            return false
        }

        try {
            // 登录loading状态
            loginloading.value = true
            await updatePassword(updatePasswordForm)
            showMessage('密码修改成功')
        } finally {
            // 停止loading  
            loginloading.value = false
            clearFormValue()
        }

    })
}


function clearFormValue() {
    dialogVisible.value = false

    updatePasswordForm.password = ''
    updatePasswordForm.confirmPassword = ''
}



const rules = reactive({
    password: [{
        required: true,
        message: '密码不能为空',
        trigger: 'blur',
    },
    {
        min: 6,
        message: '密码不能少于6位',
        trigger: 'blur',
    }],
    confirmPassword: [{
        required: true,
        message: '密码不能为空',
        trigger: 'blur',
    },
    {
        min: 6,
        message: '密码不能少于6位',
        trigger: 'blur',
    }]
})



</script>




<style scoped>
.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);

}
</style>