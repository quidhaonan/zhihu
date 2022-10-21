const express = require('express'),
    bodyparser = require('body-parser'),
    request = require('request'),
    fs = require('fs').promises,
    path = require('path'),
    pathdb = path.resolve(__dirname, './database'),
    pathupload = path.resolve(__dirname, 'static'),
    md5 = require('blueimp-md5'),
    multiparty = require("multiparty")
const { server = 7000 } = require('./package.json').config || {}
const { Token, filter, responsePublic, queryUserInfo, delay } = require('./utils')

/*-创建&启动服务-*/
const app = express()

// 自己加的跨域
const cors=require('cors')
app.use(cors())
// 解析的中间件
app.use(bodyparser.urlencoded({ extended: false }))


// 往 req 中添加属性
app.use(async (req, _, next) => {
    // 获取后续需要的数据,并且挂载到REQUEST上
    req.$USERDATA = filter(await fs.readFile(`${pathdb}/user.json`, 'utf-8',function(){}))
    req.$TOKENDATA = filter(await fs.readFile(`${pathdb}/token.json`, 'utf-8',function(){}))
    req.$CODEDATA = filter(await fs.readFile(`${pathdb}/code.json`, 'utf-8',function(){}))
    req.$STOREDATA = filter(await fs.readFile(`${pathdb}/store.json`, 'utf-8',function(){}))
    next()
})

// 校验登录态
app.use(async (req, res, next) => {
    // 不在校验范围内的接口直接下一步
    const checkList = ['/user_info', '/check_login', '/store', '/store_list', '/store_remove', '/user_update']
    if (!checkList.includes(req.path)) {
        next()
        return
    }
    // 首先校验Token的合法性
    let authorzation = req.headers['authorzation'],
        sign = req.headers['sign'],
        time = req.headers['time']
    let { token, data } = Token.verify(authorzation)
    if (!token) {
        responsePublic(res, false, {
            codeText: 'no permission to access, possibly because you are not logged in or your login has expired'
        })
        return
    }
    // 校验签名的合法性
    let item = req.$TOKENDATA.find(item => {
        return item.token === authorzation && item.sign === sign && item.time === time
    })
    let temp = md5(`${authorzation}@${time}@zhufeng`)
    if (item || temp !== sign) {
        responsePublic(res, false, {
            codeText: 'the current request is illegal access'
        })
        return
    }
    req.$TOKENDATA.push({ token: authorzation, sign, time })
    await fs.writeFile(`${pathdb}/token.json`, JSON.stringify(req.$TOKENDATA), 'utf-8')
    req.$TOKEN = data
    next()
})

// app.post('/phone_code',(req,res)=>{
//     console.log(req.$USERDATA)
// })

// 获取新闻
const noLoginRequired=require('./router/noLoginRequired')
app.use(noLoginRequired)
// 需要 token 的路由
const loginRequired=require('./router/loginRequired')
app.use(loginRequired)

app.use(express.static('./static'))
app.use((_, res) => {
    res.status(404)
    res.send()
})






app.listen(server, () => {
    console.log(`THE WEB SERVICE SUCCESSFULLY AND LISTENING TO THE PORT：${server}！`)
})

/*-无需登录的接口-*/
const baseURL = 'https://news-at.zhihu.com/api/4'





