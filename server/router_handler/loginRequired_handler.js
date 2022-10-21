const { responsePublic,queryUserInfo }=require('../utils')

// 检测是否登录的路由的处理函数
exports.checkLogin=(req, res) => {
    responsePublic(res, true, {
        // data: queryUserInfo(req, req.$TOKEN.id)
    })
}

// 获取登录者信息的路由
exports.userInfo=(req, res) => {
    console.log(89)
    responsePublic(res, true, {
        // data: queryUserInfo(req, req.$TOKEN.id)
    })
}

// 收藏信息的路由的处理函数
exports.store=async (req, res) => {
    let { newsId } = req.body
    if (!newsId) {
        responsePublic(res, false)
        return
    }
    let store = req.$STOREDATA
    // 检查是否收藏过
    if (store.some(item => (item.userId == req.$TOKEN.id && item.newsId == newsId))) {
        responsePublic(res, false, {
            codeText: 'the current article has been collected'
        })
        return
    }
    store.push({
        id: store.length === 0 ? 1 : (+store[store.length - 1].id + 1),
        newsId,
        userId: req.$TOKEN.id,
        time: +new Date()
    })
    await fs.writeFile(`${pathdb}/store.json`, JSON.stringify(store), 'utf-8')
    responsePublic(res, true)
}

// 移除收藏的路由的处理函数
exports.storeRemove=async (req, res) => {
    let { id } = req.query
    if (!id) {
        responsePublic(res, false)
        return
    }
    req.$STOREDATA = req.$STOREDATA.filter(item => {
        return +item.id !== +id
    })
    await fs.writeFile(`${pathdb}/store.json`, JSON.stringify(req.$STOREDATA), 'utf-8')
    responsePublic(res, true)
}

// 收藏列表的路由的处理函数
exports.storeList=async (req, res) => {
    let store = req.$STOREDATA.filter(item => {
        return +item.userId === +req.$TOKEN.id
    })
    store.reverse()
    store[Symbol.asyncIterator] = function asyncIterator() {
        let index = 0,
            self = this
        return {
            next() {
                if (index > self.length - 1) return Promise.resolve({ done: true })
                return new Promise(async resolve => {
                    try {
                        let item = self[index++]
                        let info = await queryNewsInfo(item.newsId)
                        resolve({
                            value: {
                                id: item.id,
                                userId: item.userId,
                                news: {
                                    id: item.newsId,
                                    title: info.title,
                                    image: info.image
                                }
                            },
                            done: false
                        })
                    } catch (err) {
                        resolve({
                            value: null,
                            done: false
                        })
                    }
                })
            }
        }
    }
    let data = []
    for await (item of store) {
        if (item) data.push(item)
    }
    responsePublic(res, true, {
        data
    })
}

// 修改用户名 & 头像的路由的处理函数
exports.userUpdate=async (req, res) => {
    try {
        let { files, fields } = await multiparty_upload(req)
        let file = (files.file && files.file[0]) || {},
            username = (fields.username && fields.username[0]) || "",
            filename = file.path.match(/static\/(.+)/)[1] || 'timg.jpg'
        req.$USERDATA = req.$USERDATA.map(item => {
            if (+item.id === +req.$TOKEN.id) {
                item.name = username
                item.pic = filename
            }
            return item
        })
        await fs.writeFile(`${pathdb}/user.json`, JSON.stringify(req.$USERDATA), 'utf-8')
        responsePublic(res, true, {
            data: queryUserInfo(req, req.$TOKEN.id)
        })
    } catch (err) {
        responsePublic(res, false)
    }
}



// 收藏列表
const queryNewsInfo = id => {
    return new Promise((resolve, reject) => {
        request(`${baseURL}/news/${id}`, (err, _, body) => {
            if (err) {
                reject(err)
                return
            }
            body = filter(body)
            if (Array.isArray(body) && body.length === 0) {
                reject(body)
                return
            }
            resolve(body)
        })
    })
}

// 修改用户名 & 头像
const multiparty_upload = function multiparty_upload(req) {
    let config = {
        maxFieldsSize: 200 * 1024 * 1024,
    }
    config.uploadDir = pathupload
    return new Promise(async (resolve, reject) => {
        await delay()
        new multiparty.Form(config)
            .parse(req, (err, fields, files) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve({
                    fields,
                    files
                })
            })
    })
}