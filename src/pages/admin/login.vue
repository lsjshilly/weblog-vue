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

                <el-form class="w-5/6 md:w-2/5">
                    <el-form-item>
                        <el-input size="large" placeholder="请输入用户名" autocomplete="off" :prefix-icon="User" />
                    </el-form-item>
                    <el-form-item>
                        <el-input size="large" placeholder="请输入密码" type="password" autocomplete="off"
                            :prefix-icon="Lock" />
                    </el-form-item>

                    <el-form-item>
                        <el-button size="large" type="primary" class="w-full">
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
import { User, Lock } from '@element-plus/icons-vue'
</script>