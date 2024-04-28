const jwt = require('jsonwebtoken');
const RedisClient = require('../utils/redis');

const redisClient = new RedisClient();

const authenticateToken = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    console.log('running');
    if (!accessToken) {
        console.log('cookie: unauthorized');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Verifying access token
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(accessToken, process.env.ACCESS_SECRET_TOKEN, (error, decoded) => {
                if (error) reject(error);
                else resolve(decoded);
            });
        });

        // Check if token is blacklisted
        try {
            const isBlacklisted = await redisClient.isTokenBlacklisted(accessToken);
            if (isBlacklisted) {
                console.error('Token has expired');
                return res.status(401).json({ error: 'Access token is expired' });
            }

            // Proceed to next route handler
            next();
        } catch (redisError) {
            console.error('Error checking Redis blacklist', redisError);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } catch (error) {
        console.log('Error verifying access token', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = authenticateToken;