import http from '@/utils/axios/axios'

export function login(body, opts = {}) {

    return http.post('/login', body, opts)

}