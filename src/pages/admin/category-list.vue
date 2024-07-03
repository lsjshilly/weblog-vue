<template>
    <div>
        <!-- 表头分页查询条件， shadow="never" 指定 card 卡片组件没有阴影 -->
        <el-card shadow="never" class="mb-5">
            <!-- flex 布局，内容垂直居中 -->
            <div class="flex items-center">
                <el-text>分类名称</el-text>
                <div class="ml-3 w-52 mr-5"><el-input v-model="searchCondition.name" placeholder="请输入（模糊查询）" /></div>

                <el-text>创建日期</el-text>
                <div class="ml-3 w-30 mr-5">
                    <!-- 日期选择组件（区间选择） -->
                    <el-date-picker v-model="pickerData" type="daterange" range-separator="至" start-placeholder="开始时间"
                        end-placeholder="结束时间" size="default" @change="dataPickerChange" :shortcuts="shortcuts" />
                </div>

                <el-button type="primary" class="ml-3" :icon="Search" @click="getCategoryData">查询</el-button>
                <el-button class="ml-3" :icon="RefreshRight" @click="resetCategoryData">重置</el-button>
            </div>
        </el-card>

        <el-card shadow="never">
            <!-- 新增按钮 -->
            <div class="mb-5">
                <el-button type="primary">
                    <el-icon class="mr-1">
                        <Plus />
                    </el-icon>
                    新增</el-button>
            </div>

            <!-- 分页列表 -->
            <el-table :data="tableData" border stripe style="width: 100%">
                <el-table-column prop="name" label="分类名称" width="180" />
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="danger" size="small" @click="deleteCategory(scope.row.id)">
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

    </div>
</template>

<script setup>
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue';
import moment from 'moment';
import { getCategoryPageList } from '@/api/admin/category'

const pickerData = ref('')

// 查询条件
const searchCondition = reactive({
    name: '',
    startDate: '',
    endDate: ''
})



// 表格数据
const tableData = ref([])

// 当前页码，给了一个默认值 1
const current = ref(1)
// 总数据量，给了个默认值 0
const total = ref(0)
// 每页显示的数据量，给了个默认值 10
const size = ref(10)


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


const getCategoryData = async () => {

    const data = await getCategoryPageList({
        ...searchCondition,
        pageSize: size.value,
        pageNum: current.value
    })

    total.value = data.total
    tableData.value = data.items

}


const sizeChange = (val) => {
    size.value = val
    getCategoryData()
}

const currentChange = (val) => {
    current.value = val
    getCategoryData()
}



function conditionReset() {
    searchCondition.name = ''
    searchCondition.startDate = ''
    searchCondition.endDate = ''
}


const resetCategoryData = () => {
    conditionReset()
    getCategoryData()
}

const deleteCategory = (id) => {
    console.log('删除', id)
}


onMounted(() => {
    // 获取表格数据
    getCategoryData()
})



</script>