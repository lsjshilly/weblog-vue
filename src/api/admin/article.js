import http from '@/utils/axios/axios'

export function getArticlePageListApi(params, opts = {}) {
    return http.get('/admin/article/page', { ...opts, params: params })
}

export function getArticleDetailApi(body, opts = {}) {
    return http.post('/admin/article', body, opts)
}


export function publishArticleApi(body, opts = {}) {
    return http.post('/admin/article/publish', body, opts)
}


export function updateArticleApi(body, opts = {}) {
    return http.put('/admin/article/update', body, opts)
}


export function deleteArticleByIdApi(id, opts = {}) {
    let data = { id: id }
    return http.delete('/admin/article/delete', { ...opts, data: data })
}


