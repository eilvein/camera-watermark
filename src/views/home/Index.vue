<template>
    <div class="home-container">
        <div class="photo-main">
            <div :class="['photo-box', `box-${theme}`]" ref="photoRef">
                <div class="photo-upload">
                    <div class="upload-photo" @click="handleUpload" v-if="!imgUrl">
                        <nut-icon name="photograph" size="38"></nut-icon>
                    </div>
                    <div class="preview-photo" v-else>
                        <img :class="currFilter" :src="imgUrl" />
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
                <!-- <li @click="handlerRefreshUpload"><nut-icon name="refresh"></nut-icon>??????</li> -->
                <li @click="handlerOpenSetting"> <nut-icon name="setting"></nut-icon>??????</li>
                <li @click="handleOpenFilters"> <nut-icon name="photograph"></nut-icon>??????</li>

                <li @click="warningNotify('???????????????????????????????????????????????????')">
                    <nut-icon name="tips"></nut-icon>??????</li
                >
                <li @click="handlerBuildImg"> <nut-icon name="download"></nut-icon>??????</li>
            </ul>
        </footer>
        <nut-popup
            position="bottom"
            :style="{ height: '25%' }"
            v-model:visible="filterVisible"
            :overlay="false"
            closeable
            style="background-color: #f1f1f1"
        >
            <a @click="handleCancelFliter" class="filter-del" href="javascript:void(0)"
                ><nut-icon name="del" color="#969799"></nut-icon
            ></a>
            <div class="filters-box">
                <ul>
                    <li
                        v-for="(item, index) in filtersList"
                        :key="index"
                        @click="handleCheckedFilter(item.value, index)"
                        :class="{ 'active-filter': currFilterIdx === index }"
                    >
                        <img :class="item.value" src="@/assets/images/filters_demo.jpg" />
                        <p>{{ item.name }}</p>
                    </li>
                </ul>
            </div>
        </nut-popup>
        <nut-popup position="top" :style="{ height: '100%' }" v-model:visible="settingVisible">
            <nut-cell-group title="????????????" desc="?????????????????????????????????">
                <nut-cell>
                    <span class="cell-title"><label>???????????????</label></span>
                    <div class="cell-content">
                        <nut-radiogroup v-model="theme" direction="horizontal">
                            <nut-radio icon-size="12" label="white">??????</nut-radio>
                            <nut-radio icon-size="12" label="black">??????</nut-radio>
                        </nut-radiogroup>
                    </div>
                </nut-cell>
                <nut-cell @click="typeActionSheet">
                    <span class="cell-title"><label>???????????????</label></span>
                    <div class="cell-content">
                        <img class="type-img" :src="readAssetsFile(currType.src)" />
                        {{ currType.name }}
                    </div>
                </nut-cell>
                <nut-cell>
                    <span class="cell-title"><label>????????????????????????</label></span>
                    <div class="cell-content">
                        <input
                            class="cell-input"
                            placeholder="?????????????????????"
                            v-model="tags.Make"
                        />
                    </div>
                </nut-cell>
                <nut-cell @click="logoActionSheet">
                    <span class="cell-title"><label>???????????????</label></span>
                    <div class="cell-content">
                        <img class="type-img" :src="readAssetsFile(currLogo.src)" />
                        {{ currLogo.name }}
                    </div>
                </nut-cell>
                <nut-cell>
                    <span class="cell-title"><label>????????????</label></span>
                    <div class="cell-content">
                        <nut-radiogroup v-model="high" direction="horizontal">
                            <nut-radio icon-size="12" :label="0">??????</nut-radio>
                            <nut-radio icon-size="12" :label="1">???</nut-radio>
                            <nut-radio icon-size="12" :label="2">??????</nut-radio>
                            <nut-radio icon-size="12" :label="3">??????</nut-radio>
                        </nut-radiogroup>
                    </div>
                </nut-cell>
                <nut-cell>
                    <span class="cell-title"><label>?????????</label></span>
                    <div class="cell-content">
                        <nut-radiogroup v-model="style" direction="horizontal">
                            <nut-radio icon-size="12" label="default">??????</nut-radio>
                            <nut-radio icon-size="12" label="center">??????</nut-radio>
                        </nut-radiogroup>
                    </div>
                </nut-cell>
                <nut-cell>
                    <span class="cell-title"><label>????????????</label></span>
                    <div class="cell-content">
                        <input
                            class="cell-input"
                            placeholder="??????????????????"
                            v-model="tags.Author"
                        />
                    </div>
                </nut-cell>
                <nut-cell class="cell-center">
                    <nut-button
                        type="default"
                        size="small"
                        @click="settingVisible = !settingVisible"
                        >??????</nut-button
                    >
                    <nut-button type="success" size="small" @click="handlesSaveSetting"
                        >????????????</nut-button
                    >
                </nut-cell>
            </nut-cell-group>
        </nut-popup>
        <nut-popup
            position="bottom"
            :style="{ height: '90%' }"
            v-model:visible="watermarkVisible"
            closeable
        >
            <div class="watermark-img">
                <h3>??????????????????</h3>
                <img :src="watermarkImg" />
            </div>
        </nut-popup>
        <nut-actionsheet
            v-model:visible="typeVisible"
            :menu-items="typeItems"
            cancel-txt="??????"
            @choose="chooseType"
        >
        </nut-actionsheet>
        <nut-actionsheet
            v-model:visible="logoVisible"
            :menu-items="logoItems"
            cancel-txt="??????"
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
    // import * as htmlToImage from 'html-to-image'

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
                filterVisible: false,
                typeVisible: false,
                logoVisible: false,
                watermarkVisible: false,
                logoValue: 'leica',
                theme: 'white',
                currType: {
                    name: '??????',
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
                } as any,
                currFilterIdx: null as any,
                currFilter: ''
            })
            const typeItems = [
                {
                    name: '??????',
                    value: 'XIAOMI 12S ULTRA',
                    src: 'xiaomi.png'
                },
                {
                    name: '??????',
                    value: 'HUAWEI P50 PRO',
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
                    name: '??????',
                    value: 'MEIZU 18S PRO',
                    src: 'meizu.png'
                },
                {
                    name: '??????',
                    value: 'REALME GT2',
                    src: 'realme.png'
                },
                {
                    name: '??????',
                    value: 'IPHONE 13 PRO MAX',
                    src: 'apple.png'
                },
                {
                    name: '??????',
                    value: 'Galaxy S22 Ultra',
                    src: 'samsung.png'
                },
                {
                    name: '??????',
                    value: 'SONY Xperia 1 IV',
                    src: 'sony.png'
                }
            ]
            const logoItems = [
                {
                    name: '??????',
                    value: 'leica',
                    src: 'leica.png'
                },
                {
                    name: '??????',
                    value: 'zeiss',
                    src: 'zeiss.png'
                },
                {
                    name: '??????',
                    value: 'hasselblad',
                    src: 'hasselblad.png'
                },
                {
                    name: '??????',
                    value: 'nikon',
                    src: 'nikon.png'
                },
                {
                    name: '??????',
                    value: 'canan',
                    src: 'canan.png'
                },
                {
                    name: '?????????',
                    value: 'no',
                    src: ''
                }
            ]
            const filtersList = [
                {
                    name: '1977',
                    value: 'filter-1977'
                },
                {
                    name: 'Aden',
                    value: 'filter-aden'
                },
                {
                    name: 'Amaro',
                    value: 'filter-amaro'
                },
                {
                    name: 'Ashby',
                    value: 'filter-ashby'
                },
                {
                    name: 'Brannan',
                    value: 'filter-brannan'
                },
                {
                    name: 'Brooklyn',
                    value: 'filter-brooklyn'
                },
                {
                    name: 'Charmes',
                    value: 'filter-charmes'
                },
                {
                    name: 'Clarendon',
                    value: 'filter-clarendon'
                },
                {
                    name: 'Crema',
                    value: 'filter-crema'
                },
                {
                    name: 'Dogpatch',
                    value: 'filter-dogpatch'
                },
                {
                    name: 'Earlybird',
                    value: 'filter-earlybird'
                },
                {
                    name: 'Gingham',
                    value: 'filter-gingham'
                },
                {
                    name: 'Ginza',
                    value: 'filter-ginza'
                },
                {
                    name: 'Hefe',
                    value: 'filter-hefe'
                },
                {
                    name: 'Helena',
                    value: 'filter-helena'
                },
                {
                    name: 'Hudson',
                    value: 'filter-hudson'
                },
                {
                    name: 'Inkwell',
                    value: 'filter-inkwell'
                },
                {
                    name: 'Kelvin',
                    value: 'filter-kelvin'
                },
                {
                    name: 'Kuno',
                    value: 'filter-kuno'
                },
                {
                    name: 'Lark',
                    value: 'filter-lark'
                },
                {
                    name: 'Lo-Fi',
                    value: 'filter-lofi'
                },
                {
                    name: 'Ludwig',
                    value: 'filter-ludwig'
                },
                {
                    name: 'Maven',
                    value: 'filter-maven'
                },
                {
                    name: 'Mayfair',
                    value: 'filter-mayfair'
                },
                {
                    name: 'Moon',
                    value: 'filter-moon'
                },
                {
                    name: 'Nashville',
                    value: 'filter-nashville'
                },
                {
                    name: 'Perpetua',
                    value: 'filter-perpetua'
                },
                {
                    name: 'Poprocket',
                    value: 'filter-poprocket'
                },
                {
                    name: 'Reyes',
                    value: 'filter-reyes'
                },
                {
                    name: 'Rise',
                    value: 'filter-rise'
                },
                {
                    name: 'Sierra',
                    value: 'filter-sierra'
                },
                {
                    name: 'Skyline',
                    value: 'filter-skyline'
                },
                {
                    name: 'Stinson',
                    value: 'filter-stinson'
                },
                {
                    name: 'Sutro',
                    value: 'filter-sutro'
                },
                {
                    name: 'Toaster',
                    value: 'filter-toaster'
                },
                {
                    name: 'Valencia',
                    value: 'filter-valencia'
                },
                {
                    name: 'Vesper',
                    value: 'filter-vesper'
                },
                {
                    name: 'Walden',
                    value: 'filter-walden'
                },
                {
                    name: 'Willow',
                    value: 'filter-willow'
                },
                {
                    name: 'X-Pro II',
                    value: 'filter-xpro-ii'
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
                state.currFilter = ''
                state.currFilterIdx = null
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
            // ???????????????
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
            // ????????????
            const handlerBuildImg = () => {
                if (state.imgUrl === '') {
                    warningNotify('????????????????????????')
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
                state.watermarkVisible = true
                html2canvas(el, opts).then((canvas) => {
                    state.watermarkImg = canvas.toDataURL()
                })

                // htmlToImage
                //     .toPng(el)
                //     .then(function (dataUrl) {
                //         state.watermarkImg = dataUrl
                //     })
                //     .catch(function (error) {
                //         console.error('oops, something went wrong!', error)
                //     })
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
            const handleOpenFilters = () => {
                proxy.$notify.primary('???????????????')
                state.filterVisible = true
            }
            const handleCancelFliter = () => {
                state.currFilterIdx = null
            }
            const handleCheckedFilter = (v: string, i: number) => {
                console.log(v)
                state.currFilterIdx = i
                state.currFilter = v
            }
            onMounted(() => {})

            return {
                ...toRefs(state),
                typeItems,
                uploadRef,
                photoRef,
                imageRef,
                logoItems,
                filtersList,
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
                handleDelete,
                handleCheckedFilter,
                handleOpenFilters,
                handleCancelFliter
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
        max-width: px2rem(750);
        margin: 0 auto;
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
        width: 100%;
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
    .filter-del {
        position: absolute;
        line-height: 0;
        left: px2rem(20);
        top: px2rem(5);
        padding: px2rem(10);
        z-index: 9;
    }
    .filters-box {
        width: 100%;
        padding-top: px2rem(90);
        overflow: hidden;
        overflow-x: scroll;
        &::-webkit-scrollbar {
            display: none;
        }
        ul {
            width: px2rem(165 * 40 + 30);
            li {
                display: inline-block;
                position: relative;
                width: px2rem(150);
                height: px2rem(150);
                margin-left: px2rem(15);
                background-color: rgb(238, 238, 238);
                border-radius: px2rem(12);
                overflow: hidden;
                border: 2px solid transparent;
                transition: 0.2s ease-out;
                padding: px2rem(1);

                & > img {
                    border-radius: px2rem(10);
                }
                &.active-filter,
                &:hover {
                    border-color: #ff851b;
                }
                & > p {
                    color: rgb(255, 255, 255);
                    @include font-size(24);
                    position: absolute;
                    bottom: px2rem(15);
                    left: 0;
                    width: 100%;
                    text-align: center;
                }
            }
        }
    }
</style>
