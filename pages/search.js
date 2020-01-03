import { withRouter, } from 'next/router'

const Search = ({ router, }) => {
    return (
        <span>search: {router.query.q}</span>
    )
}
Search.getInitialProps = () => new Promise(resolve => {
    setTimeout(() => resolve({}), 3000)
})

export default withRouter(Search)
