const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const next = require('next')
const Redis = require('ioredis')
const koaBody = require('koa-body')
const _ = require('lodash')
const RedisSessionStore = require('./server/session.js')
const auth = require('./server/auth.js')
const api = require('./server/api.js')

const dev = process.env.NODE_ENV !== 'production'
const redis = new Redis()
const app = next({ dev, })
const requestHandler = app.getRequestHandler()

app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()

    server.keys = [ 'next-github', ]
    const SESSION_CONFIG = {
        key: 'sid',
        // maxAge: 24*60*60*1000,
        // maxAge: 50*1000,
        store: new RedisSessionStore(redis),
    }
    server.use(session(SESSION_CONFIG, server))
    server.use(koaBody())
    auth(server)
    api(server)

    router.get('/user/:u/:t', async ctx => {
        const { u, t, } = ctx.params
        await requestHandler(ctx.req, ctx.res, {
            pathname: '/user',
            query: { u, t, },
        })
        ctx.respond = false
    })
    router.get('/owner/:o/:t', async ctx => {
        const { o, t, } = ctx.params
        await requestHandler(ctx.req, ctx.res, {
            pathname: '/owner',
            query: { o, t, },
        })
        ctx.respond = false
    })
    router.get('/repo/code/:o/:r/:t?/:b?/:s?/:d(\\S*)?', async ctx => {
        const { o, r, t, b, s, d, } = ctx.params
        debugger
        let query = { o, r, }
        let param = { t, b, s, d, }
        _.each(param, (v, k) => {
            if (!!v) {
                query[k] = v
            }
        })
        await requestHandler(ctx.req, ctx.res, {
            pathname: '/repo/code',
            query,
        })
        ctx.respond = false
    })
    router.get('/repo/issue/:o/:r/:id?', async ctx => {
        const { o, r, id, } = ctx.params
        await requestHandler(ctx.req, ctx.res, {
            pathname: '/repo/issue',
            query: { o, r, id, },
        })
        ctx.respond = false
    })
    router.get('/repo/pull/:o/:r/:id?', async ctx => {
        const { o, r, id, } = ctx.params
        await requestHandler(ctx.req, ctx.res, {
            pathname: '/repo/pull',
            query: { o, r, id, },
        })
        ctx.respond = false
    })
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

    server.use(router.routes())
    server.use(async (ctx, next) => {
        ctx.req.session = ctx.session
        await requestHandler(ctx.req, ctx.res)
        ctx.respond = false
    })
    server.listen(3000)
})
