import { useEffect, } from 'react'
import axios from 'axios'
import { withRouter, } from 'next/router'
import { connect, } from 'react-redux'
import { Button, } from 'antd'
import { add, update, } from '../store/action.js'
import getConfig from 'next/config'

const { publicRuntimeConfig: { OAUTH_URL, } } = getConfig()

const Index = ({ user, detail, add, update, }) => {
    useEffect(() => {
        axios.get('/api/user/info').then(r => {
            console.log(r)
        }).catch(e => {
            console.log(e)
        })
    }, [])
    return (
        <div>
            <span>detail id: { detail.id }</span>
            <Button href={OAUTH_URL}>登录</Button>
        </div>
    )
}

Index.getInitialProps = async ({ store, }) => {
    store.dispatch(add(9))
    return {}
}

export default connect(
    ({ user, detail, }) => ({
        user,
        detail,
    }),
    dispatch => ({
        add,
        update,
    })
)(Index)
