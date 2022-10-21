import { createStore,createLogger } from 'vuex'
import { checkLogin,userInfo } from '../api/index'

const env=process.env.NODE_ENV

export default createStore({
    state:{
        isLogin:null,
        info:null
    },
    actions:{
        async changeIsLoginAsync({ commit }){
            let bool=false
            const { code }=await checkLogin()
            if(+code===0) bool=true
            commit('changeIsLogin',bool)
        },
        async changeInfoAsync({ commit }){
            const { code,data }=await userInfo()
            if(+code===0){
                commit('changeInfo',data)
            }
        }
    },
    mutations:{
        changeIsLogin(state,bool){
            state.isLogin=bool
        },
        changeInfo(state,payload){
            state.info=payload
        }
    },
    plugins:env==='production'?[]:[createLogger]
})