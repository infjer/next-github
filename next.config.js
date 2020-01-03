const config = require('./config.js')
const withCss = require('@zeit/next-css')

if (typeof require !== 'undefined') {
    require.extensions['.css'] = file => {}
}

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'

module.exports = withCss({
    publicRuntimeConfig: {
        GITHUB_OAUTH_URL,
        OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${config.client_id}&scope=${SCOPE}`
    }
})
