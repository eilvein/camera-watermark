import axios, { AxiosRequestConfig } from 'axios'
import store from '@/store'
import { setAuthorization } from '@/utils/tools'
// import { getLocalStorage } from './storage'
type IAxiosResponse<T> = Request.IAxiosResponse<T>
const BASE_API_URL = import.meta.env.VITE_BASE_API

const service = axios.create({
    baseURL: BASE_API_URL,
    timeout: 10 * 1000,
    headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded'
        'Content-Type': 'application/json; charset=UTF-8'
    }
})

// http request 拦截器
service.interceptors.request.use(
    (config) => {
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        // const token = getLocalStorage('WX_TOKEN')
        const token = store.getters.openId
        console.log('RequestInterceptors:', store.getters.authInfo)
        if (token) {
            config.headers.Authorization = setAuthorization(store.getters.authInfo)
        }
        return config
    },
    (err) => {
        return Promise.reject(err)
    }
)

// http response 拦截器
service.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    // logout()
                    // router.replace({
                    //     path: '/login',
                    //     query: { redirect: router.currentRoute.fullPath }
                    // })
                    console.log('Token 失效，请重新登录。')
                    break
                default:
                    console.log('服务器错误，请重试。')
                    break
            }
        } else {
            console.log('服务器错误，请重试。')
        }
        return Promise.reject(error) // 返回接口返回的错误信息
    }
)

service.defaults.transformResponse = (response) => {
    try {
        const res = JSON.parse(response)
        if (res.result === 0) {
            return {
                data: res.data,
                desc: res.desc,
                success: true,
                result: res.result,
                msg: res.message || res.msg
            }
        } else {
            return {
                data: res.data,
                desc: res.desc,
                success: false,
                result: res.result,
                msg: res.message || res.msg || ''
            }
        }
    } catch (e) {
        return {
            success: false,
            msg: '接口返回格式有误，请重试。'
        }
    }
}

export default {
    // T 表示API返回的 类型声明
    get<T>(
        url: string,
        params: any = {},
        options: AxiosRequestConfig = {}
    ): Promise<IAxiosResponse<T>> {
        return service.get(url, {
            ...options,
            params
        })
    },
    post<T>(
        url: string,
        data: any = {},
        options: AxiosRequestConfig = {}
    ): Promise<IAxiosResponse<T>> {
        return service.post(url, data, {
            ...options
        })
    }
}
