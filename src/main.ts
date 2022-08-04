import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import filters from '@/utils/filters'

// ui
import {
    Button,
    Uploader,
    Icon,
    Notify,
    Dialog,
    OverLay,
    Popup,
    Form,
    FormItem,
    Cell,
    CellGroup,
    ActionSheet,
    Radio,
    RadioGroup
} from '@nutui/nutui'
import '@nutui/nutui/dist/style.css'
// import '@nutui/nutui/dist/styles/themes/default.scss'

const app = createApp(App)

// 全局过滤器
app.config.globalProperties.$filters = filters

app.use(router)
    .use(store)
    .use(Button)
    .use(Uploader)
    .use(Icon)
    .use(Notify)
    .use(Dialog)
    .use(OverLay)
    .use(Popup)
    .use(Form)
    .use(FormItem)
    .use(Cell)
    .use(CellGroup)
    .use(ActionSheet)
    .use(Radio)
    .use(RadioGroup)
    .mount('#app')
