import { useState, useReducer, memo, useMemo, useCallback, useRef, } from 'react'

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

const Child = memo(({ config, onClick, }) => {
    console.log('Child render')
    return (
        <button onClick={ onClick } style={{ color: config.color, }}>{ config.text }</button>
    )
})

const optimize = () => {
    const [ name, setName, ] = useState('myname')
    const [ count, dispatchCount, ] = useReducer(reducer, 0)
    const config = useMemo(() => ({
        text: `count is ${count}`,
        color: count > 3 ? 'red' : 'blue',
    }), [ count, ])
    const ref = useRef()
    ref.current = count
    // dispatchCount可传可不传
    const onClick = useCallback(() => dispatchCount({ type: 'add', }), [ dispatchCount, ])
    const asyncAlert = useCallback(() => {
        setTimeout(() => {
            // count是闭包中的值
            console.log(count)
            // ref在2次函数执行时是同一个变量，指向最新的count
            console.log(ref.current)
        }, 2000)
    })
    return (
        <div>
            <input value={ name } onChange={ e => setName(e.target.value) }/>
            <Child onClick={ onClick } config={ config }/>
            <button onClick={ asyncAlert }>async alert</button>
        </div>
    )
}

export default optimize
