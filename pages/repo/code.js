import _ from 'lodash'
import { withRouter, } from 'next/router'
import { useState, } from 'react'
import { connect, } from 'react-redux'
import { Select, } from 'antd'
import Link from 'next/link'
import { request, } from '../../lib/api.js'
import { List, } from 'antd'
import { Base64, } from 'js-base64'

const { Option, } = Select

const Code = ({ router, branch, tree, raw, }) => {
    let [ current_branch, set_branch, ] = useState('master')
    const onChange = val => {
        set_branch(() => val)
    }
    if (raw) {
        return <div>{ raw }</div>
    }
    return (
        <div>
            <Select
                showSearch
                allowClear
                style={{ width: 300, }}
                value={ current_branch }
                placeholder='select branch'
                optionFilterProp='children'
                onChange={ onChange }
                filterOption={ (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
                >
                    {
                        _.map(branch, i => <Option value={ i.name } key={ i.name }>{ i.name }</Option>)
                    }
            </Select>
            <List
                size='small'
                dataSource={ tree }
                renderItem={
                    i => {
                        let { o, r, t, b, s, d, } = router.query
                        if (i.type === 'tree') {
                            return (
                                <List.Item key={ i.sha }>
                                    <Link
                                        href={ `/repo/code?o=${o}&r=${r}&t=trees&b=${current_branch}&s=${i.sha}&d=${i.path}` }
                                        as={ `/repo/code/${o}/${r}/trees/${current_branch}/${i.sha}/${i.path}` }
                                        >
                                        <a>{ i.path }</a>
                                    </Link>
                                </List.Item>
                            )
                        } else if (i.type === 'blob') {
                            return (
                                <List.Item key={ i.sha }>
                                    <Link
                                        href={ `/repo/code?o=${o}&r=${r}&t=blobs&b=${current_branch}&s=${i.sha}&d=${i.path}` }
                                        as={ `/repo/code/${o}/${r}/blobs/${current_branch}/${i.sha}/${i.path}` }
                                        >
                                        <a>{ i.path }</a>
                                    </Link>
                                </List.Item>
                            )
                        } else {
                            return <List.Item key={ JSON.stringify(i) }><a>{ JSON.stringify(i) }</a></List.Item>
                        }
                    }
                }
                >
            </List>
            <br/><span>o: {router.query.o}</span>
            <br/><span>r: {router.query.r}</span>
            <br/><span>t: {router.query.t}</span>
            <br/><span>b: {router.query.b}</span>
            <br/><span>s: {router.query.s}</span>
            <br/><span>d: {router.query.d}</span>
        </div>

    )
}

Code.getInitialProps = async ({ ctx, }) => {
    let { o, r, t = 'trees', b = 'master', s, d, } = ctx.query
    let branch = []
    const getBranch = async (page = 1, per_page = 100) => {
        let { data, } = await request({
            url: `/repos/${o}/${r}/branches?per_page=${per_page}&page=${page}`
        }, ctx.req, ctx.res)
        return data
    }
    let page = 1
    let per_page = 100
    let result = []
    do {
        result = await getBranch(page++, per_page)
        branch = [ ...branch, ...result, ]
    } while (result.length === per_page)
    // const { data: branch, } = await request({
    //     url: `/repos/${o}/${r}/branches`
    // }, ctx.req, ctx.res)
    // console.log(branch)
    if (!s) {
        s = _.find(branch, { name: b, }).commit.sha
    }
    const res = await request({
        url: `/repos/${o}/${r}/git/${t}/${s}`
    }, ctx.req, ctx.res)
    if (t === 'blobs') {
        console.log(res)
        return { branch, raw: res, }
    }
    let { data: { tree, }, } = res
    return { branch, tree, }
}

export default withRouter(Code)
