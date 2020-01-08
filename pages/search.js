import { withRouter, } from 'next/router'
import Link from 'next/link'
import { List, } from 'antd'
import { request, } from '../lib/api.js'

const SIZE = 20

const Search = ({ router, repos, }) => {
    return (
        <List
            header={ <div>总计{ repos.total_count }个仓库</div> }
            pagination={{
                pageSize: SIZE,
                total: Math.min(repos.total_count, 1000),
                onChange: page => {
                    router.push(`/search?q=${router.query.q}&page=${page}`)
                },
            }}
            dataSource={ repos.items }
            renderItem={
                item => (
                    <List.Item
                        key={ item.id }
                        >
                            <Link href={ `/repo/code?o=${item.owner.login}&r=${item.name}` } as={ `/repo/code/${item.owner.login}/${item.name}` }>
                                <a>{ item.full_name }</a>
                            </Link>
                    </List.Item>
                )
            }
            >
        </List>
    )
}

Search.getInitialProps = async ({ ctx, }) => {
    const { q, sort, lang, order = 'desc', page, } = ctx.query
    if (!q) {
        return {
            repos: {
                total_count: 0,
            },
        }
    }
    let query = `?q=${q}`
    if (lang) {
        query += `+language:${lang}`
    }
    if (sort) {
        query += `+sort:${sort}&order=${order}`
    }
    if (page) {
        query += `&page=${page}`
    }
    query += `&per_page=${SIZE}`
    const result = await request({
        url: `/search/repositories${query}`
    }, ctx.req, ctx.res)
    return { repos: result.data, }
}

export default withRouter(Search)
