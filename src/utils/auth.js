
import { useCookies } from "@vueuse/integrations/useCookies";

const TOKEN_KEY = 'Authorization'

const cookie = useCookies()


/**
 * 获取用户令牌
 * 
 * 本函数用于从cookie中获取用户令牌。用户令牌是用于标识用户身份的重要信息，
 * 在请求接口时通常需要携带该令牌以进行身份验证。
 * 
 * @returns {string} 返回用户令牌字符串。如果cookie中不存在该令牌，则返回空字符串。
 */
export function getToken() {
    // 从cookie中获取名为TOKEN_KEY的值
    return cookie.get(TOKEN_KEY)
}


/**
 * 设置token到cookie中。
 * 
 * 本函数用于将token值存储到用户的cookie中，以便于后续的请求中可以携带该token进行身份验证。
 * 选择使用cookie作为存储方式是因为cookie可以在客户端和服务器之间传递，并且具有一定的安全性和便捷性。
 * 
 * @param {string} token - 需要设置到cookie中的token值。token通常是一个经过特定算法生成的字符串，用于标识用户的身份。
 * @returns {boolean} - 返回设置cookie的操作结果。如果成功设置，则返回true；否则返回false。
 */
export function setToken(token) {
    return cookie.set(TOKEN_KEY, token)
}


/**
 * 删除令牌函数
 * 
 * 本函数用于从用户浏览器中删除已登录状态的令牌信息。令牌通常用于识别用户身份和维持会话状态。
 * 删除令牌是为了在用户登出或需要重新认证时，确保用户的安全性和会话的正确终止。
 * 
 * @returns {Promise<void>} 由于操作可能涉及异步处理，函数返回一个Promise，但不期望有明确的返回值。
 */
export function removeToken() {
    // 调用cookie.remove方法，传入TOKEN_KEY作为参数，删除对应的令牌信息
    return cookie.remove(TOKEN_KEY)
}