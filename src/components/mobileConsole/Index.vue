<template>
    <teleport to="#vconsole">
        <div class="vc-tigger" @click="toggleVc">点我</div>
    </teleport>
</template>
<script lang="ts">
    import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'
    import VConsole from 'vconsole'
    import { config } from '@/config/index'
    import { useDOMCreate } from '@/hooks/useDOMCreate'
    interface IState {
        lastClickTime: number
        count: number
        limit: number
        vConsole: any
    }
    export default defineComponent({
        name: 'MobileConsole',
        props: {},
        setup() {
            useDOMCreate('vconsole')
            const state = reactive<IState>({
                lastClickTime: 0,
                count: 0,
                limit: ['production', 'prod'].includes(config.env || '') ? 5 : 0,
                vConsole: null
            })
            const hasClass = (obj: HTMLElement | null, cls: string) => {
                return obj?.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
            }
            const addClass = (obj: HTMLElement | null, cls: string) => {
                if (!hasClass(obj, cls)) obj?.classList.add(cls)
            }
            const removeClass = (obj: HTMLElement | null, cls: string) => {
                if (hasClass(obj, cls)) {
                    obj?.classList.remove(cls)
                }
            }
            const toggleClass = (obj: HTMLElement | null, cls: string) => {
                if (hasClass(obj, cls)) {
                    removeClass(obj, cls)
                } else {
                    addClass(obj, cls)
                }
            }
            const toggleVc = () => {
                const nowTime = new Date().getTime()
                if (nowTime - state.lastClickTime < 3000) {
                    state.count++
                } else {
                    state.count = 0
                }
                state.lastClickTime = nowTime
                if (state.count >= state.limit) {
                    if (!state.vConsole) {
                        state.vConsole = new VConsole()
                    }
                    const vconDom = document.getElementById('__vconsole')
                    toggleClass(vconDom, 'vconsole_show')
                    state.count = 0
                }
            }
            onMounted(() => {
                // state.vConsole = new VConsole()
                // const vconDom = document.getElementById('__vconsole')
                // toggleClass(vconDom, 'vconsole_show')
            })
            onUnmounted(() => {
                state.vConsole = null
            })
            return {
                toggleVc
            }
        }
    })
</script>
<style lang="scss">
    .vc-tigger {
        position: fixed;
        top: px2rem(10);
        right: 0;
        width: px2rem(70);
        height: px2rem(50);
        line-height: px2rem(50);
        border-radius: px2rem(8) 0 0 px2rem(8);
        text-align: center;
        @include font-size(24);
        color: #fff;
        background: #07c160;
        z-index: 9999;
    }
    .vconsole_show {
        display: block !important;
    }
</style>
