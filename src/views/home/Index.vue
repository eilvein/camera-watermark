<template>
    <div class="home-container">
        <!-- <header> <h2>AI照片水印生产</h2></header> -->
        <div class="photo-main">
            <div :class="['photo-box', `box-${theme}`]" ref="photoRef">
                <div class="photo-upload">
                    <div class="upload-photo" @click="handleUpload" v-if="!imgUrl">
                        <nut-icon name="photograph" size="38"></nut-icon>
                    </div>
                    <div class="preview-photo" v-else>
                        <img :src="imgUrl" />
                        <a
                            class="upload-close"
                            href="javascript:void(0);"
                            data-html2canvas-ignore="true"
                        >
                            <nut-icon @click="handleDelete" name="close"></nut-icon>
                        </a>
                    </div>
                    <input
                        type="file"
                        ref="uploadRef"
                        name="uploadImg"
                        style="display: none"
                        accept="image/*"
                        @change="uploadImgChange"
                    />
                </div>
                <!-- <div ref="imageRef">
                    <img src="" alt="" />
                </div> -->
                <div class="watermart-preview">
                    <template v-if="style === 'default'">
                        <div class="phone-info">
                            <h4>
                                {{ tags.Make.toUpperCase() }}
                            </h4>
                            <p>{{ tags.Author }}</p>
                        </div>
                        <dl>
                            <dt class="photo-logo">
                                <img
                                    :src="
                                        readAssetsFile(currLogo.src) || readAssetsFile(currType.src)
                                    "
                                />
                            </dt>
                            <dd class="photo-info">
                                <h4
                                    >{{ `${tags.FocalLength || 120}mm `
                                    }}{{ `f/${tags.FNumber || 4.1}` }}
                                    {{
                                        `1/${
                                            Math.round(Math.pow(2, tags.ShutterSpeedValue)) || 100
                                        }`
                                    }}
                                    {{ `ISO${tags.ISOSpeedRatings || 90}` }}</h4
                                >
                                <p>
                                    {{
                                        formatImgDate(tags.DateTimeOriginal) ||
                                        formatDate(new Date().getTime(), 'YYYY.MM.DD HH:mm:ss')
                                    }}
                                </p>
                            </dd>
                        </dl>
                    </template>
                    <dl v-else class="photo-center">
                        <dt class="photo-logo">
                            <img
                                :src="readAssetsFile(currLogo.src) || readAssetsFile(currType.src)"
                            />
                        </dt>
                        <dd class="photo-info">
                            <h4>
                                {{ tags.Make.toUpperCase() }} {{ `${tags.FocalLength || 120}mm `
                                }}{{ `f/${tags.FNumber || 4.1}` }}
                                {{ `1/${Math.round(Math.pow(2, tags.ShutterSpeedValue)) || 100}` }}
                                {{ `ISO${tags.ISOSpeedRatings || 90}` }}
                            </h4>
                            <p>
                                {{
                                    formatImgDate(tags.DateTimeOriginal) ||
                                    formatDate(new Date().getTime(), 'YYYY.MM.DD HH:mm:ss')
                                }}
                                {{ tags.Author }}</p
                            >
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
        <footer>
            <ul>
                <!-- <li @click="handlerRefreshUpload"><nut-icon name="refresh"></nut-icon>上传</li> -->
                <li @click="handlerOpenSetting"> <nut-icon name="setting"></nut-icon>配置</li>
                <li> <nut-icon name="photograph"></nut-icon>滤镜</li>

                <li @click="warningNotify('仅供学习参考，如有侵权请联系删除。')">
                    <nut-icon name="tips"></nut-icon>声明</li
                >
                <li @click="handlerBuildImg"> <nut-icon name="download"></nut-icon>生成</li>
            </ul>
        </footer>
        <nut-popup position="top" :style="{ height: '100%' }" v-model:visible="settingVisible">
            <nut-cell-group title="水印设置" desc="请选择自己喜欢风格配置">
                <nut-cell>
                    <span class="cell-title"><label>色彩主题：</label></span>
                    <div class="cell-content">
                        <nut-radiogroup v-model="theme" direction="horizontal">
                            <nut-radio icon-size="12" label="white">白色</nut-radio>
                            <nut-radio icon-size="12" label="black">黑色</nut-radio>
                        </nut-radiogroup>
                    </div>
                </nut-cell>
                <nut-cell @click="typeActionSheet">
                    <span class="cell-title"><label>手机类型：</label></span>
                    <div class="cell-content">
                        <img class="type-img" :src="readAssetsFile(currType.src)" />
                        {{ currType.name }}
                    </div>
                </nut-cell>
                <nut-cell>
                    <span class="cell-title"><label>自定义手机型号：</label></span>
                    <div class="cell-content">
                        <input
                            class="cell-input"
                            placeholder="请输入手机型号"
                            v-model="tags.Make"
                        />
                    </div>
                </nut-cell>
                <nut-cell @click="logoActionSheet">
                    <span class="cell-title"><label>影像图标：</label></span>
                    <div class="cell-content">
                        <img class="type-img" :src="readAssetsFile(currLogo.src)" />
                        {{ currLogo.name }}
                    </div>
                </nut-cell>
                <nut-cell>
                    <span class="cell-title"><label>清晰度：</label></span>
                    <div class="cell-content">
                        <nut-radiogroup v-model="high" direction="horizontal">
                            <nut-radio icon-size="12" :label="0">默认</nut-radio>
                            <nut-radio icon-size="12" :label="1">香</nut-radio>
                            <nut-radio icon-size="12" :label="2">更香</nut-radio>
                            <nut-radio icon-size="12" :label="3">浓香</nut-radio>
                        </nut-radiogroup>
                    </div>
                </nut-cell>
                <nut-cell>
                    <span class="cell-title"><label>居中：</label></span>
                    <div class="cell-content">
                        <nut-radiogroup v-model="style" direction="horizontal">
                            <nut-radio icon-size="12" label="default">默认</nut-radio>
                            <nut-radio icon-size="12" label="center">居中</nut-radio>
                        </nut-radiogroup>
                    </div>
                </nut-cell>
                <nut-cell>
                    <span class="cell-title"><label>摄影师：</label></span>
                    <div class="cell-content">
                        <input
                            class="cell-input"
                            placeholder="请输入摄影师"
                            v-model="tags.Author"
                        />
                    </div>
                </nut-cell>
                <nut-cell class="cell-center">
                    <nut-button
                        type="default"
                        size="small"
                        @click="settingVisible = !settingVisible"
                        >取消</nut-button
                    >
                    <nut-button type="success" size="small" @click="handlesSaveSetting"
                        >保存设置</nut-button
                    >
                </nut-cell>
            </nut-cell-group>
        </nut-popup>
        <nut-popup position="bottom" :style="{ height: '90%' }" v-model:visible="showTop" closeable>
            <div class="watermark-img">
                <h3>长按保存照片</h3>
                <img :src="watermarkImg" />
            </div>
        </nut-popup>
        <nut-actionsheet
            v-model:visible="typeVisible"
            :menu-items="typeItems"
            cancel-txt="取消"
            @choose="chooseType"
        >
        </nut-actionsheet>
        <nut-actionsheet
            v-model:visible="logoVisible"
            :menu-items="logoItems"
            cancel-txt="取消"
            @choose="chooseLogo"
        >
        </nut-actionsheet>
    </div>
