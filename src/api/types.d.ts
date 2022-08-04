export interface IApiUserInfo {
    usserId: string
    name: string
}

export interface IToken {
    token: string
}

// 用户信息
export interface IUserInfo {
    author?: string
    avator?: string
    projectAddress?: string
}

// Jssdk配置信息
export interface IJsSdk {
    signature: string
    nonceStr: string
    timestamp: string
    appId: string
}

export interface IBodyParams {
    type: string
    ranges: string
    pageSize?: number
    page?: number
}

// 搜索
export interface IqueryParams extends IBodyParams {
    keywords: string
}
