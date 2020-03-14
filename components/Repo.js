import Link from 'next/link'
import dayjs from 'dayjs'
import { StarFilled, CodeFilled, QuestionCircleFilled, FileTextFilled, } from '@ant-design/icons'

const Repo = ({ repo, }) => {
    return (
        <div className='repo'>
            <div className='repo-info'>
                <span className='repo-title'>
                    <Link href={ `/detail?owner=${repo.owner.login}&name=${repo.name}` }>
                        <a>{ repo.full_name }</a>
                    </Link>
                </span>
                {
                    repo.description ? <span className='repo-desc'>{ repo.description }</span> : null
                }
                <span className='repo-update'>{ dayjs(repo.updated_at).format('YYYY-MM-DD HH:mm:ss') }</span>
            </div>
            <div className='repo-other-info'>
                <span className='repo-star'><StarFilled />{ repo.stargazers_count }</span>
                <span className='repo-issues'><QuestionCircleFilled />{ repo.open_issues_count }</span>
                {
                    repo.language ? <span className='repo-lang'><CodeFilled />{ repo.language }</span> : null
                }
                {
                    repo.license ? <span className='repo-license'><FileTextFilled />{ repo.license?.spdx_id }</span> : null
                }
            </div>
            <style jsx>{`
                .repo {
                    display: flex;
                    border: 1px solid #434343;
                    border-radius: 4px;
                    margin-bottom: 20px;
                    padding: 10px 20px;
                    min-height: 120px;
                }
                .repo-info {
                    flex: 4 1 0px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .repo-other-info {
                    flex: 1 1 0px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    justify-content: flex-end;
                }
                .repo-title {
                    font-size: 18px;
                }
                .repo-desc {
                    color: rgba(255, 255, 255, 0.45);
                }
            `}</style>
        </div>
    )
}

export default Repo