</template>
<script lang="ts">
    import EXIF from 'exif-js'
    import html2canvas from 'html2canvas'
    import { defineComponent, reactive, getCurrentInstance, ref, toRefs, onMounted } from 'vue'
    import { getAssetsFile, DPR, formatDate } from '@/utils/tools'

    export default defineComponent({
        name: 'Home',
        setup: () => {
            const { proxy }: any = getCurrentInstance()
            const uploadRef = ref<any>(null)
            const photoRef = ref<any>(null)
            const imageRef = ref<any>(null)
            const isExif = ref(-1)
            const state = reactive({
                settingVisible: false,
                typeVisible: false,
                logoVisible: false,
                showTop: false,
                logoValue: 'leica',
                theme: 'white',
                currType: {
                    name: '小米',
                    value: 'XIAOMI',
                    src: 'xiaomi.png'
                } as any,
                currLogo: {
                    name: 'leica',
                    src: 'leica.png'
                } as any,
                currFile: {} as any,
                imgUrl: '',
                watermarkImg: '',
                high: 0,
                style: 'default',
                tags: {
                    Make: 'XIAOMI 12S ULTRA',
                    Author: ''
                } as any
            })
            const typeItems = [
                {
                    name: '小米',
                    value: 'XIAOMI 12S ULTRA',
                    src: 'xiaomi.png'
                },
                {
                    name: '华为',
                    value: 'HUAWEI P50',
                    src: 'huawei.png'
                },
                {
                    name: 'Oppo',
                    value: 'OPPO FINF X5 PRO',
                    src: 'oppo.png'
                },
                {
                    name: 'Vivo',
                    value: 'VIVO X80 PRO',
                    src: 'vivo.png'
                },
                {
                    name: '魅族',
                    value: 'MEIZU 18S PRO',
                    src: 'meizu.png'
                },
                {
                    name: '真我',
                    value: 'REALME GT2',
                    src: 'realme.png'
                },
                {
                    name: '苹果',
                    value: 'IPHONE 13 PRO MAX',
                    src: 'apple.png'
                },
                {
                    name: '三星',
                    value: 'Galaxy S22 Ultra',
                    src: 'samsung.png'
                },
                {
                    name: '索尼',
                    value: 'SONY Xperia 1 IV',
                    src: 'sony.png'
                }
            ]
            const logoItems = [
                {
                    name: '徕卡',
                    value: 'leica',
                    src: 'leica.png'
                },
                {
                    name: '蔡司',
                    value: 'zeiss',
                    src: 'zeiss.png'
                },
                {
                    name: '哈苏',
                    value: 'hasselblad',
                    src: 'hasselblad.png'
                },
                {
                    name: '尼康',
                    value: 'nikon',
                    src: 'nikon.png'
                },
                {
                    name: '佳能',
                    value: 'canan',
                    src: 'canan.png'
                },
                {
                    name: '无选择',
                    value: 'no',
                    src: ''
                }
            ]
            const typeActionSheet = (param: boolean) => {
                state.typeVisible = !state.typeVisible
            }
            const logoActionSheet = (param: boolean) => {
                state.logoVisible = !state.logoVisible
            }
            const chooseType = (item: any) => {
                state.tags.Make = item.value
                state.currType = item
            }
            const chooseLogo = (item: any) => {
                state.logoValue = item.value
                state.currLogo = item
            }
            const warningNotify = (msg: string) => {
                proxy.$notify.warn(msg)
            }
            const readAssetsFile = (v: string) => {
                return getAssetsFile(v)
            }
            const handlerOpenSetting = () => {
                state.settingVisible = true
            }
            const handlesSaveSetting = () => {
                state.settingVisible = false
            }
            const handleDelete = () => {
                state.imgUrl = ''
                uploadRef.value.value = ''
                state.tags.Make = 'XIAOMI 12S ULTRA'
                state.tags.ISOSpeedRatings = 0
                state.tags.FNumber = 0
                state.tags.FocalLength = 0
                state.tags.DateTimeOriginal = null
                state.tags.ShutterSpeedValue = 0
            }
            const handleUpload = () => {
                uploadRef.value.click()
            }
            const uploadImgChange = (e: any) => {
                const file = e.target.files[0]
                state.currFile = file
                const reader = new FileReader()
                reader.onload = (e: any) => {
                    let data
                    if (typeof e.target.result === 'object') {
                        data = window.URL.createObjectURL(new Blob([e.target.result]))
                    } else {
                        data = e.target.result
                    }
                    state.imgUrl = data
                }
                if (file) {
                    reader.readAsArrayBuffer(file)
                }
                readFile(file)
            }
            // 取图片信息
            const readFile = (file: any) => {
                EXIF.getData(file, function () {
                    const allTas = EXIF.getAllTags(file)
                    console.log(allTas)
                    state.tags.Make = allTas.Make || state.tags.Make
                    state.tags.ISOSpeedRatings = allTas.ISOSpeedRatings
                    state.tags.FNumber = allTas.FNumber
                    state.tags.FocalLength = allTas.FocalLength
                    state.tags.DateTimeOriginal = allTas.DateTimeOriginal
                    state.tags.ShutterSpeedValue = allTas.ShutterSpeedValue
                })
            }
            // 生成海报
            const handlerBuildImg = () => {
                if (state.imgUrl === '') {
                    warningNotify('请选择上传照片！')
                    return
                }
                let el = photoRef.value
                let width = el.offsetWidth
                let height = el.offsetHeight
                let scale = DPR() + Number(state.high)
                let canvas = document.createElement('canvas') as any
                const img = new Image()
                img.src = state.imgUrl
                img.onload = () => {
                    const imgScale = img.width / img.height
                    console.log(img.width)
                    console.log(img.height)
                    console.log(imgScale)
                }
                canvas.width = Math.floor(width * scale)
                canvas.height = Math.floor(height * scale)
                canvas.style.width = Math.floor(width * scale) + 'px'
                canvas.style.height = Math.floor(height * scale) + 'px'
                let context = canvas.getContext('2d')
                context.mozImageSmoothingEnabled = false
                context.webkitImageSmoothingEnabled = false
                context.msImageSmoothingEnabled = false
                context.imageSmoothingEnabled = false
                context.strokeRect(0, 0, Math.floor(width * scale), Math.floor(height * scale))
                let opts = {
                    scale: scale,
                    canvas: canvas,
                    useCORS: true,
                    dpi: 300
                }
                state.showTop = true
                html2canvas(el, opts).then((canvas) => {
                    state.watermarkImg = canvas.toDataURL()
                })
            }
            const handlerRefreshUpload = () => {
                uploadRef.value.clearUploadQueue()
            }
            const decodeUnicode = (str: string) => {
                str = str.replace(/\\/g, '%')
                return unescape(str)
            }

            const formatImgDate = (v: string) => {
                if (!v) {
                    return
                }
                let date: any = v.split(' ')
                date = date.map((item: string, index: number) => {
                    if (index === 0) {
                        item = item.replace(/:/g, '.')
                    }
                    return item
                })
                return date.join(' ')
            }

            onMounted(() => {})

            return {
                ...toRefs(state),
                typeItems,
                uploadRef,
                photoRef,
                imageRef,
                logoItems,
                warningNotify,
                chooseType,
                chooseLogo,
                typeActionSheet,
                logoActionSheet,
                readAssetsFile,
                handlesSaveSetting,
                handlerOpenSetting,
                uploadImgChange,
                handlerBuildImg,
                handlerRefreshUpload,
                formatImgDate,
                formatDate,
                handleUpload,
                handleDelete
            }
        }
    })
