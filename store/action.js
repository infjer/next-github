import axios from 'axios'

const add = (num = 1) => ({
    type: 'ADD',
    num,
})

const asyncAdd = num => dispatch => setTimeout(() => dispatch(add(num)), 2000)

const update = name => ({
    type: 'UPDATE',
    name,
})

const logout = () => dispatch => {
    axios.post('logout').then(res => {
        if (res.status === 200) {
            dispatch({
                type: 'LOGOUT'
            })
        } else {
            console.log('登出失败')
        }
    })
}

export {
    add,
    asyncAdd,
    update,
    logout,
}
