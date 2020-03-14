import { withRouter, } from 'next/router'
import api from '../lib/api.js'
import { Row, Col, List, } from 'antd'
import Link from 'next/link'
import Router from 'next/router'
import Repo from '../components/Repo.js'

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
    borderLeft: '1px solid #e36209',
}

const FilterLink = ({ name, query, lang, sort, order, }) => {
    let qs = `?query=${query}`
    if (lang) {
        qs += `&lang=${lang}`
    }
    if (sort) {
        qs += `&sort=${sort}&order=${order || 'desc'}`
    }
    // if (page) {
    //     qs += `&page=${page}`
    // }
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

    return <Link href={ `/search${qs}` }><a>{ name }</a></Link>
}

const Search = ({ router, repos, }) => {
    const { ...querys } = router.query
    const { lang, sort, order, } = router.query
    return (
        <div>
            <span>search: {router.query.q}</span>
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
                        repos.items.map(repo => <Repo repo={repo} key={ repo.id }/>)
                    }
                </Col>
            </Row>
        </div>
    )
}

Search.getInitialProps = async ({ ctx, }) => {
    const { query, sort, lang, order, page, } = ctx.query
    console.log(ctx.query)
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
    const res = await api.request({
        url: `/search/repositories${qs}`,
    }, ctx.req, ctx.res)
    console.log(res)
    return {
      repos: res.data,
    }
}

export default withRouter(Search)
