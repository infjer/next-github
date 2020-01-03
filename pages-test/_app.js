import App from 'next/app'
import { Provider, } from 'react-redux'
import Layout from '../components/Layout-test.jsx'
import MyContext from '../lib/mycontext.js'
import hoc from '../lib/with-redux.js'
import 'antd/dist/antd.css'

class MyApp extends App {
    constructor (props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }
    state = {
        context: 'default value',
    }
    static async getInitialProps (ctx) {
        const { Component, } = ctx
        let pageProps = {}
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }
        return { pageProps, }
    }
    handleClick () {
        this.setState({
            context: `${Math.random()}`,
        })
    }
    render () {
        let { Component, store, pageProps } = this.props
        return (
            <Layout>
                <Provider store={ store }>
                    <MyContext.Provider value={ this.state.context }>
                        <Component pageProps={ pageProps } />
                        {/* <button onClick={ this.handleClick }>operate</button> */}
                    </MyContext.Provider>
                </Provider>
            </Layout>
        )
    }
}

export default hoc(MyApp)
