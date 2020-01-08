import { Button, } from 'antd'
import Link from 'next/link'

const Repo = ({ repos, }) => {
    return (
        <>
            {
                repos.map(i => (
                    <Link href={ `/detail?u=${i.owner.login}&r=${i.name}` } key={ i.id } as={ `/detail/${i.owner.login}/${i.name}` }>
                        <a>{ i.name }</a>
                    </Link>
                ))
            }
        </>
    )
}

export default Repo
