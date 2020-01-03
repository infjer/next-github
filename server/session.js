const getRedisSessionId = sid => `ssid:${sid}`

class RedisSessionStore {
    constructor (client) {
        this.client = client
    }
    async get (sid) {
        const id = getRedisSessionId(sid)
        const data = await this.client.get(id)
        if (!data) return null
        try {
            let result = JSON.parse(data)
            return result
        } catch (e) {

        }
    }
    async set (sid, session, ttl = 0) {
        const id = getRedisSessionId(sid)
        const t = Math.ceil(ttl / 1000)
        try {
            const data = JSON.stringify(session)
            await this.client.set(id, data)
            // if (t) {
            //     await this.client.setex(id, data, t)
            // } else {
            //     await this.client.set(id, data)
            // }
        } catch (e) {
            console.log(e)
        }
    }
    async destroy (sid) {
        const id = getRedisSessionId(sid)
        await this.client.del(id)
    }
}

module.exports = RedisSessionStore
