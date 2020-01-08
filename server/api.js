const axios = require('axios')
const { requestGithub, } = require('../lib/api.js')

module.exports = server => {
    server.use(async (ctx, next) => {
        if (ctx.path.startsWith('/github/')) {
            const method = ctx.method
            const { access_token, token_type, } = ctx.session.auth
            const header = {
                Authorization: `${token_type} ${access_token}`,
            }
            const result = await requestGithub(method, ctx.url.replace('/github/', '/'), ctx.request.body || {}, header)
            ctx.body = result.data
            ctx.status = result.status
            // ctx.set('Content-Type', 'application/json')
        } else {
            await next()
        }
    })
}
