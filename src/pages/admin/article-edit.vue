<template>


    <!-- 写博客 -->
    <el-dialog v-model="isArticlePublishEditorShow" :show-close="false" :fullscreen="true">
        <template #header="">
            <el-affix :offset="20" style="width: 100%;">
                <div class="flex   bg-white">
                    <h4 class="font-bold">写文章</h4>
                    <div class="ml-auto mr-5">
                        <el-button type="info" plain @click="closeA()">取消</el-button>
                    </div>
                </div>

            </el-affix>
        </template>
        <!-- label-position="top" 用于指定 label 元素在上面 -->
        <el-form :model="form" ref="publishArticleFormRef" label-position="top" size="large" :rules="rules">
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" autocomplete="off" size="large" maxlength="40" show-word-limit
                    clearable />
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <!-- Markdown 编辑器 -->
                <MdEditor v-model="form.content" editorId="publishArticleEditor" />
            </el-form-item>
            <el-form-item label="封面" prop="cover">
                <el-upload class="avatar-uploader" action="#" :auto-upload="false" :show-file-list="false"
                    :on-change="handleAvatarChange">
                    <img v-if="form.cover" :src="form.cover" class="avatar w-96 h-48" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="摘要" prop="summary">
                <!-- :rows="3" 指定 textarea 默认显示 3 行 -->
                <el-input v-model="form.summary" :rows="3" type="textarea" placeholder="请输入文章摘要" />
            </el-form-item>
            <el-form-item label="分类" prop="categoryId">
                <el-select v-model="form.categoryId" clearable placeholder="---请选择---" size="large">
                    <el-option v-for="item in articleCategorys" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="标签" prop="tags">
                <!-- 标签选择 -->
                <el-select v-model="form.tags" multiple filterable remote reserve-keyword placeholder="---请输入---"
                    remote-show-suffix :remote-method="remoteMethod" allow-create default-first-option
                    :loading="tagSelectLoading" size="large">
                    <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <div class="flex w-full">
                    <el-button class="ml-auto" type="primary" plain :icon="Document"
                        @click="publishArticle(false)">存草稿</el-button>
                    <el-button type="primary" plain :icon="Position" @click="publishArticle(true)">发布</el-button>
                </div>
            </el-form-item>
        </el-form>
    </el-dialog>

</template>

<script setup>
import { Search, RefreshRight, Edit, Position, Document } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue';
import moment from 'moment';
import { getCategoryAllList as getCategoryAllListApi } from '@/api/admin/category'
import { getTagAllList as getTagAllListApi } from '@/api/admin/tag'
import { showMessage, showModel } from '@/utils/message/message';
import { Picture as IconPicture } from '@element-plus/icons-vue'
import 'md-editor-v3/lib/style.css'
import { MdEditor } from 'md-editor-v3';
import { updateArticleApi, publishArticleApi } from '@/api/admin/article'
import { uploadAvatar } from '@/api/admin/file';

const props = defineProps({
    form: {
        type: Object,
        default: () => {
            return {
                id: null,
                title: '',
                content: '请输入内容',
                cover: '',
                categoryId: null,
                tags: [],
                summary: ""
            }
        }
    }
})


const emit = defineEmits(['beforeClose'])
const beforeClose = () => {
    emit('beforeClose')
}

const closeA = () => {
    isArticlePublishEditorShow.value = false
    // 清空表单数据  这样并没有清空
    beforeClose()

}


// 对话框是否显示
const isArticlePublishEditorShow = ref(false)

const open = () => {
    isArticlePublishEditorShow.value = true
}



const tagSelectLoading = ref(false)
const tagOptions = ref([])
const remoteMethod = async (query) => {
    if (query) {
        tagSelectLoading.value = true

        tagSelectLoading.value = false

        try {
            const data = await getTagAllListApi({ name: query })
            // for 循环遍历data
            data.forEach(item => {
                tagOptions.value.push({
                    value: item.name,
                    label: item.name
                })
            });
        } catch (error) {
            console.log(error)
            tagOptions.value = []
        }

    } else {
        tagOptions.value = []
    }
}

// 发布文章表单引用
const publishArticleFormRef = ref(null)

// 表单校验规则
const rules = {
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { min: 1, max: 40, message: '文章标题要求大于1个字符，小于40个字符', trigger: 'blur' },
    ],
    content: [{ required: true }],
    cover: [{ required: true }],
    categoryId: [{ required: true, message: '请选择文章分类', trigger: 'blur' }],
    tags: [{ required: true, message: '请选择文章标签', trigger: 'blur' }],
}


const articleCategorys = ref([])

const getCategoryAllList = async () => {

    try {
        const data = await getCategoryAllListApi()
        // for 循环遍历data
        data.forEach(item => {
            articleCategorys.value.push({
                value: item.id,
                label: item.name
            })
        });
        console.log(articleLabels)

    } finally {

    }
}


const publishArticle = (publish) => {
    publishArticleFormRef.value.validate(async (valid) => {
        if (!valid) {
            // 提交表单
            console.log('表单校验不通过')
            return false
        }

        let body = {}
        if (publish) {
            body = {
                id: props.form.id,
                title: props.form.title,
                content: props.form.content,
                cover: props.form.cover,
                category: props.form.categoryId,
                tags: props.form.tags,
                summary: props.form.summary,
                status: 1,
            }
        } else {
            body = {
                id: props.form.id,
                title: props.form.title,
                content: props.form.content,
                cover: props.form.cover,
                category: props.form.categoryId,
                tags: props.form.tags,
                summary: props.form.summary,
                status: 0,
            }
        }

        try {
            if (body.id) {
                await updateArticleApi(body)

            } else {
                await publishArticleApi(body)

            }
            showMessage(publish ? '发布成功' : '草稿保存成功', 'success')
            closeA()
        } finally {

        }

    })
}


const handleAvatarChange = async (file) => {
    console.log('开始上传封面');

    if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') {
        showMessage('封面必须为jpg/png格式', 'error')
        return
    } else if (file.raw.size / 1024 / 1024 > 4) {
        showMessage('封面不能大于4MB！', 'error')
        return
    }

    let formData = new FormData()
    formData.append('avatar', file.raw)


    const res = await uploadAvatar(formData)
    showMessage('封面上传成功', 'success')
    props.form.cover = res
}



onMounted(() => {
    getCategoryAllList()
    // 获取表格数据

})




defineExpose({ open })


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
    width: 200px;
    height: 100px;
    text-align: center;
}

.md-editor-footer {
    height: 40px;

}
</style>