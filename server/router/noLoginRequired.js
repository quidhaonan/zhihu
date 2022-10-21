const 
    bodyparser = require('body-parser'),
    fs = require('fs').promises,
    path = require('path'),
    pathdb = path.resolve(__dirname, 'database'),
    pathupload = path.resolve(__dirname, 'static'),
    md5 = require('blueimp-md5'),
    multiparty = require("multiparty")
const { server = 7000 } = require('../package.json').config || {}
const { Token, filter, responsePublic, queryUserInfo, delay } = require('../utils')

const express=require('express')
const request=require('request')
const router=express.Router()
const noLoginRequired=require('../router_handler/noLoginRequired_handler')

// 获取最新新闻的路由
router.get('/news_latest',noLoginRequired.newsLatest)
// 获取以往新闻的路由
router.get('/news_before',noLoginRequired.newsBefore)
// 获取新闻详情的路由
router.get('/news_info',noLoginRequired.newsInfo)
// 获取新闻评论信息的路由
router.get('/story_extra',noLoginRequired.storyExtra)
// 登录&注册的路由
router.post('/login',noLoginRequired.login)
// 获取手机验证码的路由
router.post('/phone_code',noLoginRequired.phoneCode)

module.exports=router