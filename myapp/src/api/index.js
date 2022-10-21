import axios from './http'

// 获取今日新闻
export const queryNewsLatest=()=>{
    // return axios.get('/api/news_latest')
    return axios.get('/news_latest')
}

// 获取往日新闻
export const queryNewsBefore=(time)=>{
    // return axios.get('/api/news_before',{
    return axios.get('/news_before',{
        params:{
            time
        }
    })
}

// 获取新闻详情
export const queryNewsInfo=(id)=>{
    // return axios.get('/api/news_info')
    return axios.get('/news_info',{
        params:{
            id
        }
    })
}

// 获取评论数
export const queryNewsStore=(id)=>{
    // return axios.get('/api/story_extra')
    return axios.get('/story_extra',{
        params:{
            id
        }
    })
}

// 登录接口
export const login=(phone,code)=>{
    // return axios.post('/api/login')
    return axios.post('/login',{
        phone,
        code
    })
}

// 获取手机验证码
export const phoneCode=(phone)=>{
    // return axios.post('/api/phone_code',{
    return axios.post('/phone_code',{
        phone
    })
}

// ----------------------------------------------------------------------------------

// 检测是否登录
export const checkLogin=()=>{
    // return axios.get('/api/check_login')
    return axios.get('/check_login')
}

// 获取登录者信息
export const userInfo=()=>{
    // return axios.get('/api/user_info')
    return axios.get('/user_info')
}

// 修改用户信息
// 格式：multipart/form-data
export const userUpdate=(username,file)=>{
    const fm=new FormData()
    fm.append('username',username)
    fm.append('file',file)
    // return axios.post('/api/user_update',fm)
    return axios.post('/user_update',fm)
}

// 收藏
export const store=(newsId)=>{
    // return axios.post('/api/store')
    return axios.post('/api/store',{
        newsId
    })
}

// 移除收藏
export const storeRemove=(id)=>{
    // return axios.get('/api/store_remove',{
    return axios.get('/store_remove',{
        params:{
            id
        }
    })
}

// 收藏列表
export const storeList=()=>{
    // return axios.get('/api/store_list')
    return axios.get('/store_list')
}