export interface IConfig {
    env: string // 开发环境
    mock?: string // mock数据
    title: string // 项目title
    baseUrl?: string // 项目地址
    baseApi?: string // api请求地址
    APPID?: string // 公众号appId  一般放在服务器端
    wsUrl?: string
    appPackageID: string
    APPSECRET?: string // 公众号appScript 一般放在服务器端
    $cdn: string // cdn公共资源路径
}
import { devConfig } from './env.development'
import { proConfig } from './env.production'
import { testConfig } from './env.test'

const ENV_NAME = import.meta.env.VITE_MODE_NAME
let mod: any
if (ENV_NAME === 'development') {
    mod = devConfig
} else if (ENV_NAME === 'production') {
    mod = proConfig
} else {
    mod = testConfig
}
export const config: IConfig | any = mod
