// 将 wx.request 封装成为一个 promise 对象

// 1.0 返回一个 promise 对象
function request(url, method = 'GET', data = {}, header = {}) {
    return new Promise((resolve, reject) => {
        wx.showLoading({
            title: '加载中'
        })
        // 2.0 完成逻辑处理
        wx.request({
            url: url,
            method: method,
            data: data,
            header,
            success: res => {
                resolve(res)
                wx.hideLoading()
            },
            fail: err => {
                reject(err)
            }
        })
    })
}

// 封装一个单独的 get 方法
request.get = function (url, data = {}) {
    return request(url, 'GET', data)
}

// 封装一个单独的 post 方法
request.post = function (url, data = {}) {
    return request(url, 'POST', data)
}

// 封闭一个验证是否登录的方法
request.auth = function (url, method, data = {}) {
    // 得到 token
    var token = wx.getStorageSync('token')
    if (!token) {
        // 如果不存在，跳转到登录页面
        wx.navigateTo({
            url: '/pages/auth/main'
        })
        return new Promise(() => { })
    }
    // 如果存在，就直接发送请求（在请求头中带上 token）
    return request(url, method, data, { "Authorization": token })
}

// 3.0 暴露给外界
export default request