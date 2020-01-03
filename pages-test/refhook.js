import React, { useRef, useEffect, } from 'react'

// class createRef使用方法
// export default class RefHook extends React.Component {
//     constructor (props) {
//         super(props)
//         this.ref = React.createRef()
//     }
//     componentDidMount () {
//         console.log(this.ref.current)
//     }
//     render () {
//         return (
//             <div>
//                 <span ref={ this.ref }>class ref</span>
//             </div>
//         )
//     }
// }

// function useRef使用方法
export default () => {
    const ref = useRef()
    useEffect(() => {
        console.log(ref)
    }, [])
    return (
        <div>
            <span ref={ ref }>function ref</span>
        </div>
    )
}
