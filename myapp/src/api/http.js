import axios from 'axios'
import qs from 'qs'
import { isPlainObject } from '../utils/index'
import { Notify } from 'vant'
import md5 from 'blueimp-md5'

axios.defaults.baseURL='http://localhost:7000'
axios.defaults.timeout=60000

axios.defaults.transformRequest=data=>{
    if(isPlainObject(data)) return qs.stringify(data)
    return data
}

axios.interceptors.request.use(config=>{
    // 针对于部分接口，我们携带令牌和签名信息
    const apiList=['/check_login','/user_info','/user_update','/store','/store_remove','/store_list']
    const token=localStorage.getItem('token')
    // if(apiList.includes(config.url.replace('/api','')) && token){
    if(apiList.includes(config.url) && token){
        const time=new Date()
        const sign=md5(`${ token }@ ${ time }@zhufeng`)
        config.headers['authorzation']=encodeURIComponent(token)
        config.headers['time']=encodeURIComponent(time)
        config.headers['sign']=encodeURIComponent(sign)
    }
    return config
})

axios.interceptors.response.use(response=>{
    return response.data
},reason=>{
    Notify({
        type:'danger',
        message:'当前网络繁忙，请稍后重试'
    })
    return Promise.reject(reason)
})

export default axios