import { useContext, } from 'react'
import MyContext from '../lib/mycontext.js'

export default () => {
    const context = useContext(MyContext)
    return (
        <span>{context}</span>
    )
}
