import App from 'next/app'
import { Provider, } from 'react-redux'
import Router from 'next/router'
import axios from 'axios'
import withRedux from '../lib/with-redux.js'
import Layout from '../components/Layout.jsx'
import Loading from '../components/Loading.jsx'
// import 'antd/dist/antd.css'

class MyApp extends App {
    state = {
        loading: false,
    }
    static async getInitialProps (ctx) {
        const { Component, } = ctx
        let pageProps = {}
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }
        return { pageProps, }
    }
    startLoading = () => {
        this.setState({ loading: true, })
    }
    stopLoading = () => {
        this.setState({ loading: false, })
    }
    render () {
        let { Component, store, pageProps, } = this.props
        return (
            <Provider store={ store }>
                { this.state.loading ? <Loading /> : null }
                <Layout>
                    <Component { ...pageProps } />
                </Layout>
            </Provider>
        )
    }
}

export default withRedux(MyApp)
