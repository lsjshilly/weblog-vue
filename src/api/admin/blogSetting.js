import http from '@/utils/axios/axios'

export function getBlogSettingDetail(opts = {}) {
    return http.get('/admin/blog/setting', opts)
}


export function updateBlogSetting(body, opts = {}) {
    return http.put('/admin/blog/setting/update', body, opts)
}

