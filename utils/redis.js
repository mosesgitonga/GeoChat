const redis = require('redis')


class RedisClient {
    constructor() {
        this.redisClient = redis.createClient({
            legacyMode: true,
            host: 'localhost',
            port: 5001
        })

        this.redisClient.connect()
    }

    async connectRedis() {
        return new Promise((resolve, reject) => {
            this.redisClient.on('connect', () => {
                console.log('Redis Connected')
                resolve()
            })

            this.redisClient.on('error', (error) => {
                console.error(error)
                reject(error)
            })
        })
    }

    async set(key, value) {
        return new Promise((resolve, reject) => {
            this.redisClient.set(key, value, (err, reply) => {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    resolve(reply)
                }
            })
        })
    }

    async get(key, value) {
        return new Promise((resolve, reject) => {
            this.redisClient.get(key, (err, reply) => {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    resolve(reply)
                }
            })
        })
    }

    async addToBlackList(token) {
        this.set(token, 'blacklisted', 'EX', 604800) // exp after 1 week
    }

    async isTokenBlacklisted(token) {
        return new Promise((resolve, reject) => {
            this.redisClient.exists(token, (error, reply) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(reply === 1) //token exists if reply exssts withh 1
                }
            })
        })
    }
}

module.exports = RedisClient;
