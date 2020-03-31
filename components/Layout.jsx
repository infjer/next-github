import { useState, useCallback, } from 'react'
import { Layout, Button, Input, Avatar, Row, Col, Tooltip, Dropdown, Menu, } from 'antd'
import { GithubOutlined, UserOutlined, } from '@ant-design/icons'
import { connect, } from 'react-redux'
import getConfig from 'next/config'
import Container from './Container.js'
import { logout, } from '../store/action.js'
import { withRouter, } from 'next/router'
import Link from 'next/link'

const { Header, Content, } = Layout
const { publicRuntimeConfig, } = getConfig()

const layout = ({ children, user = {}, logout, router, }) => {
    const query = router.query?.query ?? ''
    let [ search, setSearch, ] = useState(query)

    let handleSearchChange = useCallback(e => {
        setSearch(e.target.value)
    }, [ setSearch, ])

    let handleSearch = useCallback(() => {
        router.push(`/search?query=${search}`)
    }, [ search, ])

    let handleLogout = useCallback(() => {
        logout()
    }, [ logout, ])

    const Logout = (
        <Menu>
            <Menu.Item>
                <Button type='link' onClick={ handleLogout }>退出登录</Button>
            </Menu.Item>
        </Menu>
    )

    return (
        <Layout>
            <Header>
                <Container renderer={ <Row align='middle' justify='center'/> }>
                    <Col span={ 2 }>
                        <div style={{ display: 'flex', }}>
                            <GithubOutlined style={{ fontSize: '40px', color: '#fff', lineHeight: '40px', }}/>
                        </div>
                    </Col>
                    <Col span={ 8 }>
                        <Input.Search placeholder='search' value={ search } onChange={ handleSearchChange } onSearch={ handleSearch }/>
                    </Col>
                    <Col span={ 2 } offset={ 12 }>
                        {
                            user.id ? (
                                <Dropdown overlay={ Logout }>
                                    <Avatar size={ 40 } src={ user.avatar_url }/>
                                </Dropdown>
                            ) : (
                                <Tooltip title='立即登录'>
                                    <a href={ publicRuntimeConfig.OAUTH_URL + `&redirect_uri=http://localhost:3000/auth?redirect=${router.asPath}` }>
                                        <Avatar size={ 40 } icon={ <UserOutlined /> }/>
                                    </a>
                                </Tooltip>
                            )
                        }
                    </Col>
                </Container>
            </Header>
            <Content>
                <Container renderer={ <div style={{ padding: '20px 0', }} /> }>{ children }</Container>
            </Content>
            <style jsx global>{`
                #__next {
                    height: 100%;
                }
                .ant-layout {
                    min-height: 100%;
                }
                .ant-layout-header {
                    padding: 0;
                }
            `}</style>
        </Layout>
     )
}

export default connect(
    state => ({
        user: state.user,
    }),
    dispatch => ({
        logout: () => dispatch(logout())
    })
)(withRouter(layout))
