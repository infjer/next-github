import Link from 'next/link'

const Detail = () => {
    return (
        <div>
            <span>this is detail</span>
            <Link href='/' >
                <span>to index</span>
            </Link>
        </div>
    )
}

Detail.getInitialProps = () => new Promise(resolve => {
    setTimeout(() => resolve({}), 3000)
})

export default Detail
