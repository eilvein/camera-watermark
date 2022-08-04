<template>
    <div class="box-404">
        <h1>404 not find</h1>
    </div>
</template>
<script lang="ts">
    import { defineComponent, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    export default defineComponent({
        setup: () => {
            onMounted(() => {
                const route = useRoute()
                console.log(route.params)
            })
        }
    })
</script>
<style lang="scss">
    .box-404 {
        text-align: center;
        padding: px2rem(50);
        h1 {
            @include font-size(36);
        }
    }
</style>
