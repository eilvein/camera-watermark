declare namespace Request {
    /**
     * 接口返回格式
     */
    export interface IAxiosResponse<T> {
        data?: T
        desc: string
        success: boolean
        result: number
        msg: string
    }
}
