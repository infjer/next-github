import { useEffect, } from 'react'
import { withRouter, } from 'next/router'
import Link from 'next/link'
import api from '../lib/api.js'
import axios from 'axios'
import { Button, Layout, Avatar, Icon, } from 'antd'
import getConfig from 'next/config'
import { connect, } from 'react-redux'
import _ from 'lodash'
import Repo from '../components/Repo.js'
import LRU from 'lru-cache'

const cache = new LRU({
    maxAge: 10*60*1000,
})
const { Sider, Content, } = Layout
const { publicRuntimeConfig, } = getConfig()
const isServer = typeof window === 'undefined'
const Index = ({ user, repos, starred, router, }) => {
    useEffect(() => {
        if (!isServer) {
            cache.set('repos', repos)
            cache.set('starred', repos)
        }
    }, [ repos, starred, ])
    if (!user.id) {
        return (
            <div>
                <Button type='primary' href={ publicRuntimeConfig.OAUTH_URL + `&redirect_uri=http://localhost:3000/auth?redirect=${router.asPath}` }>前去登录</Button>
            </div>
        )
    }
    return <div>empty notification</div>
    // return (
    //     <Layout style={{ paddingTop: '20px', }}>
    //         <Sider width={ 300 } style={{ background: 'rgba(0,0,0,0)', }}>
    //             <div style={{ display: 'flex', flexDirection: 'column', }}>
    //                 <Avatar shape='square' size={ 250 } src={ user.avatar_url } />
    //                 <span>{ user.login }</span>
    //                 <span>{ user.name }</span>
    //                 <span>{ user.bio }</span>
    //                 <span>
    //                     <Icon type='mail'/>
    //                     <a href={ `mailto:${user.email}` }>{ user.email }</a>
    //                 </span>
    //             </div>
    //         </Sider>
    //         <Content>
    //             <Repo repos={ repos } />
    //             <Repo repos={ starred } />
    //         </Content>
    //     </Layout>
    // )
}

Index.getInitialProps = async ({ ctx, store, }) => {
    let { user, } = store.getState()
    if (!user.id) {
        return {
            isLogin: false,
            repos: [],
            starred: [],
        }
    }
    if (!isServer) {
        let repos = cache.get('repos')
        let starred = cache.get('starred')
        if (repos && starred) {
            return {
                repos,
                starred,
            }
        }
    }
    // const { data: repos, } = await api.request(
    //     {
    //         url: '/user/repos',
    //     },
    //     ctx.req,
    //     ctx.res,
    // )
    // const { data: starred, } = await api.request(
    //     {
    //         url: '/user/starred',
    //     },
    //     ctx.req,
    //     ctx.res,
    // )
    return {
        isLogin: true,
        repos: [],
        starred: [],
    }
}

export default withRouter(connect(state => ({
    user: state.user,
}))(Index))
