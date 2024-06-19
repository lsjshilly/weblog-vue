<template>
    <div class="bg-white h-[64px] flex pr-4 border-b border-slate-200">

        <div class="w-[42px] h-[64px] cursor-pointer flex items-center justify-center text-gray-700 hover:bg-gray-200">
            <!-- 左边栏收缩、展开 -->
            <el-icon>
                <Fold />
            </el-icon>

            <el-icon>
                <Expand />
            </el-icon>
        </div>

        <div class="ml-auto flex items-center">

            <!-- 点击全屏展示 -->
            <el-tooltip content="全屏" placement="bottom">
                <div
                    class="w-[42px] h-[64px] cursor-pointer flex items-center justify-center text-gray-700 mr-2 hover:bg-gray-200">
                    <el-icon>
                        <FullScreen />
                    </el-icon>

                </div>

            </el-tooltip>


            <el-dropdown>
                <span class="el-dropdown-link text-gray-700 flex items-center text-xs hover:border-none">
                    <!-- 头像 Avatar -->
                    <el-avatar :size="25" class="mr-2"
                        src="https://img.quanxiaoha.com/quanxiaoha/f97361c0429d4bb1bc276ab835843065.jpg" />
                    Admin
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>修改密码</el-dropdown-item>
                        <el-dropdown-item>退出登录</el-dropdown-item>

                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>

    </div>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
</script>

<style scoped>
.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);

}
</style>