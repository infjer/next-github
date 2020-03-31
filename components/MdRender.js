import { memo, useMemo, } from 'react'
import MarkdownIt from 'markdown-it'
import 'github-markdown-css'

const md = new MarkdownIt({
    html: true,
    linkify: true,
})

const base642utf8 = str => decodeURIComponent(escape(atob(str)))

export default memo(({ content, isBase64, }) => {
    const markdown = isBase64 ? base642utf8(content) : content
    const html = useMemo(() => md.render(markdown), [ markdown, ])
    return (
        <div className='markdown-body'>
            <div dangerouslySetInnerHTML={{ __html: html, }}></div>
        </div>
    )
})
