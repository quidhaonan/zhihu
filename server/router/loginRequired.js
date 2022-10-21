const express=require('express')
const router=express.Router()

const loginRequired=require('../router_handler/loginRequired_handler')

// 检测是否登录的路由
router.get('/check_login',loginRequired.checkLogin)
// 获取登录者信息的路由
router.get('/user_info',loginRequired.userInfo)
// 收藏信息的路由
router.post('/store',loginRequired.store)
// 移除收藏的路由
router.get('/store_remove',loginRequired.storeRemove)
// 收藏列表的路由
router.get('/store_list',loginRequired.storeList)
// 修改用户名 & 头像的路由
router.post('/user_update',loginRequired.userUpdate);

module.exports=router