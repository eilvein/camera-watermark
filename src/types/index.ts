export interface IUnknowObject {
    [key: string]: any
}

// 歌手
export interface ISingerData extends IUnknowObject {
    id: number
    name: string
    img1v1Url: string
    picUrl: string
    alias: Array<string | undefined>
}

// 歌曲列表
export interface ISong extends IUnknowObject {
    id: number
    name: string
    dt: number
    al: any
    ar: Array<{ id: number; name: string }>
}
