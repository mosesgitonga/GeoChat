const redis = require('redis');

class RedisClient {
    constructor() {
        this.redisClient = redis.createClient({
            legacyMode: true,
            host: 'localhost',
            port: 5001
        });

        this.redisClient.connect()
        // Connect to Redis server automatically upon creation
        this.redisClient.on('connect', () => {
            console.log('Redis Connected');
        });

        // Error handling for Redis connection
        this.redisClient.on('error', (error) => {
            console.error('Redis Error:', error);
        });
    }

    async set(key, value, expiry = null) {
        try {
            const result = await new Promise((resolve, reject) => {
                if (expiry) {
                    this.redisClient.set(key, value, 'EX', expiry, (err, reply) => {
                        if (err) reject(err);
                        else resolve(reply);
                    });
                } else {
                    this.redisClient.set(key, value, (err, reply) => {
                        if (err) reject(err);
                        else resolve(reply);
                    });
                }
            });
            return result;
        } catch (error) {
            console.error('Redis Set Error:', error);
            throw error;
        }
    }

    async get(key) {
        try {
            const result = await new Promise((resolve, reject) => {
                this.redisClient.get(key, (err, reply) => {
                    if (err) reject(err);
                    else resolve(reply);
                });
            });
            return result;
        } catch (error) {
            console.error('Redis Get Error:', error);
            throw error;
        }
    }

    async addToBlacklist(token, expiry=604800) {
        try {
            await this.set(token, 'blacklisted', expiry);
        } catch (error) {
            console.error('Redis Blacklist Error:', error);
            throw error;
        }
    }

    async isTokenBlacklisted(token) {
        try {
            const exists = new Promise((resolve, reject) => {
                console.log('ksksk')
                this.redisClient.exists(token, (error, reply) => {
                    if (error) reject( error);
                    else resolve(reply === 1);
                });
            })
     
            return exists;
        } catch (error) {
            console.error('Redis Exists Error:', error);
            throw error;
        }
    }
}

module.exports = RedisClient;