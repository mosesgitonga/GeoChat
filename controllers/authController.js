const UsersController = require('./usersController')
const DbClient = require('../utils/db')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const RedisClient = require('../utils/redis')
const dbClient = new DbClient();

const redisClient = new RedisClient()

const setAccessTokenCookie = (res, token, email) => {
    const options = {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 //1 week
        }

    res.cookie('accessToken', token, options)
    res.cookie('email', email, options)
}

class AuthController {
    static async login(req, res) {
        const { email, password } = req.body
        if (!email || !password) {
            console.log('unable to get email and passwrd for login')
            res.status(400).json({ error: 'Missing email or passoword'})
            return
        }
        
        try {
            const user = await dbClient.getUserByEmail(email)
            if (!user) {
                console.error(`unable to get user from email ${user}, ${email}`)
                res.status(400).json({ error: 'user does not exist'})
                return
            }

            const hashedPassword = user.password
            const passwordMatch = await bcrypt.compare(password, hashedPassword);
            if (!passwordMatch) {
                console.log('Wrong password')
                res.status(401).json({ error: 'unauthorized' })
                return
            }

            const payload = {
                userId: user._id,
                email: user.email
            }
            const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, {expiresIn: '1w'})

            req.session.userId = user._id
            req.session.username = user.username
            
            setAccessTokenCookie(res, accessToken, user.email)
            console.log('The user made it to the homepage')
            res.status(200).json({ message: 'login is successful', userId: user._id})         
        } catch(error) {
            console.error(error)
            res.status(500).json({ error: 'internal server error' })
            return
        }
    }

    static async logout(req, res) {
        try {
            const accessToken = req.cookies.accessToken;
            if (!accessToken) {
                console.log('no access token')
                res.status(401).json({ error: 'missing token' })
                return
            }
            redisClient.addToBlackList(accessToken)

            res.clearCookie('accessToken')
            res.clearCookie('email')

            res.redirect('/api/login')
        } catch(error) {
            console.log('error while logging out', error)
            res.status(500).json({ error: 'Internal server error' })
            return
        }
    }
}

module.exports = AuthController
