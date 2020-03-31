import WithRepoBasic from '../../components/WithRepoBasic.js'
import api from '../../lib/api.js'
import { Avatar, Button, Select, Spin, } from 'antd'
import { useState, useCallback, useEffect, } from 'react'
import MdRender from '../../components/MdRender.js'
import dayjs from 'dayjs'
import SearchUser from '../../components/SearchUser.js'

const CACHE = {}
const isServer = typeof window === 'undefined'

const Label = ({ label, }) => (
    <>
        <span>{ label.name }</span>
    </>
)

const IssueDetail = ({ issue, }) => {
    return (
        <div>
            <MdRender content={ issue.body } isBase64={ false } />
            <Button href={ issue.html_url } target='_blank'>打开</Button>
        </div>
    )
}

const IssueItem = ({ issue, }) => {
    const [ show, setShow ] = useState(false)
    const toggle = useCallback(() => {
        setShow(i => !i)
    })
    return (
        <div>
            <div>
                <div>
                    <Avatar src={ issue.user.avatar_url } shape='square' size={ 50 } />
                </div>
                <div onClick={ toggle }>
                    <p>{ issue.title }</p>
                    {
                        issue.label.map(i => <Label label={ i } key={ i.id } />)
                    }
                    <p>updated at { dayjs(issue.updated_at).format('YYYY-MM-DD HH:mm:ss') }</p>
                </div>
            </div>
            <div>
                {
                    show ? <IssueDetail issue={ issue } /> : null
                }
            </div>
        </div>
    )
}

const makeQuery = (creator, state, labels) => {
    const arr = []
    if (creator) {
        arr.push(`creator=${creator}`)
    }
    if (state) {
        arr.push(`state=${state}`)
    }
    if (labels?.length > 0) {
        arr.push(`labels=${labels.join(',')}`)
    }
    return `?${arr.join('&')}`
}

const Issues = ({ defaultIssues, labels, owner, name, }) => {
    const [ creator, setCreator, ] = useState()
    const [ state, setState, ] = useState('all')
    const [ label, setLabel, ] = useState([])
    const [ issues, setIssues, ] = useState(defaultIssues)
    const [ fetching, setFetching, ] = useState(false)
    useEffect(() => {
        if (!isServer) {
            CACHE[`${owner}/${name}`] = labels
        }
    }, [ labels, owner, name, ])
    const handleChange = useCallback(v => {
        setCreator(v)
    }, [])
    const handleStateChange = useCallback(v => {
        setState(v)
    }, [])
    const handleLabelChange = useCallback(v => {
        setLabel(v)
    }, [])
    const handleSearch = useCallback(() => {
        setFetching(true)
        try {
            const { data, } = await api.request({
                url: `/repos/${owner}/${name}/issues${makeQuery(creator, state, label, )}`
            })
            setIssues(data)
        } catch (e) {

        } finally {
            setFetching(false)
        }
    }, [ owner, name, creator, state, label, ])
    return (
        <div>
            <SearchUser value={ creator } onChange={ handleChange }/>
            <Select value={ state } onChange={ handleStateChange } style={{ width: 200, }}>
                <Select.Option value='all'>all</Select.Option>
                <Select.Option value='open'>open</Select.Option>
                <Select.Option value='closed'>closed</Select.Option>
            </Select>
            <Select value={ label } onChange={ handleLabelChange } style={{ width: 200, }} mode='multiple'>
                {
                    labels.map(i => (
                        <Select.Option value={ i.name } key={ i.id }>{ i.name }</Select.Option>
                    ))
                }
            </Select>
            <Button disabled={ fetching } onClick={ handleSearch }>搜索</Button>
            <div>
                {
                    fetching ? <div><Spin /></div> : defaultIssues.map(i => <IssueItem issue={ i } key={ i.id } />)
                }
            </div>
        </div>
    )
}

Issues.getInitialProps = async ({ ctx, }) => {
    const { owner, name, } = ctx.query
    const full_name = `${owner}/${name}`
    const { data: issues, } = await api.request({
        url: `/repos/${owner}/${name}/issues`
    }, ctx.req, ctx.res)
    let labels = []
    if (CACHE[full_name]) {
        labels = CACHE[full_name]
    } else {
        let res = await api.request({
            url: `/repos/${owner}/${name}/labels`
        }, ctx.req, ctx.res)
        labels = res.data
    }
    return {
        defaultIssues: issues,
        labels,
        owner,
        name,
    }
}

export default WithRepoBasic(Issues, 'issues')
