import wx, { ChooseWXPayOptions, JSApis, ShareOptions } from 'weixin-js-sdk'
import store from '@/store'
import { getCurrentInstance } from 'vue'
import { config } from '@/config/index'
import { wechatJssdk } from '@/api/wxController'

const apiList: JSApis[] = [
    'updateAppMessageShareData',
    'updateTimelineShareData',
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'scanQRCode',
    'chooseImage',
    'previewImage'
]
let $wx = null

export const useWxJsSdk = (jsApiList = apiList, url = store.getters.initLink) => {
    const { proxy }: any = getCurrentInstance()
    return new Promise(async (resolve, reject) => {
        try {
            let res = await wechatJssdk({ url: decodeURIComponent(url) })
            if (res.result !== 0) return
            wx.config({
                debug: false,
                signature: res.data.signature,
                nonceStr: res.data.nonceStr,
                timestamp: res.data.timestamp,
                appId: res.data.appId,
                jsApiList
            })
            wx.ready(() => {
                console.log('JSSDK我已签名')
                $wx = wx
                resolve(wx)
            })
            wx.error((wxerr) => {
                console.log(wxerr)
                if (['production', 'prod'].includes(config.env)) {
                    proxy.$toast.text(config.env + JSON.stringify(wxerr))
                } else {
                    proxy.$toast.text(config.env + JSON.stringify(wxerr))
                }
                throw wxerr
            })
        } catch (error) {
            console.log('useWxJsSdkError', error)
            proxy.$toast.fail(error || '获取jssdk配置失败')
            reject(error)
        }
    })
}

/**
 * 获取地理位置
 * @param {*} wx
 */
export const getLocation = () => {
    return new Promise((resolve, reject) => {
        wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: (res) => {
                let latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
                let longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
                resolve(res)
            },
            fail: (err) => {
                console.log(err)
                reject(err)
            }
        })
    })
}

/**
 * 微信分享
 * @param {*} wx
 * @param {*} shareInfo 分享参数
 */
export const shareConfig = (shareInfo: ShareOptions) => {
    wx.onMenuShareAppMessage(shareInfo)
    wx.onMenuShareTimeline(shareInfo)
    wx.updateAppMessageShareData(shareInfo)
    wx.updateTimelineShareData({
        ...shareInfo,
        success: () => {
            //设置成功
            console.log('updateTimelineShareData分享设置成功')
        }
    })
}

/**
 * 微信支付
 * @param {*} wx
 * @param {*} otpions
 */
export const wxPay = (otpions: any) => {
    let { nonceStr, packageValue, paySign, signType, timeStamp } = otpions
    return new Promise((resolve, reject) => {
        wx.chooseWXPay({
            timestamp: timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
            package: packageValue, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: paySign, // 支付签名
            success: function (res) {
                resolve(res)
            },
            // 支付取消回调函数
            cancel: function (res) {
                resolve(res)
            },
            fail: function (err) {
                reject(err)
            }
        })
    })
}

/**
 * 微信扫码
 * @param {*} wx
 * @param {*} otpions
 */
export const wxScanQRCode = (needResult: boolean) => {
    return new Promise((resolve, reject) => {
        wx.scanQRCode({
            needResult: needResult ? 1 : 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                let result: string = needResult ? res.resultStr : res // 当needResult 为 1 时，扫码返回的结果
                resolve(result)
            },
            fail: function (err) {
                reject(err)
            }
        })
    })
}

/**
 * 拍照或从手机相册中选图接口
 * @param {*} wx
 * @param {*} otpions
 */
export const wxChooseImage = (otpions?: any) => {
    return new Promise((resolve, reject) => {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                let localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                resolve(localIds)
            },
            fail: function (err) {
                reject(err)
            }
        })
    })
}

export const wxGetLocalImgData = (id: string) => {
    return new Promise((resolve, reject) => {
        wx.getLocalImgData({
            localId: id,
            success: function (res) {
                let localData = res.localData
                resolve(localData)
            },
            fail: function (err) {
                reject(err)
            }
        })
    })
}
