<template>
    <div>
        <!-- 表头分页查询条件， shadow="never" 指定 card 卡片组件没有阴影 -->
        <el-card shadow="never" class="mb-5">
            <!-- flex 布局，内容垂直居中 -->
            <div class="flex items-center">
                <el-text>标签名称</el-text>
                <div class="ml-3 w-52 mr-5"><el-input v-model="searchCondition.name" placeholder="请输入（模糊查询）" /></div>

                <el-text>创建日期</el-text>
                <div class="ml-3 w-30 mr-5">
                    <!-- 日期选择组件（区间选择） -->
                    <el-date-picker v-model="pickerData" type="daterange" range-separator="至" start-placeholder="开始时间"
                        end-placeholder="结束时间" size="default" @change="dataPickerChange" :shortcuts="shortcuts" />
                </div>

                <el-button type="primary" class="ml-3" :icon="Search" @click="getTagData">查询</el-button>
                <el-button class="ml-3" :icon="RefreshRight" @click="resetTagData">重置</el-button>
            </div>
        </el-card>

        <el-card shadow="never">
            <!-- 新增按钮 -->
            <div class="mb-5">
                <el-button type="primary" @click="addTagBtnClick">
                    <el-icon class="mr-1">
                        <Plus />
                    </el-icon>
                    新增</el-button>
            </div>

            <!-- 分页列表 -->
            <el-table :data="tableData" border stripe style="width: 100%" v-loading="tableloading">
                <el-table-column prop="name" label="标签名称" width="180">
                    <template #default="scope">
                        <el-tag type="success">{{ scope.row.name }}</el-tag>

                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="danger" size="small" @click="deleteTag(scope.row.id)">
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



        <from-dialog ref="formDialogVisible" title="新增标签" destroyOnClose @submit="addTagAction">
            <el-form label-width="auto" style="max-width: 600px" ref="addTagFormRef">
                <el-form-item label="名称">
                    <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false"
                        class="mx-1 my-1" @close="handleClose(tag)">
                        {{ tag }}
                    </el-tag>
                    <span class="w-20">
                        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20" size="small"
                            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">
                            + 新增标签
                        </el-button>
                    </span>

                </el-form-item>
            </el-form>

        </from-dialog>



    </div>
</template>

<script setup>
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue';
import moment from 'moment';
import { getTagPageList, addTag, deleteTagById } from '@/api/admin/tag'
import { showMessage, showModel } from '@/utils/message/message';


const pickerData = ref('')

// 查询条件
const searchCondition = reactive({
    name: '',
    startDate: '',
    endDate: ''
})

const tableloading = ref(false)

// 表格数据
const tableData = ref([])

// 当前页码，给了一个默认值 1
const current = ref(1)
// 总数据量，给了个默认值 0
const total = ref(0)
// 每页显示的数据量，给了个默认值 10
const size = ref(10)


// 对话框是否显示
const formDialogVisible = ref(null)

// 表单引用
const addTagFormRef = ref(null)


// 新增tag 输入
const inputValue = ref('')
const dynamicTags = ref([])
// 新增tag 输入是否可见
const inputVisible = ref(false)
const InputRef = ref()


const addTagBtnClick = () => {
    formDialogVisible.value.open()
}


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



const dataPickerChange = (val) => {
    searchCondition.startDate = moment(val[0]).format('YYYY-MM-DD')
    searchCondition.endDate = moment(val[1]).format('YYYY-MM-DD')
}


const getTagData = async () => {

    tableloading.value = true
    try {
        const data = await getTagPageList({
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


const sizeChange = (val) => {
    size.value = val
    getTagData()
}

const currentChange = (val) => {
    current.value = val
    getTagData()
}



function conditionReset() {
    searchCondition.name = ''
    searchCondition.startDate = ''
    searchCondition.endDate = ''
}


const resetTagData = () => {
    conditionReset()
    getTagData()
}

const deleteTag = (id) => {
    console.log('删除', id)
    showModel('是否确定删除该标签？', '提示', 'warning').then(async () => {
        // 删除
        await deleteTagById(id)
        showMessage('删除成功')
        // 刷新表格
        getTagData()
    })
}

onMounted(() => {
    // 获取表格数据
    getTagData()
})



const addTagAction = async () => {

    if (!dynamicTags.value || dynamicTags.value.length == 0) return
    // 表单验证

    try {
        // 登录loading状态
        formDialogVisible.value.showBtnLoading()
        // 调用新增接口
        await addTag({ tags: dynamicTags.value })

        // 提示成功
        showMessage('添加成功')

    } finally {
        // 停止loading  
        formDialogVisible.value.hideBtnLoading()
        // 成功之后清清除信息
        dynamicTags.value = []
        formDialogVisible.value.close()
        // 刷新表格
        getTagData()
    }

}


const handleClose = (tag) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value.input.focus()
    })
}

const handleInputConfirm = () => {
    if (inputValue.value) {
        dynamicTags.value.push(inputValue.value)
    }
    inputVisible.value = false
    inputValue.value = ''
}



</script>