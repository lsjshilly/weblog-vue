
export function showMessage(message, type = 'success', customclass = '') {
    return ElMessage({
        message: message,
        type: type,
        customclass: customclass
    })
}