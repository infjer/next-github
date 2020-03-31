import Link from 'next/link'
import Repo from './Repo.js'
import api from '../lib/api.js'
import { withRouter, } from 'next/router'
import { get, set, } from '../lib/repoCache.js'
import { useEffect, } from 'react'

const makeQuery = qo => {
    const query = Object.entries(qo).reduce((r, e) => {
        r.push(e.join('='))
        return r
    }, []).join('&')
    return `?${query}`
}

const isServer = typeof window === 'undefined'

export default function (Comp, type = 'index' ) {
    const WithDetail = ({ repoBasic, router, ...rest }) => {
        const query = makeQuery(router.query)

        useEffect(() => {
            if (!isServer) {
                set(repoBasic)
            }
        })

        return (
            <div>
                <div>
                    <Repo repo={ repoBasic } />
                    <div className='tabs'>
                        {
                            type === 'index' ? <span className='tab'>README</span> : (
                                <Link href={ `/detail${query}` } >
                                    <a>README</a>
                                </Link>
                            )
                        }
                        {
                            type === 'issues' ? <span className='tab'>issues</span> : (
                                <Link href={ `/detail/issues${query}` } >
                                    <a>issues</a>
                                </Link>
                            )
                        }
                    </div>
                </div>
                <div><Comp { ...rest } /></div>
            </div>
        )
    }

    WithDetail.getInitialProps = async context => {
        const { router, ctx, } = context
        const { owner, name, } = ctx.query
        const full_name = `${owner}/${name}`
        let pageData = {}
        if (Comp.getInitialProps) {
            pageData = await Comp.getInitialProps(context)
        }
        let cache = get(full_name)
        if (cache) {
            return {
                repoBasic: cache,
                ...pageData,
            }
        }
        try {
            const { data, } = await api.request({
                url: `/repos/${owner}/${name}`,
            }, ctx.req, ctx.res)
            if (!isServer) {
                set(data)
            }
            return {
                repoBasic: data,
                ...pageData,
            }
        } catch (e) {
            return {
                repoBasic: {},
            }
        }

    }

    return withRouter(WithDetail)
}
