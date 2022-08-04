export enum WsStatus {
    CONNECTING,
    OPEN,
    CLOSING,
    CLOSED
}
interface Ioptions {
    url: string
    authorization: string
    pingMsg: any
    messageCallback: Function
}
export default class Socket {
    // 服务地址
    private url: string
    // token
    private authorization: string | undefined
    // websocket实例
    private ws: WebSocket
    // 心跳信息
    private pingMsg: any
    // 心跳定时器
    private heartBeatTimer: number | null = null
    // 心跳连接时间
    private heartTime: number = 3 * 1000
    // 服务器超时定时器
    private serverTimer: number | null = null
    // 检查链接状态时间
    private checkTime: number = 3 * 1000
    // socket接收消息的回调函数
    private messageCallback: Function
    // 最大重连次数
    private reconnectLimit: number = 15
    // 标识是否正在重连
    private isInReconnect: boolean = false
    // 手动关闭ws
    private needDestroy: boolean = false
    // 重连次数
    private reconnectCount: number = 0
    // 重连定时器
    private reconnectTimer: number | null = null

    constructor({ url, authorization, pingMsg, messageCallback }: Ioptions) {
        this.url = url
        this.authorization = authorization
        this.pingMsg = pingMsg
        this.messageCallback = messageCallback
        this.ws = this.createWs() as WebSocket
    }

    // 处理有token时的socket链接地址
    private getUrl(): string {
        if (this.authorization !== undefined) {
            return `${this.url}?authorization=${encodeURIComponent(this.authorization)}`
        } else {
            return `${this.url}`
        }
    }
    // 初始化websocket
    private createWs(): WebSocket | undefined {
        try {
            const ws = (this.ws = new WebSocket(this.getUrl()))
            this.initEventMonitor()
            return ws
        } catch (error) {
            console.error('WebSocket创建连接失败')
            throw error
        }
    }
    // 初始化ws事件监听
    private initEventMonitor(): void {
        this.onOpen()
        this.onMessage()
        this.onClose()
        this.onError()
    }
    // 建立连接
    private onOpen(): void {
        this.ws.onopen = (e) => {
            this.resetReconnectCount()
            this.resetHeartBeat()
            this.startHeartBeat()
            console.log(`连接成功`)
            this.sendMsg({ code: 1000, msg: '建立连接成功，不错哦！' })
        }
    }
    // 接收数据
    private onMessage(): void {
        this.ws.onmessage = (e) => {
            // this.ws.onmessage && typeof this.ws.onmessage === 'function' && this.ws.onmessage(e)
            this.resetHeartBeat()
            this.startHeartBeat()
            if (this.messageCallback && e.data) {
                this.messageCallback(e.data)
            }
        }
    }
    // 关闭处理
    private onClose(): void {
        this.ws.onclose = (e) => {
            console.error('WebSocket连接关闭，状态码：' + e.code)
            this.resetHeartBeat()
            this.reconnect()
        }
    }
    // 错误处理
    private onError(): void {
        this.ws.onerror = (e) => {
            this.resetHeartBeat()
            this.reconnect()
        }
    }
    // 重连机制(3000-5000之间，设置延迟避免请求过多)
    private reconnect(): void {
        if (this.isInReconnect || this.needDestroy || this.reconnectCount > this.reconnectLimit) {
            return
        }
        this.isInReconnect = true
        this.reconnectTimer && clearTimeout(this.reconnectTimer)
        this.reconnectTimer = setTimeout(() => {
            this.createWs()
            this.reconnectCount++
            this.isInReconnect = false
        }, Number(Math.random() * 2000 + 3000))
    }
    // 重置重连次数
    private resetReconnectCount(): void {
        this.reconnectCount = 0
    }
    // 开始心跳
    private startHeartBeat(): void {
        this.heartBeatTimer = setTimeout(() => {
            this.sendMsg(this.pingMsg)
            this.serverTimer = setTimeout(() => {
                if (this.ws.readyState !== WsStatus.OPEN) {
                    this.ws.close()
                }
            }, this.checkTime)
        }, this.heartTime)
    }
    // 重置心跳
    private resetHeartBeat(): void {
        this.heartBeatTimer && clearTimeout(this.heartBeatTimer)
        this.serverTimer && clearTimeout(this.serverTimer)
    }
    // 销毁 ws
    public destroyed(): void {
        this.needDestroy = true
        this.resetHeartBeat()
        this.ws && this.ws.close()
    }
    // 手动开始
    public handleStart(): void {
        this.needDestroy = false
        this.reconnect()
    }
    // 发送业务数据
    public sendMsg(data: any): void {
        if (this.ws.readyState === WsStatus.OPEN) {
            this.ws.send(JSON.stringify(data))
        } else if (this.ws.readyState === WsStatus.CONNECTING) {
            setTimeout(() => {
                this.ws.send(JSON.stringify(data))
            }, 1000)
        } else if (
            this.ws.readyState === WsStatus.CLOSED ||
            this.ws.readyState === WsStatus.CLOSING
        ) {
            return
        }
    }
}
