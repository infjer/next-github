import React from 'react'
import createStore from '../store/store.js'

const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

const initStore = store => {
    if (isServer) {
        return createStore(store)
    }
    if (!window[__NEXT_REDUX_STORE__]) {
        window[__NEXT_REDUX_STORE__] = createStore(store)
    }
    return window[__NEXT_REDUX_STORE__]
}

export default Comp => {
    class WithReduxApp extends React.Component {
        constructor (props) {
            super(props)
            this.store = initStore(props.store)
        }
        static async getInitialProps (ctx) {
            const store = initStore()
            ctx.store = store
            let appProps = {}
            if (typeof Comp.getInitialProps === 'function') {
                appProps = await Comp.getInitialProps(ctx)
            }
            return {
                ...appProps,
                store: store.getState(),
            }
        }
        render () {
            let { Component, pageProps, ...rest } = this.props
            return <Comp { ...rest } Component={ Component } pageProps={ pageProps } store={ this.store } />
        }
    }
    WithReduxApp.getInitialProps = async ctx => {
        let store
        if (isServer) {
            let { session, } = ctx.ctx.req
            if (session?.user) {
                store = initStore({
                    user: session.user,
                })
            } else {
                store = initStore()
            }
        } else {
            store = initStore()
        }
        ctx.store = store
        let appProps = {}
        if (typeof Comp.getInitialProps === 'function') {
            appProps = await Comp.getInitialProps(ctx)
        }
        return {
            ...appProps,
            store: store.getState(),
        }
    }
    return WithReduxApp
}
