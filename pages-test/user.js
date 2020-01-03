import { withRouter, } from 'next/router'

const User = ({ router, common,testprop, }) => {
    return (
        <div>userid:{ router.query.id }, common:{common}, testprop:{testprop}</div>
    )
}

User.getInitialProps = async ctx => {
    return await Promise.resolve({ testprop: 'testprop' })
}

export default withRouter(User)
