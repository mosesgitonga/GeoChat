const User = require('../models/users');
const dbClient = require('../utils/db');

class UsersController {
  static async createUser(req, res) {
    try {
      const { firstname, secondname, email, course, cohort, password, location } = req.body;
      // Validation logic...

      // Check if user already exists
      const user = await dbClient.getUserByEmail(email);
      if (user) {
        console.log('User already exists in the database');
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create new user
      const newUser = await User.create({
        firstname,
        secondname,
        email,
        course,
        cohort,
        password,
        location,
      });
      console.log('New user created:', newUser);
      return res.status(201).json({ success: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async listAllUsers(req, res) {
    try {
      // Fetch all users from the database
      const users = await dbClient.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UsersController;

