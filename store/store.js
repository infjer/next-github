import { createStore, combineReducers, applyMiddleware, } from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools, } from 'redux-devtools-extension'

const user = {}

const userReducer = (state = user, action) => {
    switch (action.type) {
        case 'LOGOUT':
            return {}
        default:
            return state
    }
}

const reducer = combineReducers({
    user: userReducer,
})

export default (state = {}) => {
    const store = createStore(
        reducer,
        { ...user, ...state, },
        composeWithDevTools(applyMiddleware(ReduxThunk)),
    )
    return store
}
