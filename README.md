# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite.

## 开发

```
# 启动开发服务器
yarn dev

# 为生产环境构建产物
yarn build

# 本地预览生产构建产物
yarn serve

```

## UI 库

[NutUI 3.0](https://nutui.jd.com/#/intro)

> NutUI 是京东风格的 Vue 移动端组件库，开发和服务于移动 Web 界面的企业级产品。

## 移动端适配

> 移动端页面设计稿宽度：750

##### 字体使用 EX:

```scss
h2 {
    @include font-size(34);
}
```

##### 其他元素 EX:

```scss
h2 {
    width: px2rem(100);
    height: px2rem(100);
    @include border($direction: all, $size: 1px, $color: #ccc, $style: solid, $radius: 5px);
}
```

## 其他

```
# 组件中使用
import.meta.env.VITE_PORT

<span class="iconfont">&#x33;</span>

# url编码
encodeURIComponent
decodeURIComponent
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur). Make sure to enable `vetur.experimental.templateInterpolationService` in settings!

### If Using `<script setup>`

[`<script setup>`](https://github.com/vuejs/rfcs/pull/227) is a feature that is currently in RFC stage. To get proper IDE support for the syntax, use [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) instead of Vetur (and disable Vetur).

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can use the following:

### If Using Volar

Run `Volar: Switch TS Plugin on/off` from VSCode command palette.

### If Using Vetur

1. Install and add `@vuedx/typescript-plugin-vue` to the [plugins section](https://www.typescriptlang.org/tsconfig#plugins) in `tsconfig.json`
2. Delete `src/shims-vue.d.ts` as it is no longer needed to provide module info to Typescript
3. Open `src/main.ts` in VSCode
4. Open the VSCode command palette
5. Search and run "Select TypeScript version" -> "Use workspace version"
