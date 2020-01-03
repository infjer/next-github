import { Spin, Icon, } from 'antd'

export default () => {
    return (
        <div className='loading-root'>
            <Spin indicator={ <Icon type='loading' spin /> } size='large' />
            <style jsx>{`
                .loading-root {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0 ,0 ,0.2);
                    z-index: 10001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div>
    )
}
