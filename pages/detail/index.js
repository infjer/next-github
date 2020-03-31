import WithRepoBasic from '../../components/WithRepoBasic.js'
import api from '../../lib/api.js'
import MdRender from '../../components/MdRender.js'

const Detail = ({ readme, }) => {
    return (
        <MdRender content={ readme.content } isBase64={ true } />
    )
}

Detail.getInitialProps = async ({ ctx: { query: { owner, name, }, }, req, res, }) => {
    const readme = await api.request({
        url: `/repos/${owner}/${name}/readme`,
    }, req, res)
    console.log(readme.data)
    return {
        readme: readme.data,
    }
}

export default WithRepoBasic(Detail, 'index')
