const purchase = (ctx, next) => {
    ctx.response.body = {
        code: '30040010',
        message: '發送短訊驗證碼失敗',
        data: '',
        status: 200
    }
}

module.exports = {
    'POST /user/authentication/sendsms': purchase,
    'POST /user/authentication': purchase,
    'POST /user/access': purchase
}