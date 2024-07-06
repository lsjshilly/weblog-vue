import http from '@/utils/axios/axios'

export function getTagPageList(params, opts = {}) {
    return http.get('/admin/tag/page', { ...opts, params: params })
}


export function addTag(body, opts = {}) {
    return http.post('/admin/tag/add', body, opts)
}

export function deleteTagById(id, opts = {}) {
    let data = { id: id }
    return http.delete('/admin/tag/delete', { ...opts, data: data })
}