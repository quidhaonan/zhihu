import { createApp } from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router/index'

// 处理最大宽度
import { handleMaxWidth } from './utils/index'
handleMaxWidth()
window.addEventListener('resize',handleMaxWidth)

// 进行大小的适配
import 'amfe-flexible'

const app=createApp(App)

// 实现懒加载
import { Lazyload } from 'vant'
app.use(Lazyload, {
    lazyComponent: true,
})

app.use(store)
app.use(router)
app.mount('#app')
