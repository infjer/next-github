const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const next = require('next')
const Redis = require('ioredis')
const koaBody = require('koa-body')
const RedisSessionStore = require('./server/session.js')
const auth = require('./server/auth.js')
const api = require('./server/api.js')
const atob = require('atob')

global.atob = atob

const dev = process.env.NODE_ENV !== 'production'
const redis = new Redis()
const app = next({ dev, })
const requestHandler = app.getRequestHandler()

app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()

    server.keys = [ 'hello', ]
    const SESSION_CONFIG = {
        key: 'jid',
        // maxAge: 24*60*60*1000,
        // maxAge: 50*1000,
        store: new RedisSessionStore(redis)
    }
    server.use(session(SESSION_CONFIG, server))
    server.use(koaBody())
    auth(server)
    api(server)

    router.get('/api/user/info', async ctx => {
        const { user, } = ctx.session
        if (!user) {
            ctx.status = 401
            ctx.body = 'need login'
        } else {
            ctx.body = user
            ctx.set('Content-Type', 'application/json')
        }
    })

    router.get('/user/:id', async ctx => {
        const { id } = ctx.params
        await requestHandler(ctx.req, ctx.res, {
            pathname: '/user',
            query: {
                id,
            },
        })
        ctx.respond = false
    })
    server.use(router.routes())
    server.use(async (ctx, next) => {
        ctx.req.session = ctx.session
        await requestHandler(ctx.req, ctx.res)
        ctx.respond = false
    })
    server.listen(3000)
})
