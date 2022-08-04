import { ref } from 'vue'
import { Base64 } from 'js-base64'
import { config } from '@/config/index'
import dayjs from 'dayjs'

/**
 * 简易深克隆
 * @param data 被克隆的值
 */
const deepClone = <T>(data: T): T => {
    return JSON.parse(JSON.stringify(data))
}

/**
 * 防抖函数
 * @param fn 回调函数
 * @param delayTime 延迟执行毫秒数
 */
const debounce = (fn: Function, delayTime: number = 300) => {
    let timer: number | null = null
    return function (this: any, ...args: any) {
        timer && clearTimeout(timer) && (timer = null)

        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delayTime)
    }
}
// 窗口的滚动距离
const useWindowScroll = () => {
    const top = ref(0)
    window.addEventListener('scroll', () => {
        const scrollTop: any = document.documentElement.scrollTop
            ? document.documentElement.scrollTop
            : document.body.scrollTop
        top.value = scrollTop
    })
    return { top }
}

/**
 * 处理await成功失败信息
 * 参考：https://juejin.cn/post/6844903767129718791
 * @param {*} promise
 */

function awaitWrap<T, U = any>(promise: Promise<T>): Promise<[U | null, T | null]> {
    return promise.then<[null, T]>((data: T) => [null, data]).catch<[U, null]>((err) => [err, null])
}

/**
 * 用来获取url中的某个参数
 * @param paramName
 * @returns
 */
const getQueryParamByKey = (paramName: string) => {
    let url = document.location.toString()
    // 如果url中有特殊字符则需要进行一下解码
    url = decodeURI(url)
    const arrObj = url.split('?')
    if (arrObj.length > 1) {
        const arrPara = arrObj[1].split('&')
        let arr
        for (let i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split('=')
            if (arr != null && arr[0] == paramName) {
                return decodeURIComponent(arr[1])
            }
        }
        return ''
    } else {
        return ''
    }
}

/*
 * 用来获取url中的所有参数
 * let url = 'http://192.168.1.122:9020/?appId=wxf4b72971eacba4d6&loginScene=1#/'
 */
const getQueryParams = <T extends {}>(url = document.location.toString()) => {
    // let url =
    // 如果url中有特殊字符则需要进行一下解码
    url = decodeURI(url)
    const arr1 = url.split('?')
    const obj: any = {}
    if (arr1.length > 1) {
        const index = arr1[1].indexOf('#')
        arr1[1] = index == -1 ? arr1[1] : arr1[1].slice(0, index)
        const arr2 = arr1[1].split('&')
        for (let i = 0; i < arr2.length; i++) {
            const curArr: string[] = arr2[i].split('=')
            obj[curArr[0]] = decodeURIComponent(curArr[1])
        }
    }
    return obj as { [key: string]: T }
}

/**
 * 判断是安卓还是iOS
 */
const phoneModel = () => {
    const u = navigator.userAgent
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 //android终端或者uc浏览器
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
    if (isAndroid) return 'android'
    if (isiOS) return 'ios'
}
/**
 * 判断是否是微信浏览器
 */
const isWeChat = () => {
    //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    const ua = navigator.userAgent
    //通过正则表达式匹配ua中是否含有MicroMessenger字符串
    return !!ua.match(/MicroMessenger/i)
}

const formartTimeToHMS = (val: any) => {
    let hour = parseInt((val / 3600).toString())
    let min = parseInt(((val - hour * 3600) / 60).toString())
    let sec = val - hour * 3600 - min * 60
    let str = ''
    if (hour > 0) {
        str = (hour >= 10 ? hour : '0' + hour) + ':'
    }
    str += (min >= 10 ? min : '0' + min) + ':'
    str += sec >= 10 ? sec : '0' + sec
    return str
}

/**
 * 懒加载函数
 * @param {domObject}  oImages img标签的dom集合
 * @param {domObject} containnerEl 滚动的容器，默认为document.documentElement
 * @return {Function} 返回懒加载函数
 */
const imgLazyload = (
    oImages: HTMLCollection,
    containerEl: HTMLElement = document.documentElement
) => {
    const LEN: number = oImages.length
    let index: number = 0 // 计算已经加载了的图片数量

    // 如果容器不是document，则给容器加上相对定位，用于获取图片到容器顶部的距离
    if (containerEl !== document.documentElement) {
        containerEl.style.position = 'relative'
    }

    return () => {
        const viewHeight: number = containerEl.clientHeight, // 容器的视口高度
            scrollTop: number = containerEl.scrollTop // 滚动条距离容器顶部的高度

        for (let i = index; i < LEN; i++) {
            const imgItem = oImages[i] as HTMLImageElement

            // 如果图片距离容器顶部的高度小于容器的视口高度与滚动条滚动的距离， 就把图片的地址赋值给src属性，同时index+1
            if (imgItem.offsetTop < viewHeight + scrollTop) {
                imgItem.src = imgItem.dataset.src as string
                index++
            }
        }
    }
}

// base64转换成file
const baseToFile = (files: any, filename: string) => {
    let arr = files.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
}

// 获取assets静态资源
const getAssetsFile = (url: string) => {
    const path = `../assets/images/${url}`
    const modules = import.meta.globEager('../assets/images/*')
    return modules[path] ? modules[path].default : ''
}

const DPR = () => {
    if (window.devicePixelRatio && window.devicePixelRatio > 1) {
        return window.devicePixelRatio
    }
    return 1
}

/**
 * base64转blob
 * @param {String} code base64个数数据
 * @return {undefined}
 * @author xxx
 */
const base64ToBlob = (code: any) => {
    let parts = code.split(';base64,')
    let contentType = parts[0].split(':')[1]
    let raw = window.atob(parts[1])
    let rawLength = raw.length
    let uInt8Array = new Uint8Array(rawLength)
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
    }
    return new window.Blob([uInt8Array], {
        type: contentType,
        name: 'file_' + new Date().getTime() + '.jpg'
    } as any)
}

const dataURLtoFile = (dataurl: string, filename: string) => {
    // 获取到base64编码
    const arr: [] | any = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    // 将base64编码转为字符串
    const bstr = window.atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n) // 创建初始化为0的，包含length个元素的无符号整型数组
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, {
        type: mime
    })
}

const formatDate = (date: number | Date | string, type: string = 'YYYY-MM-DD'): string => {
    if (!date) return ''
    return dayjs(date).format(type)
}

export {
    deepClone,
    debounce,
    useWindowScroll,
    awaitWrap,
    getQueryParamByKey,
    getQueryParams,
    phoneModel,
    isWeChat,
    imgLazyload,
    baseToFile,
    getAssetsFile,
    DPR,
    base64ToBlob,
    dataURLtoFile,
    formatDate
}
