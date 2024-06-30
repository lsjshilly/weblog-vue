
export function showMessage(message, type = 'success', customclass = '') {
    return ElMessage({
        message: message,
        type: type,
        customclass: customclass
    })
}


export function showModel(content, title = '提示', type = 'warning') {
    return ElMessageBox.confirm(
        content,
        title,
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: type,
        }
    )
}