</script>
<style lang="scss">
    .home-container {
        color: $txt-default;
        height: 100vh;
        width: 100vw;
        @include font-size(28);
        display: flex;
        flex-direction: column;
    }
    header {
        background-color: #fff;
        padding: px2rem(30) 0;
        h2 {
            height: px2rem(32);
            line-height: px2rem(32);
            @include font-size(32);
            text-align: center;
            color: #666;
        }
    }
    footer {
        background-color: #fff;
        padding: px2rem(30) 0;
        & > ul {
            display: flex;
            justify-content: space-around;
            li {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                @include font-size(24);
                opacity: 0.8;
                .nut-icon {
                    margin-bottom: px2rem(5);
                }
            }
        }
    }
    .photo-main {
        width: 100vw;
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
    }
    .upload-photo {
        position: relative;
        background: #f7f8fa;
        width: 100%;
        height: px2rem(500);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .preview-photo {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .upload-close {
            width: px2rem(50);
            height: px2rem(50);
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fff;
            border-radius: 100%;
            position: absolute;
            top: px2rem(-20);
            right: px2rem(5);
        }
    }
    .photo-box {
        width: 100%;
        background-color: #fff;
        min-height: px2rem(300);
        &.box-black {
            background-color: #000;
            color: #fff;
            .upload-photo {
                background-color: #ccc;
            }
            .watermart-preview {
                .phone-info {
                    p {
                        opacity: 0.8;
                    }
                }
                dl {
                    dd {
                        p {
                            opacity: 0.8;
                        }
                    }
                }
            }
        }
    }
    .watermart-preview {
        display: flex;
        padding: px2rem(25) px2rem(20);
        justify-content: space-between;
        .phone-info {
            h4 {
                @include font-size(22);
                font-weight: 500;
                margin-bottom: px2rem(10);
            }
            p {
                @include font-size(20);
                opacity: 0.4;
            }
        }
        dl {
            display: flex;
            justify-content: center;
            align-items: center;
            &.photo-center {
                width: 100%;
            }
            dt {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                img {
                    width: px2rem(40);
                }
                padding-right: px2rem(13);
                margin-right: px2rem(13);
                position: relative;
                &::after {
                    width: 1px;
                    height: px2rem(38);
                    background-color: rgb(197, 194, 194);
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
            dd {
                text-align: left;
                h4 {
                    @include font-size(22);
                    font-weight: 500;
                    margin-bottom: px2rem(7);
                }
                p {
                    width: 100%;
                    @include font-size(20);
                    opacity: 0.5;
                }
            }
        }
    }
    .watermark-img {
        height: 100%;
        background-color: #fbfbfb;
        h3 {
            @include font-size(28);
            padding: px2rem(18);
            color: #666;
            background-color: #f1f1f1;
            text-align: center;
            margin-bottom: px2rem(10);
        }
        img {
            box-shadow: 0 px2rem(4) px2rem(30) rgba(0, 0, 0, 0.1);
        }
    }
    .cell-title {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin-right: px2rem(30);
    }
    .cell-content {
        display: flex;
        flex: 1;
        justify-content: flex-end;
        align-items: center;
        padding-right: px2rem(20);
        .type-img {
            width: px2rem(44);
            margin-right: px2rem(20);
        }
    }
    .cell-center {
        justify-content: center;
        align-items: center;
        .nut-button {
            margin: 0 px2rem(30);
        }
    }
    .cell-input {
        width: 100%;
        padding: px2rem(10) 0;
        text-align: right;
    }
    .nutui-popup {
        &__close-icon--top-right {
            top: 0;
            right: px2rem(10);
        }
    }
</style>
