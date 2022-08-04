import request from '../utils/request'
import { config } from '@/config'

/**
 * JS-SDK使用权限签名算法
 * @param data
 * @returns
 */
export const wechatJssdk = (data: { url: string }) => {
    return request.post<any>('/api/wechat/jssdk', data)
}

/**
 * 获取微信授权地址（静默）
 * @param data
 * @returns
 */
export const wechatSilentUrl = (data: { redirect_uri: string; state: string }) => {
    return request.post<any>('/api/wechat/silenturl', data)
}

/**
 * 微信静默授权
 * @param data
 * @returns
 */
export const wechatSilentLogin = (data: {}) => {
    return request.post<any>('/api/wechat/silentlogin', data)
}

/**
 * 前端微信授权（暂时不用，后段返回了）
 * @returns
 */
export const fetchWeChatAuth = () => {
    const redirectHref =
        'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
        config.APPID +
        '&redirect_uri=' +
        encodeURIComponent(location.href.split('?')[0]) +
        '&response_type=code&scope=snsapi_userinfo&state=' +
        'STATE' +
        '#wechat_redirect'
    return redirectHref
}
