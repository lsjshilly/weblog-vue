<template>
    <div>
        <!-- 表头分页查询条件， shadow="never" 指定 card 卡片组件没有阴影 -->
        <el-card shadow="never" class="mb-5">
            <!-- flex 布局，内容垂直居中 -->
            <div class="flex items-center">
                <el-text>文章名称</el-text>
                <div class="ml-3 w-52 mr-5"><el-input v-model="searchCondition.name" placeholder="请输入（模糊查询）" /></div>

                <el-text>分类</el-text>
                <div class="ml-3 w-52 mr-5">
                    <el-select v-model="searchCondition.category" filterable placeholder="请选择 (文章分类)">
                        <el-option v-for="item in articleCategorys" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </div>

                <el-text>标签</el-text>
                <div class="ml-3 w-52 mr-5">
                    <el-select v-model="searchCondition.tagIds" filterable multiple collapse-tags collapse-tags-tooltip
                        :max-collapse-tags="2" placeholder="请选择 (文章标签)">
                        <el-option v-for="item in articleLabels" :key="item.value" :label="item.label"
                            :value="item.value">
                            <el-tag type="success" size="small"> {{ item.label }} </el-tag>
                        </el-option>
                        <template #tag>
                            <el-tag type="success" v-for="tagId in visiableTagIds" :key="tagId">

                                {{ getTagNameById(tagId) }}

                            </el-tag>
                            <el-tag v-if="remainingTagsCount > 0" type="info">
                                +{{ remainingTagsCount }}
                            </el-tag>

                        </template>
                    </el-select>
                </div>

                <el-text>创建日期</el-text>
                <div class="ml-3 w-30 mr-5">
                    <!-- 日期选择组件（区间选择） -->
                    <el-date-picker v-model="pickerData" type="daterange" range-separator="至" start-placeholder="开始时间"
                        end-placeholder="结束时间" size="default" @change="dataPickerChange" :shortcuts="shortcuts" />
                </div>

                <el-button type="primary" class="ml-3" :icon="Search" @click="getArticleListData">查询</el-button>
                <el-button class="ml-3" :icon="RefreshRight" @click="resetCategoryData">重置</el-button>
            </div>
        </el-card>

        <el-card shadow="never">
            <!-- 新增按钮 -->
            <div class="mb-5">
                <el-button type="primary" @click="isArticlePublishEditorShow = true">
                    <el-icon class="mr-1">
                        <Plus />
                    </el-icon>
                    写文章</el-button>
            </div>

            <!-- 分页列表 -->
            <el-table :data="tableData" border stripe style="width: 100%" v-loading="tableloading" size="small">
                <el-table-column prop="title" label="文章标题" width="180" />

                <el-table-column label="封面" width="85">
                    <template #default="scope">
                        <el-image class="w-16 h-16" :src="scope.row.cover" :z-index="100" :zoom-rate="1.2"
                            :max-scale="7" :min-scale="0.2" :preview-src-list="[scope.row.cover]" fit="cover">
                            <template #error>
                                <div class="flex justify-center items-center w-full h-full bg-slate-100">
                                    <el-icon><icon-picture /></el-icon>
                                </div>
                            </template>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="categoryName" label="分类" width="180" />
                <el-table-column label="标签" width="180">
                    <template #default="scope">
                        <el-tag type="success" v-for="item in scope.row.tags" :key="item.id" class="mr-1"> {{ item.name
                            }} </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column prop="updateTime" label="更新时间" width="180" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" :icon="Edit" size="small">
                            编辑
                        </el-button>
                        <el-button type="danger" size="small" @click="deleteArticle(scope.row.id)">
                            <el-icon class="mr-1">
                                <Delete />
                            </el-icon>
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="mt-10 flex justify-center">
                <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="[10, 20, 50]"
                    :small="false" :background="true" layout="total, sizes, prev, pager, next, jumper" :total="total"
                    @size-change="sizeChange" @current-change="currentChange" />
            </div>

        </el-card>



        <!-- 写博客 -->
        <el-dialog v-model="isArticlePublishEditorShow" :show-close="false" :fullscreen="true">
            <template #header="{ close, titleId, titleClass }">
                <el-affix :offset="20" style="width: 100%;">
                    <div class="flex   bg-white">
                        <h4 class="font-bold">写文章</h4>
                        <div class="ml-auto mr-5">
                            <el-button plain @click="close">取消</el-button>
                            <el-button type="primary" plain :icon="Position">取消</el-button>
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
                    <el-upload class="avatar-uploader" action="#" :auto-upload="false" :show-file-list="false">
                        <img v-if="form.cover" :src="form.cover" class="avatar" />
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

                    </el-select>
                </el-form-item>
                <el-form-item label="标签" prop="tags">
                    <!-- 标签选择 -->
                    <el-select v-model="form.tags" multiple filterable remote reserve-keyword placeholder="---请输入---"
                        remote-show-suffix :remote-method="remoteMethod" allow-create default-first-option
                        :loading="tagSelectLoading" size="large">

                    </el-select>
                </el-form-item>
            </el-form>
        </el-dialog>



    </div>
