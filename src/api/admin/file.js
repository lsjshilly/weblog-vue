import http from '@/utils/axios/axios'


export function uploadAvatar(form) {
    return http.post('/admin/upload/avatar', form)
}