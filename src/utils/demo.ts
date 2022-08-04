import dayjs from 'dayjs'

// Format and filter json data using filterKeys array
export const formatJson = (filterKeys: any, jsonData: any) => {
    jsonData.map((data: any) => {
        filterKeys.map((key: string) => {
            // time format
            if (key === 'timestamp') {
                return dayjs(data[key]).format('YYYY-MM-DD HH:mm:ss')
            } else {
                return data[key]
            }
        })
    })
}

// Get Round Number
export const getRound = (num: number, len: number): number => {
    return Math.round(num * Math.pow(10, len)) / Math.pow(10, len)
}

export default class Base {
    // 复制对象或数组
    static cloneObjOrArr(obj: object) {
        let a = JSON.stringify(obj)
        let b = JSON.parse(a)
        return b
    }
    // 数组去重
    static unique(arr: any) {
        if (!Array.isArray(arr)) {
            console.log('type error!')
            return
        }
        return Array.from(new Set(arr))
    }
}