</template>

<script setup>
import { Search, RefreshRight, Edit, Position } from '@element-plus/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue';
import moment from 'moment';
import { getCategoryPageList, addCategory, deleteCategoryById, getCategoryAllList as getCategoryAllListApi } from '@/api/admin/category'
import { getTagAllList as getTagAllListApi } from '@/api/admin/tag'
import { showMessage, showModel } from '@/utils/message/message';

import { getArticlePageListApi, deleteArticleByIdApi } from '@/api/admin/article'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import 'md-editor-v3/lib/style.css'
import { MdEditor } from 'md-editor-v3';

// 日期选择组件（区间选择）
const pickerData = ref('')
// 日期快捷选择
const shortcuts = [
    {
        text: '最近一周',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setDate(start.getDate() - 7)
            return [start, end]
        },
    },
    {
        text: '最近一月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 1)
            return [start, end]
        },
    },
    {
        text: '最近三月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 3)
            return [start, end]
        },
    },
]

// 查询条件
const searchCondition = reactive({
    name: '',
    category: '',
    tagIds: [],
    startDate: '',
    endDate: ''
})
// 日期选择组件（区间选择）绑定到 searchCondition
const dataPickerChange = (val) => {
    searchCondition.startDate = moment(val[0]).format('YYYY-MM-DD')
    searchCondition.endDate = moment(val[1]).format('YYYY-MM-DD')
}





/**
 * 查询条件相关函数，标签以及分类查询相关
 */
const articleLabels = ref([])

const articleCategorys = ref([])

const visiableTagIds = computed(() => {
    return searchCondition.tagIds.slice(0, 2)
})

const remainingTagsCount = computed(() => Math.max(0, searchCondition.tagIds.length - 2));

const getTagNameById = (tagId) => {
    return articleLabels.value.filter(item => item.value == tagId)[0].label
}

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


const getTagAllList = async () => {

    try {
        const data = await getTagAllListApi({ name: '' })
        // for 循环遍历data
        data.forEach(item => {
            articleLabels.value.push({
                value: item.id,
                label: item.name
            })
        });
        console.log(articleLabels)

    } finally {

    }
}




/*
 * 表格数据相关
*/

const tableloading = ref(false)

// 表格数据
const tableData = ref([])

// 当前页码，给了一个默认值 1
const current = ref(1)
// 总数据量，给了个默认值 0
const total = ref(0)
// 每页显示的数据量，给了个默认值 10
const size = ref(10)
// 获取表格数据
const getArticleListData = async () => {

    tableloading.value = true
    try {
        const data = await getArticlePageListApi({
            ...searchCondition,
            pageSize: size.value,
            pageNum: current.value
        })

        total.value = data.total
        tableData.value = data.items
    } finally {
        tableloading.value = false

    }


}

// 分页相关
const sizeChange = (val) => {
    size.value = val
    getArticleListData()
}

const currentChange = (val) => {
    current.value = val
    getArticleListData()
}

// 重置查询条件
function conditionReset() {
    searchCondition.name = ''
    searchCondition.startDate = ''
    searchCondition.endDate = ''
    searchCondition.category = ''
    searchCondition.tagIds = []
}

// 重置表格数据
const resetCategoryData = () => {
    conditionReset()
    getArticleListData()
}

// 删除文章
const deleteArticle = (id) => {
    console.log('删除', id)
    showModel('是否确定删除该文章？', '提示', 'warning').then(async () => {
        // 删除
        await deleteArticleByIdApi(id)
        showMessage('删除成功')
        // 刷新表格
        getArticleListData()
    })
}




/*
 * 新增文章对话框相关
*/

// 对话框是否显示
const isArticlePublishEditorShow = ref(false)

// 发布文章表单引用
const publishArticleFormRef = ref(null)

// 表单对象
const form = reactive({
    id: null,
    title: '',
    content: '请输入内容',
    cover: '',
    categoryId: null,
    tags: [],
    summary: ""
})

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






onMounted(() => {
    getArticleListData()
    getCategoryAllList()
    getTagAllList()
    // 获取表格数据

})



const addCategoryAction = (formEl) => {

    if (!formEl) return
    // 表单验证
    formEl.validate(async (valid) => {

        if (!valid) {
            console.log('表单验证不通过')
            return false
        }

        try {
            // 登录loading状态
            formDialogVisible.value.showBtnLoading()
            // 调用新增接口
            await addCategory(addCategoryForm)

            // 提示成功
            showMessage('添加成功')

        } finally {
            // 停止loading  
            formDialogVisible.value.hideBtnLoading()
            // 成功之后清清除信息
            clearFormValue()
            formDialogVisible.value.close()
            // 刷新表格
            getArticleListData()
        }

    })
}


function clearFormValue() {
    addCategoryForm.name = ''
}


</script>

<style scoped>
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
</style>