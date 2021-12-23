const detail = (ctx, next) => {
    ctx.response.body = {
        name: 'joy',
        description: 'a handsome boy'
    }
}

const add = (ctx, next) => {
    const request = ctx.request
    console.log(request)
    console.log(`params: ${JSON.stringify(request.params)}, body: ${JSON.stringify(request.body)}`)
    ctx.response.body = 'User'
}

module.exports = {
    'GET /user/:name': detail,
    'POST /user': add
}