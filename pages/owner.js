import { withRouter, } from 'next/router'

const Owner = ({ router, }) => {
    return (
        <div>
            <span>owner: {router.query.o}</span>
            <span>tab: {router.query.t}</span>
        </div>

    )
}

export default withRouter(Owner)
