import http from '@/utils/axios/axios'

export function getArticlePageListApi(params, opts = {}) {
    return http.get('/admin/article/page', { ...opts, params: params })
}


export function publistArticleApi(body, opts = {}) {
    return http.post('/admin/article/publish', body, opts)
}

export function deleteArticleByIdApi(id, opts = {}) {
    let data = { id: id }
    return http.delete('/admin/article/delete', { ...opts, data: data })
}


