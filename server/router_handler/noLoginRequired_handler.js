const express = require('express'),
    bodyparser = require('body-parser'),
    
    md5 = require('blueimp-md5'),
    multiparty = require("multiparty")
const { server = 7000 } = require('../package.json').config || {}
const {  filter, queryUserInfo, delay } = require('../utils')


const request=require('request')
/*-无需登录的接口-*/
const baseURL = 'https://news-at.zhihu.com/api/4'
const { Token,responsePublic }=require('../utils')
const fs=require('fs')
const path=require('path')

//待会删除
const pathupload = path.resolve(__dirname, 'static')

const pathdb = path.resolve(__dirname,'../' ,'database')

// 获取最新新闻的路由的处理函数
exports.newsLatest=(req, res) => {
    console.log(123)
    req.pipe(request(`${baseURL}/news/latest`)).pipe(res)
}

// 获取以往新闻的路由的处理函数
exports.newsBefore=(req, res) => {
    let { time } = req.query
    if (!time) {
        time = new Date().toLocaleString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
        time = time.match(/\d+/g).map(item => {
            item += ''
            return item.length < 2 ? '0' + item : item
        })
        let [year, month, day] = time
        time = `${year}${month}${day}`
    }
    req.pipe(request(`${baseURL}/news/before/${time}`)).pipe(res)
}

// 获取新闻详情的路由的处理函数
exports.newsInfo=(req, res) => {
    let { id } = req.query
    if (!id) {
        responsePublic(res, false)
        return
    }
    req.pipe(request(`${baseURL}/news/${id}`)).pipe(res)
}

// 获取新闻评论信息的路由的处理函数
exports.storyExtra=(req, res) => {
    let { id } = req.query
    if (!id) {
        responsePublic(res, false)
        return
    }
    req.pipe(request(`${baseURL}/story-extra/${id}`)).pipe(res)
}

// 登录&注册的路由的处理函数
exports.login=async (req, res) => {
    let { phone, code } = req.body
    // 校验验证码是否正确
    let flag = req.$CODEDATA.find(item => {
        return item.phone === phone && item.code === String(code) && (+new Date() - item.time) <= 1800000
    })
    if (!flag) {
        // 登录失败，把刚才此手机号生成的验证码移除掉
        req.$CODEDATA = req.$CODEDATA.filter(item => item.phone !== phone)
        await fs.writeFile(`${pathdb}/code.json`, JSON.stringify(req.$CODEDATA), 'utf-8',function(){})
        responsePublic(res, false, {
            codeText: 'the mobile phone number and verification code do not match'
        })
        return
    }
    // 校验手机号是否存在，不存在注册一个，存在则登录成功
    let item = req.$USERDATA.find(item => item.phone === phone)
    if (!item) {
        item = {
            id: req.$USERDATA.length === 0 ? 1 : (+req.$USERDATA[req.$USERDATA.length - 1].id + 1),
            name: `知乎用户${queryRandom()}`,
            phone,
            pic: '../static/timg.jpg',
            time: +new Date()
        }
        req.$USERDATA.push(item)
        await fs.writeFile(`${pathdb}/user.json`, JSON.stringify(req.$USERDATA), 'utf-8',function(){})
    }
    let token = Token.sign({
        id: item.id,
        phone: item.phone
    })
    responsePublic(res, true, { token },item)
}

// 获取手机验证码的路由的处理函数
exports.phoneCode=async (req, res) => {
    let { phone } = req.body
    if (!phone) {
        responsePublic(res, false)
        return
    }
    let codeData = req.$CODEDATA,
        code = queryRandom(),
        time = +new Date()
    // 验证手机号是否存在,存在更新验证码 & 不存在创建验证码
    let item = codeData.find(item => item.phone === phone)
    if (item) {
        item.code = code
        item.time = time
    } else {
        codeData.push({
            id: codeData.length === 0 ? 1 : (+codeData[codeData.length - 1].id) + 1,
            phone,
            code,
            time: +new Date()
        })
    }
    await fs.writeFile(`${pathdb}/code.json`, JSON.stringify(codeData), 'utf-8',function(){})
    // 发送短信
    await fs.appendFile(`${path.resolve(__dirname, '../')}/code.txt`, `手机号 ${phone} 的用户于 ${new Date(time).toLocaleString('zh-CN', { hour12: false })} 发送短信验证码：${code} \n`, 'utf-8',function(){})
    responsePublic(res, true)
}

// 获取手机验证码
const queryRandom = () => {
    let str = ``
    while (str.length < 6) {
        let ran = Math.round(Math.random() * 9)
        str += ran
    }
    return str
}