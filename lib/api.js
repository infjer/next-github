const axios = require('axios')

const GITHUB_API_BASE_URL = 'https://api.github.com'
const isServer = typeof window === 'undefined'

const requestGithub = async (method, url, data, headers) => {
    let result = await axios({
        method,
        url: `${GITHUB_API_BASE_URL}${url}`,
        data,
        headers,
    })
    return result
}

const request = async ({ method = 'GET', url, data = {}, }, req, res) => {
    if (!url) {
        throw Error('url is neccessary')
    }
    if (isServer) {
        const { access_token, token_type, } = req.session.auth || {}
        const headers = {
            Authorization: `${token_type} ${access_token}`,
        }
        return await requestGithub(method, url, data, headers)
    } else {
        return await axios({
            method,
            url: `/github${url}`,
            data,
        })
    }
}

module.exports = {
    request,
    requestGithub,
}
