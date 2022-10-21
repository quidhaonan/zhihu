import { createRouter,createWebHashHistory} from 'vue-router'
import routes from './routes'
import store from '../store/index'
import { checkLogin } from '../api/index'
import { Toast } from 'vant'

const router=createRouter({
    history:createWebHashHistory(),
    routes
})

router.beforeEach(async (to,from,next)=>{
    const arr=['/person','/updatePerson','/store']
    if(arr.includes(to.path)){
        // 校验是否登录
        const isLogin=store.state.isLogin
        if(isLogin){
            next()
            return
        }
        if(isLogin===false){
            Toast('请先登录')
            next('/login')
            return
        }
        if(isLogin===null){
            try{
                const { code,data }=await checkLogin()
                // 登录失败
                if(+code!==0){
                    Toast('请先登录')
                    next('/login')
                    return
                }
                store.commit('changeIsLogin',true)
                store.commit('changeInfo',data)
                next()
            }catch(e){
                // 此处为了不报警告
                console.log()
            }
        }
    }
    next()
})

export default router