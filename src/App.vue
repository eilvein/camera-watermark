<template>
    <router-view />
    <!-- <MobileConsole /> -->
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import MobileConsole from '@/components/mobileConsole/Index.vue'

    export default defineComponent({
        name: 'App',
        components: { MobileConsole }
    })
</script>

<style lang="scss"></style>
