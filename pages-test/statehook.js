import { useState, useEffect, useReducer, } from 'react'

const reducer = (state, action) => {
    switch (action.type) {
        case 'add':
            return state + 1
        case 'minus':
            return state - 1
        default:
            return state
    }
}

export default () => {
    // const [ count, setCount, ] = useState(0)
    const [ count, setCount, ] = useReducer(reducer, 0)
    useEffect(() => {
        const interval = setInterval(() => {
            // setCount(c => c + 1)
            setCount({ type: 'minus', })
        }, 1000)
        return () => clearInterval(interval)
    }, [])
    return (
        <div>
            <span>{ count }</span>
        </div>
    )
}
