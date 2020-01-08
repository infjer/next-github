import { withRouter, } from 'next/router'

const User = ({ router, }) => {
    return (
        <div>
            <span>user: {router.query.u}</span>
            <span>tab: {router.query.t}</span>
        </div>

    )
}

export default withRouter(User)
