import { cloneElement, } from 'react'

const container_style = {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px',
}

export default ({ children, renderer = <div /> }) => {
    let { style = {}, className = '', } = renderer.props
    return cloneElement(renderer, {
        children,
        className: `main-container${className ? ' ' + className : ''}`,
        style: { ...container_style, ...style, },
    })
}
