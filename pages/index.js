import { useEffect, } from 'react'
import Router, { withRouter, } from 'next/router'
import Link from 'next/link'
import api from '../lib/api.js'
import axios from 'axios'
import { Layout, Button, Avatar, Tabs, } from 'antd'
import { MailOutlined, } from '@ant-design/icons'
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
    const tabKey = router.query.key || '1'

    useEffect(() => {
        if (!isServer) {
            repos && cache.set('repos', repos)
            starred && cache.set('starred', starred)
        }
    }, [ repos, starred, ])
    console.log(repos, starred)

    const handleTabChange = activeKey => {
        Router.push(`/?key=${activeKey}`)
    }

    if (!user.id) {
        return (
            <div>
                <Button type='primary' href={ publicRuntimeConfig.OAUTH_URL + `&redirect_uri=http://localhost:3000/auth?redirect=${router.asPath}` }>前去登录</Button>
            </div>
        )
    }
    return (
        <Layout style={{ paddingTop: '20px', }}>
            <Sider width={ 300 } style={{ background: 'rgba(0,0,0,0)', }}>
                <div className='user-info'>
                    <Avatar shape='square' size={ 220 } src={ user.avatar_url } />
                    <span className='user-login'>{ user.login }</span>
                    <span className='user-name'>{ user.name }</span>
                    <span className='user-bio'>{ user.bio }</span>
                    <span className='user-email'>
                        <MailOutlined />
                        <a href={ `mailto:${user.email}` }>{ user.email }</a>
                    </span>
                </div>
            </Sider>
            <Content>
                <Tabs activeKey={ tabKey } animated={ false } onChange={ handleTabChange }>
                    <Tabs.TabPane tab='你的仓库' key='1'>
                        {
                            repos.map(repo => <Repo repo={repo} key={repo.id}/>)
                        }
                    </Tabs.TabPane>
                    <Tabs.TabPane tab='你的关注' key='2'>
                        {
                            starred.map(repo => <Repo repo={repo} key={repo.id}/>)
                        }
                    </Tabs.TabPane>
                </Tabs>
            </Content>
            <style jsx>{`
                .user-info {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-size: 14px;
                }
                .user-login {
                    font-size: 22px;
                    font-weight: bold;
                }
                .user-email a {
                    margin-left: 10px;
                }
            `}</style>
        </Layout>
    )
}

Index.getInitialProps = async ({ ctx, store, }) => {
    let { user, } = store.getState()
    if (!user.id) {
        return { isLogin: false, }
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
    const { data: repos, } = await api.request(
        {
            url: '/user/repos',
        },
        ctx.req,
        ctx.res,
    )
    const { data: starred, } = await api.request(
        {
            url: '/user/starred',
        },
        ctx.req,
        ctx.res,
    )
    return {
        isLogin: true,
        repos,
        starred,
    }
}

export default withRouter(connect(state => ({
    user: state.user,
}))(Index))
