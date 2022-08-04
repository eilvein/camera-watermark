import { Router } from 'vue-router'
import store from '@/store'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { isWeChat, getQueryParams, phoneModel } from '@/utils/tools'
import { wechatSilentUrl, wechatSilentLogin } from '@/api/wxController'
import axios from 'axios'
// import { getLocalStorage } from '@/utils/storage'
// import { setAuthorization } from '@/utils/tools'
declare module 'vue-router' {
    interface RouteMeta {
        // 是可选的
        isAdmin?: boolean
        // 是否需要登录
        requireLogin?: boolean
    }
}
interface IQueryParams {
    code?: string
}
function registerRouteGuard(router: Router) {
    /**
     * 全局前置守卫
     */
    router.beforeEach((to, from, next) => {
        let title: string = (to.meta as any).title
        if (title) {
            useDocumentTitle(title)
        }
        if (to.meta.requireLogin) {
            next('/login')
        } else {
            // 解决ios微信下，分享签名不成功的问题,将第一次的进入的url缓存起来。
            if (window.entryUrl === undefined) {
                window.entryUrl = location.href.split('#')[0]
            }
            const { code } = getQueryParams<IQueryParams>()
            console.info('registerRouteGuard:CODE', code)

            // if (isWeChat()) {
            //     const isAuth = !store.state.auth.isAuth
            //     if (code) {
            //         const openId = store.getters.openId
            //         console.info('registerRouteGuard:OPENID', openId)
            //         if (!openId) {
            //             store.commit('auth/SET_ISAUTH', true)
            //             store.commit('auth/SET_CODE', code)
            //             wechatSilentLogin({ code: code }).then((res) => {
            //                 console.log('wechatSilentLogin', res)
            //                 axios.defaults.headers.common['Authorization'] = setAuthorization(
            //                     res.data
            //                 )
            //                 store.commit('auth/SET_AUTH', res.data)
            //                 store.commit('auth/SET_OPENID', res.data.wechat.openId)
            //                 store.commit('auth/SET_ISLOGIN', res.data.auth.accessToken)
            //             })
            //         }
            //     }
            //     if (isAuth) {
            //         let url = location.href.split('?')[0]
            //         wechatSilentUrl({
            //             redirect_uri: url,
            //             state: new Date().getTime().toString()
            //         }).then((res) => {
            //             if (res.result === 0) {
            //                 location.href = res.data
            //             }
            //         })
            //     }
            // }
            next()
        }
    })

    /**
     * 全局解析守卫
     */
    router.beforeResolve(async (to) => {
        if (to.meta.isAdmin) {
            try {
                console.log(to)
            } catch (error) {
                console.error(error)
            }
        }
    })

    /**
     * 全局后置守卫
     */
    router.afterEach((to, from, failure) => {
        // let authUrl
        // if (phoneModel() === 'ios') {
        //     authUrl = window.entryUrl
        // } else {
        //     authUrl = window.location.href
        // }
        // store.commit('link/SET_INIT_LINK', authUrl)
        if (failure) {
            console.error(failure)
        }
    })
}

export default registerRouteGuard
