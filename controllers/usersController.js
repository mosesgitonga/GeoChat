const User = require('../models/users')
const DbClient = require('../utils/db')
const bcrypt = require('bcrypt')
const dbClient = new DbClient();
require('dotenv').config();


const setAccessTokenCookie = (res, token, email) => {
    const options = {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    }

    res.cookie('accessToken', token, options)
    res.cookie('email', email, options)
}

class UsersController {
    static async signup(req, res) {
        try {
            const { username, email, course, cohort,imagePath, location} = req.body
            let { password } = req.body

            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Request body is missing or empty' });
            }

            const { country,  region, town, latitude, longitude } = location || {}

            //validate
            if (!username) {
                console.log('no username provided')
                res.status(400).json({ error: 'username not provided'})
                return
            }

            if (!imagePath) {
                console.log('image path not found')
                res.status(400).json({ error: 'image path missing'})
                return
            }
            if (!course || !cohort) {
                console.log('unable to get school credentials')
                res.status(400).json({ error: 'Course credentials are Missing' })
                return
            }
            if (!email) {
                console.log('Missing email')
                res.status(400).json({ error: 'Missing email' })
                return
            }
            if (!password) {
                console.log('unable to get password')
                res.status(400).json({ error: 'password is missing' })
                return
            }

            if (!country || !region || !town) {
                console.log('Country, region or town is missing')
                res.status(400).json({ error: 'Country, region or town missing'})
                return
            }

            if (!longitude || !latitude) {
                //it should not return anything because the latitude longitude are not mandatory
                //this is because the user might not allow us to access his/her location through the api
                console.log('did not recieve the longitude and latitude from google maps api')
            }
            
            // Validate whether user is already stored in the database.
            const ExistingUser = await dbClient.getUserByUsername(username)
            if (ExistingUser) {
                console.log('User already exists in the db')
                res.status(200).json({ error: 'User already exists' })
                return
            }
            const user = await dbClient.getUserByEmail(email)
            if (user) {
                console.log('user already exists in the db')
                res.status(200).json({ error: 'User already exists'})
                return
            } else {
                try {
                    //hash password
                    const saltRounds = 10
                    const hashPassword = await bcrypt.hash(password, saltRounds)
                    password = hashPassword

                    const newUser = await User.create({
                        username,
                        email,
                        course,
                        cohort,
                        password,
                        imagePath,
                        location: {
                            country,
                            region,
                            town,
                            latitude,
                            longitude
                        }
                    });

                    if (newUser) {

                    }
                    res.status(201).json({ Success: `created new User ${newUser}`})
                } catch(error) {
                    console.log('Error: Unable to create user', error)
                    res.status(500).json({ error: 'internal server error' })
                }
            }
            
        } catch(error) {
            console.log(error)

        }
    }

    static async getSpecificUser(req, res) {
        const username = req.params.username
        if (!username) {
            console.log('No username provided in the parameters')
            res.status(400).json({ error: 'no username provided in the parameters' })
            return
        }
        if (!username) {
            console.log('no username in the parameters')
        }
        try {
            const user = await dbClient.getUserByUsername(username)
            console.log(user)
            if (!user) {
                console.log('unable to fetch the user')
                res.status(400).json({ error: `Unable to fetch the user ${username}`})
                return
            }

            res.status(200).json({ user: user})
        } catch(error) {
            console.log(error)
            res.status(500).json({ error: 'Internal server error'})
    
        }
    }

    static async listAllUsers(req, res) {
        try {
            const allUsers = await dbClient.getUsersBy()
            if (!allUsers) {
                console.log('unable to get users')
            } else {
                res.status(200).json({ users: allUsers })
            }
        } catch(error) {
            console.log(error)
            res.status(500).json({ error: 'Internal server error'})
        }
        
    }

    static async listUsersByCountry(req, res) {
      try {
        const { country, page } = req.query;
        const pageNum = page || 0;
        const limit = 10;

        if(!country) {
          return res.status(400).json({ error: 'Country parameter is required' });
        }
        const pageNumber = parseInt(page);
        const skip = pageNumber * limit;

        const usersByCountry = await User.aggregate([
          { $match: { 'location.country': country } },
          { $sample: { size: limit } },
          { $skip: skip },
          { $limit: limit }
        ]);

        res.json(usersByCountry);
      } catch (error) {
          console.error('Error fetching users:', error);
          res.status(500).json({ error: 'Internal server error' });
      }
    }

    static async listUsersByRegion(req, res) {
      try {
        const { country, region, page } = req.query;
        const pageNum = page || 0;
        const limit = 10;

        if(!country || !region) {
          return res.status(400).json({ error: 'Country and region parameter are required' });
        }
        const pageNumber = parseInt(page);
        const skip = pageNumber * limit;

        const usersByRegion = await User.aggregate([
          { $match: { 'location.country': country, 'location.region': region } },
          { $sample: { size: limit } },
          { $skip: skip },
          { $limit: limit }
        ]);

        res.json(usersByRegion);
      } catch (error) {
          console.error('Error fetching users:', error);
          res.status(500).json({ error: 'Internal server error' });
      }
    }

    static async listUsersByTown(req, res) {
      try {
        const { country, region, town, page } = req.query;
        const pageNum = page || 0;
        const limit = 10;

        if(!country || !region || !town) {
          return res.status(400).json({ error: 'Country, region and town parameter are required' });
        }
        const pageNumber = parseInt(page);
        const skip = pageNumber * limit;

        const usersBytown = await User.aggregate([
          { $match: { 'location.country': country, 'location.region': region, 'location.town': town } },
          { $sample: { size: limit } },
          { $skip: skip },
          { $limit: limit }
        ]);

        res.json(usersBytown);
      } catch (error) {
          console.error('Error fetching users:', error);
          res.status(500).json({ error: 'Internal server error' });
      }
    }
}


module.exports = UsersController;

