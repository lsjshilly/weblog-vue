<template>
    <div class="grid grid-cols-2 h-screen">
        <div class="col-span-2 md:col-span-1 order-2 md:order-1 bg-black">
            <div class="flex justify-center items-center h-full flex-col animate__animated animate__fadeInLeft">
                <h2 class="font-bold text-white text-2xl mb-4">WeBlog 博客登录</h2>
                <p class="text-white">一款由 Spring Boot + Vue 3.2 + Vite 4 开发的前后端分离博客。</p>
                <img src="../../assets/程序员办公.png" class="w-1/2">


            </div>

        </div>
        <div class="col-span-2 md:col-span-1 order-1 md:order-2 bg-white justify-center items-center">
            <div class="flex flex-col justify-center items-center h-full animate__animated animate__fadeInRight">
                <h1 class="font-bold text-4xl mb-5">欢迎回来</h1>

                <div class="flex items-center justify-center mb-7 text-gray-400 space-x-2">
                    <span class="w-16 h-[1px] bg-gray-200"></span>
                    <span>账号密码登录</span>
                    <span class="w-16 h-[1px] bg-gray-200"></span>
                </div>

                <el-form class="w-5/6 md:w-2/5" :rules="rules" ref="ruleFormRef" :model="form">
                    <el-form-item prop="username">
                        <el-input size="large" v-model="form.username" placeholder="请输入用户名" autocomplete="off"
                            :prefix-icon="User" />
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input size="large" v-model="form.password" placeholder="请输入密码" type="password" show-password
                            autocomplete="off" :prefix-icon="Lock" />
                    </el-form-item>

                    <el-form-item>
                        <el-button :loading="loginloading" size="large" type="primary" class="w-full"
                            @click="onsubmit()">
                            登录
                        </el-button>

                    </el-form-item>
                </el-form>

            </div>

        </div>

    </div>


</template>
<script setup>
// 引入 Element Plus 中的用户、锁图标
import { login } from '@/api/admin/user';
import { User, Lock } from '@element-plus/icons-vue'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { showMessage } from '@/utils/message/message';
import { setToken } from '@/utils/auth';


const loginloading = ref(false)
const router = useRouter()

const form = reactive({ username: '', password: '' })
const ruleFormRef = ref()

const rules = reactive({
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { min: 3, message: '用户名过短', trigger: 'blur' },
    ],
    password: [
        {
            required: true,
            message: '密码不能为空',
            trigger: 'blur',
        },
        {
            min: 6,
            message: '密码不能少于6位',
            trigger: 'blur',
        },
    ]
})

// 回车登录
function onKeyup(e) {
    if (e.key === 'Enter') {
        onsubmit()
    }
}

// 添加加键盘监听事件
onMounted(() => {
    console.log('添加键盘监听')
    window.addEventListener('keyup', onKeyup)
})

onBeforeUnmount(() => {
    window.removeEventListener('keyup', onKeyup)
})


const onsubmit = () => {
    console.log('登录', form)

    if (!ruleFormRef.value) {
        return
    }
    // 表单验证
    ruleFormRef.value.validate(async (valid) => {

        if (!valid) {
            console.log('表单验证不通过')
            return false
        }


        try {
            // 登录loading状态
            loginloading.value = true

            // 登录API调用
            const loginResult = await login(form)

            showMessage('登录成功')

            // 保存ttoken
            setToken(loginResult.usertoken)
            // 跳转首页
            router.push('/admin/index')

        } finally {
            // 停止loading  
            loginloading.value = false
        }

    })





}

</script>