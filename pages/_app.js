import App from 'next/app'
import { Provider, } from 'react-redux'
import Router from 'next/router'
import axios from 'axios'
import withRedux from '../lib/with-redux.js'
import Layout from '../components/Layout.jsx'
import Loading from '../components/Loading.jsx'
import 'antd/dist/antd.css'

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
    changeLoading (loading) {
        this.setState({ loading, })
    }
    startLoading = () => {
        this.setState({ loading: true, })
    }
    stopLoading = () => {
        this.setState({ loading: false, })
    }
    componentDidMount () {
        Router.events.on('routeChangeStart', this.startLoading)
        Router.events.on('routeChangeComplete', this.stopLoading)
        Router.events.on('routeChangeError', this.stopLoading)
        // axios.get('https://api.github.com/search/repositories?q=react').then(res => {
        //     console.log(res)
        // })
    }
    componentWillUnmount () {
        Router.events.off('routeChangeStart', this.startLoading)
        Router.events.off('routeChangeComplete', this.stopLoading)
        Router.events.off('routeChangeError', this.stopLoading)
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
