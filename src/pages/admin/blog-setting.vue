<template>

    <div>
        <!-- 表头分页查询条件， shadow="never" 指定 card 卡片组件没有阴影 -->
        <el-card shadow="never" class="mb-5">
            <el-form :model="form" label-width="auto" style="max-width: 600px">
                <el-form-item label="博客名称" required>
                    <el-input v-model="form.blogname" />
                </el-form-item>
                <el-form-item label="作者" required>
                    <el-input v-model="form.authorname" />
                </el-form-item>

                <el-form-item label="作者头像" required>
                    <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false"
                        :on-change="handleAvatarChange">
                        <img v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar w-24 h-24" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>

                <el-form-item label="介绍语">
                    <el-input v-model="form.description" :rows="3" type="textarea" placeholder="简介" />
                </el-form-item>

                <el-form-item label="开启Github访问">
                    <el-switch v-model="isgithubEnable" @change="githubEnableChange" />
                </el-form-item>

                <el-form-item label="Github主页访问地址" v-if="isgithubEnable">
                    <el-input v-model="form.githubHomePage" clearable />
                </el-form-item>

                <el-form-item label="开启CSDN访问">
                    <el-switch v-model="iscsdnEnable" @change="csdnEnableChange" />
                </el-form-item>

                <el-form-item label="CSDN主页访问地址" v-if="iscsdnEnable">
                    <el-input v-model="form.cscnHomePage" clearable />
                </el-form-item>

                <el-form-item label="开启Gitee访问">
                    <el-switch v-model="isgiteeEnable" @change="giteeEnableChange" />
                </el-form-item>

                <el-form-item label="Gitee主页访问地址" v-if="isgiteeEnable">
                    <el-input v-model="form.giteeHomePage" clearable />
                </el-form-item>

                <el-form-item label="开启知乎访问">
                    <el-switch v-model="iszhihuEnable" @change="zhihuEnableChange" />
                </el-form-item>

                <el-form-item label="知乎主页访问地址" v-if="iszhihuEnable">
                    <el-input v-model="form.zhihuHomePage" clearable />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">确认</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>


</template>

<script setup>
import { showMessage } from '@/utils/message/message';
import { onMounted, reactive, ref } from 'vue'
import { getBlogSettingDetail as getBlogSettingDetailApi, updateBlogSetting } from '@/api/admin/blogSetting';
import { uploadAvatar } from '@/api/admin/file';



const isgithubEnable = ref(false)
const iscsdnEnable = ref(false)
const isgiteeEnable = ref(false)
const iszhihuEnable = ref(false)

// do not use same name with ref
const form = reactive({
    blogname: '',
    authorname: '',
    avatarUrl: '',
    description: '',
    githubHomePage: '',
    cscnHomePage: '',
    giteeHomePage: '',
    zhihuHomePage: '',
})


const githubEnableChange = (val) => {
    if (!val) {
        console.log(val)
        form.githubHomePage = ''
    }
}

const giteeEnableChange = (val) => {
    if (!val) {
        form.giteeHomePage = ''
    }
}

const csdnEnableChange = (val) => {
    if (!val) {
        form.cscnHomePage = ''
    }
}


const zhihuEnableChange = (val) => {
    if (!val) {
        form.zhihuHomePage = ''
    }
}


onMounted(() => {
    getBlogSettingDetail()
})


const getBlogSettingDetail = async () => {

    try {
        const res = await getBlogSettingDetailApi()
        form.blogname = res.blogname
        form.authorname = res.authorname
        form.avatarUrl = res.avatarUrl
        form.description = res.description

        if (res.githubHomePage) {
            isgithubEnable.value = true
            form.githubHomePage = res.githubHomePage
        }

        if (res.cscnHomePage) {
            iscsdnEnable.value = true
            form.cscnHomePage = res.cscnHomePage
        }

        if (res.giteeHomePage) {
            isgiteeEnable.value = true
            form.giteeHomePage = res.giteeHomePage
        }

        if (res.zhihuHomePage) {
            iszhihuEnable.value = true
            form.zhihuHomePage = res.zhihuHomePage
        }

    } finally {

    }
}



const onSubmit = async () => {
    console.log('submit!')
    try {
        await updateBlogSetting(form)
        showMessage('更新成功', 'success')
    } finally {

    }
}


const handleAvatarChange = async (file) => {
    console.log('开始上传头像');

    if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') {
        showMessage('头像必须为jpg/png格式', 'error')
        return
    } else if (file.raw.size / 1024 / 1024 > 2) {
        showMessage('头像不能大于2MB！', 'error')
        return
    }

    let formData = new FormData()
    formData.append('avatar', file.raw)


    const res = await uploadAvatar(formData)
    showMessage('头像上传成功', 'success')
    form.avatarUrl = res
}

</script>




<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
}
</style>