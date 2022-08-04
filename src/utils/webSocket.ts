interface Ioptions {
    // authorization
    authorization?: string
    // 发送心跳间隔时间
    heartTime?: number
    //检查链接状态时间
    checkTime?: number
    //断线后重连间隔时间
    lockTime?: number
}

const createSocket = (url: string, callback: (e: any) => void) => {
    class Ws {
        private url: string = url //socket 地址
        private callback: (e: any) => void = callback
        private heartTime: number = 3000 //心跳时间
        private checkTime: number = 3000 //检查链接状态时间
        private lockTime: number = 4000 //重连时间
        public ws: WebSocket | undefined //socket实例
        private hTimer: number | null = null //心跳定时器
        private cTimer: number | null = null //检查链接定时器
        private lTimer: number | null = null //重连定时器
        private isLock: boolean = false //重连锁
        private authorization: string | undefined //token

        public init(options: Ioptions = {}): void {
            let { authorization, heartTime, checkTime, lockTime } = options

            if (authorization) {
                this.authorization = authorization
            }

            if (heartTime) {
                this.heartTime = heartTime
            }

            if (checkTime) {
                this.checkTime = checkTime
            }

            if (lockTime) {
                this.lockTime = lockTime
            }

            if (this.url == '') {
                throw new Error('socket链接地址不能为空')
            }
            this.wsInit()
        }

        // 处理有token时的socket链接地址
        private getUrl(): string {
            if (this.authorization !== undefined) {
                return `${this.url}?authorization=${this.authorization}`
            } else {
                return `${this.url}`
            }
        }

        // 初始化socket
        public wsInit(): void {
            let ws = new WebSocket(this.getUrl())

            ws.onopen = () => {
                console.log(`连接成功`)
                const content = JSON.stringify({ type: 1000, data: '哎呦连接成功，不错哦！' })
                ws.send(content)
                this.heartCheck()
            }

            ws.onclose = () => {
                console.log(`连接关闭`)
                this.reconnect()
            }

            ws.onerror = () => {
                this.reconnect()
            }

            ws.onmessage = (e) => {
                this.heartCheck()
                this.callback(e)
            }

            this.ws = ws
        }

        // 心跳
        private heartCheck(): void {
            this.hTimer && clearTimeout(this.hTimer)
            this.cTimer && clearTimeout(this.cTimer)
            this.hTimer = setTimeout(() => {
                ;(this.ws as WebSocket).send(JSON.stringify({ type: 1000, data: 'HeartBeat' }))
                this.cTimer = setTimeout(() => {
                    if ((this.ws as WebSocket).readyState !== 1) {
                        ;(this.ws as WebSocket).close()
                    }
                }, this.checkTime)
            }, this.heartTime)
        }

        // 重连
        private reconnect(): void {
            if (this.isLock) {
                return
            }
            this.isLock = true
            this.lTimer && clearTimeout(this.lTimer)
            this.lTimer = setTimeout(() => {
                this.wsInit()
                this.isLock = false
            }, this.lockTime)
        }
    }
    return new Ws()
}

export { createSocket }
