import http from '@/utils/axios/axios'

export function login(body, opts = {}) {

    return http.post('/login', body, opts)

}

export function getUserInfo(opts = {}) {

    return http.get('/admin/user/info', opts)

}


export function updatePassword(body, opts = {}) {

    return http.post('/admin/password/update', body, opts)

}