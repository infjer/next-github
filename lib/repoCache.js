import LRU from 'lru-cache'

const cache = new LRU({
    maxAge: 1000 * 60 * 60,
})

export function set (repo) {
    cache.set(repo.full_name, repo)
}

export function get (full_name) {
    return cache.get(full_name)
}

export function cacheArray (repos) {
    if (Array.isArray(repos)) {
        repos.forEach(repo => set(repo))
    }
}
