import { useState, useCallback, useRef, } from 'react'
import { Select, Spin, } from 'antd'
import api from '../lib/api.js'
import _ from 'lodash'

const SearchUser = ({ onChange, value, }) => {
    const lastFetchIdRef = useRef(0)
    const [ fetching, setFetching, ] = useState(false)
    const [ options, setOptions, ] = useState([])
    const fetchUser = useCallback(_.debounce(async v => {
        lastFetchIdRef.current += 1
        const fetchId = lastFetchIdRef.current
        setFetching(true)
        setOptions([])
        let res = await api.request({
            url: `/search/users?q=${v}`
        })
        if (fetchId !== lastFetchIdRef.current) {
            let ops = res.data.items.map(i => ({
                text: i.login,
                value: i.login,
            }))
            setFetching(false)
            setOptions(ops)
        }
    }, 500), [])
    const handleChange = v => {
        setOptions([])
        setFetching(false)
        onChange(v)
    }
    return (
        <div>
            <Select
                style={{ width: 200, }}
                showSearch={ true }
                notFoundContent={ fetching ? <Spin size='small' /> : <span>none</span> }
                fitlerOption={ false }
                allowClear={ true }
                placeholder='创建者'
                onSearch={ fetchUser }
                onChange={ handleChange }
                value={ value }
                >
                {
                    options.map(i => (
                        <Select.Option value={ i.value } key={ i.value }>{ i.text }</Select.Option>
                    ))
                }
            </Select>
        </div>
    )
}

export default SearchUser
