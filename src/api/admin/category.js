import http from '@/utils/axios/axios'

export function getCategoryPageList(params, opts = {}) {
    return http.get('/admin/category/page', { ...opts, params: params })
}