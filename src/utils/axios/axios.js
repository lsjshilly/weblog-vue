import axios from "axios";
import { showMessage } from "../message/message";

import { getToken } from "@/stores/cookie";

const instance = axios.create({
    baseURL: "/api",
    timeout: 7000
})


/**
 * 配置axios实例的请求拦截器
 * 
 * 该拦截器用于在发送请求之前对请求配置进行处理。它可以用于添加公共请求头、认证信息等。
 * 如果处理成功，必须返回修改后的配置对象或原始配置对象。
 * 
 * @param {Object} config 请求配置对象，包含url、method、data等信息
 * @returns {Object} 返回经过处理的请求配置对象
 */
instance.interceptors.request.use(
    config => {
        // 发送请求之前做些什么
        const token = getToken()

        // 请求头添加header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        // 过滤掉params中为空或null的字段，通常用于GET请求的查询参数
        if (config.params) {
            config.params = Object.fromEntries(
                Object.entries(config.params).filter(([key, value]) => value !== null && value !== '')
            );
        }

        return config
    },
    error => {
        // 请求错误做些什么
        return Promise.reject(error)
    }
)

/**
 * 配置axios实例的响应拦截器
 * 
 * 该拦截器用于在接收到响应后对响应数据进行处理。它可以用于处理响应数据格式、错误处理等。
 * 如果处理成功，必须返回响应数据或转封装后的数据。
 * 
 * @param {Object} response 响应数据对象，包含状态码、数据等信息
 * @returns {Object} 返回处理后的响应数据
 */
instance.interceptors.response.use(
    response => {
        // 2xx 范围以内的状态码都会触发该函数

        const { code, data, message } = response.data

        // 未登录
        if (code === '100103') {
            showMessage(message, 'error')
            this.$router.push('/login')
            return Promise.reject(new Error(message))
        }

        // 权限不足， 未实现
        if (code === '100103x') {
            showMessage(message, 'error')
            // 跳转403页面
            return Promise.reject(new Error(message))
        }


        // 响应失败
        if (code !== '000000') {
            showMessage(message, 'error')
            return Promise.reject(new Error(message))
        }

        return data
    },
    error => {
        // 2xx 范围以内的状态码都会触发该函数
        showMessage(error.message, 'error')
        return Promise.reject(error)
    }
)



export default instance