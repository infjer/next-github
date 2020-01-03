import { useState, useCallback, } from 'react'
import { Layout, Button, Icon, Input, Avatar, Row, Col, Tooltip, Dropdown, Menu, } from 'antd'
import { connect, } from 'react-redux'
import getConfig from 'next/config'
import Container from './Container.js'
import { logout, } from '../store/action.js'
import { withRouter, } from 'next/router'
import Link from 'next/link'

const { Header, Content, } = Layout
const { publicRuntimeConfig, } = getConfig()

const layout = ({ children, user = {}, logout, router, }) => {
    const q = router.query?.q ?? ''
    let [ search, setSearch, ] = useState(q)

    let handleSearchChange = useCallback(e => {
        setSearch(e.target.value)
    }, [ setSearch, ])

    let handleSearch = useCallback(() => {
        router.push(`/search?q=${search}`)
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
                        {/* <Link href='/'>
                            <a> */}
                                <Icon type='github' style={{ fontSize: '40px', color: 'white', marginTop: '12px', }}/>
                            {/* </a>
                        </Link> */}
                    </Col>
                    <Col span={ 8 }>
                        <Input.Search placeholder='search' value={ search } onChange={ handleSearchChange } onSearch={ handleSearch }/>
                    </Col>
                    <Col span={ 2 } offset={ 12 }>
                        {
                            user.id ? (
                                <Dropdown overlay={ Logout }>
                                    {/* <Link href='/'>
                                        <a> */}
                                            <Avatar size={ 40 } src={ user.avatar_url }/>
                                        {/* </a>
                                    </Link> */}
                                </Dropdown>
                            ) : (
                                <Tooltip title='立即登录'>
                                    <a href={ publicRuntimeConfig.OAUTH_URL + `&redirect_uri=http://localhost:3000/auth?redirect=${router.asPath}` }>
                                        <Avatar size={ 40 } icon='user'/>
                                    </a>
                                </Tooltip>
                            )
                        }
                    </Col>
                </Container>
            </Header>
            <Content>
                <Container renderer={ <div style={{ padding: 0, }} /> }>{ children }</Container>
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
