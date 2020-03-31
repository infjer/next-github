import { isValidElement, useEffect, } from 'react'
import { withRouter, } from 'next/router'
import api from '../lib/api.js'
import { Row, Col, List, Pagination, } from 'antd'
import Link from 'next/link'
import Router from 'next/router'
import Repo from '../components/Repo.js'
import { cacheArray, } from '../lib/repoCache.js'

const LANGUAGES = [ 'JavaScript', 'TypeScript', 'Java', 'Python', 'C', 'Ruby', ]
const SORT_TYPES = [
    {
        name: 'best match',
    },
    {
        name: 'most stars',
        value: 'stars',
        order: 'desc',
    },
    {
        name: 'most forks',
        value: 'forks',
        order: 'desc',
    },
]

const selectedStyle = {
    color: '#e36209'
}

const noop = () => {}

const isServer = typeof window === 'undefined'

const per_page = 20

const FilterLink = ({ name, query, lang, sort, order, page, }) => {
    let qs = `?query=${query}`
    if (lang) {
        qs += `&lang=${lang}`
    }
    if (sort) {
        qs += `&sort=${sort}&order=${order || 'desc'}`
    }
    if (page) {
        qs += `&page=${page}`
    }
    qs += `&per_page=${per_page}`
    const doSearch = config => {
        Router.push({
            pathname: '/search',
            query: {
                query,
                lang,
                sort,
                order,
            },
        })
    }

    return <Link href={ `/search${qs}` }>
        {
            isValidElement(name) ? name : <a>{ name }</a>
        }
    </Link>
}

const Search = ({ router, repos, }) => {
    const { ...querys } = router.query
    const { lang, sort, order, page, } = router.query

    useEffect(() => {
        if (!isServer) {
            cacheArray(repos.items)
        }
    })

    return (
        <div>
            <Row gutter={ 20 }>
                <Col span={ 6 }>
                    <List
                        bordered
                        header={ <span className='list-header'>语言</span> }
                        style={{ marginBottom: 20, }}
                        dataSource={ LANGUAGES }
                        renderItem={ item => {
                            let selected = lang === item
                            return (
                                <List.Item style={ selected ? selectedStyle : null }>
                                {
                                    selected ? <span>{ item }</span> : <FilterLink { ...querys } lang={ item } name={ item } />
                                }
                                </List.Item>
                            )
                        } }
                        >
                    </List>
                    <List
                        bordered
                        header={ <span className='list-header'>排序</span> }
                        style={{ marginBottom: 20, }}
                        dataSource={ SORT_TYPES }
                        renderItem={ item => {
                            let selected = false
                            if (item.name === 'best match' && !sort) {
                                selected = true
                            } else if (item.value === sort && item.order === order) {
                                selected = true
                            }
                            return (
                                <List.Item style={ selected ? selectedStyle : null }>
                                    {
                                        selected ? <span>{ item.name }</span>: <FilterLink { ...querys } sort={ item.value } name={ item.name } order={ item.order } />
                                    }
                                </List.Item>
                            )
                        }}
                        >
                    </List>
                </Col>
                <Col span={ 18 }>
                    <h3>{ repos.total_count }个仓库</h3>
                    {
                        repos.items?.map(repo => <Repo repo={repo} key={ repo.id }/>)
                    }
                    <div>
                        <Pagination
                            pageSize={ per_page }
                            current={ Number(page) || 1 }
                            total={ repos.total_count > 1000 ? 1000 : repos.total_count }
                            onChange={ noop }
                            itemRender={ (page, type, ol) => {
                                const p = type === 'page' ? page : type === 'prev' ? page - 1 : page + 1
                                const name = type === 'page' ? page : ol
                                return <FilterLink { ...querys } page={ p } name={ name } />
                            } }
                            />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

Search.getInitialProps = async ({ ctx, }) => {
    const { query, sort, lang, order, page, } = ctx.query
    if (!query) {
        return {
            repos: {
                total_count: 0,
            },
        }
    }
    let qs = `?q=${query}`
    if (lang) {
        qs += `+language:${lang}`
    }
    if (sort) {
        qs += `&sort=${sort}&order=${order || 'desc'}`
    }
    if (page) {
        qs += `&page=${page}`
    }
    qs += `&per_page=${per_page}`
    const res = await api.request({
        url: `/search/repositories${qs}`,
    }, ctx.req, ctx.res)
    if (!res) {
        return {
            repos: {
                total_count: 0,
            },
        }
    }
    return {
      repos: res.data,
    }
}

export default withRouter(Search)
