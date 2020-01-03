import { Button, } from 'antd'

const Repo = ({ repos, }) => {
    return (
        <>
            {
                repos.map(i => (
                    <Button href={ i.html_url } key={ i.id } target='_blank'>{ i.name }</Button>
                ))
            }
        </>
    )
}

export default Repo
