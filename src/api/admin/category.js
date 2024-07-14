import http from '@/utils/axios/axios'

export function getCategoryPageList(params, opts = {}) {
    return http.get('/admin/category/page', { ...opts, params: params })
}


export function addCategory(body, opts = {}) {
    return http.post('/admin/category/add', body, opts)
}

export function deleteCategoryById(id, opts = {}) {
    let data = { id: id }
    return http.delete('/admin/category/delete', { ...opts, data: data })
}

export function getCategoryAllList(opts = {}) {
    return http.get('/admin/category/select/list', opts)
}