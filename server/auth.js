const axios = require('axios')
const config = require('../config.js')

const { client_id, client_secret, token_url, } = config

module.exports = server => {
    server.use(async (ctx, next) => {
        if (ctx.path === '/auth') {
            const { code, redirect = '/', } = ctx.query
            if (!code) {
                 return ctx.body = 'error'
                 return
            }
            const result = await axios({
                method: 'POST',
                url: config.token_url,
                data: {
                    client_id,
                    client_secret,
                    code,
                },
                headers: {
                    Accept: 'application/json',
                },
            })
            if (result.status === 200 && result.data && !result.data.error) {
                ctx.session.auth = result.data
                const { access_token, token_type, } = result.data
                const { data: user, } = await axios({
                    method: 'GET',
                    url: 'https://api.github.com/user',
                    headers: {
                        'Authorization': `${token_type} ${access_token}`,
                    },
                })
                ctx.session.user = user
                ctx.redirect(redirect)
            } else {
                ctx.body = 'failed'
            }
        } else {
            await next()
        }
    })

    server.use(async (ctx, next) => {
        if (ctx.path === '/logout' && ctx.method === 'POST') {
            ctx.session = null
            ctx.body = 'logout success'
        } else {
            await next()
        }
    })
}
