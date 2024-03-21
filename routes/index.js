const express = require('express');
const UsersController = require('../controllers/usersController');

const injectRoutes = () => {
    const router = express.Router();

    // POST /api/users
    router.post('/users', UsersController.createUser);

    // GET /api/users/country/:country
    router.get('/users/country/:country', UsersController.getUsersByCountry);

    // GET /api/users/country/:country/region/:region
    router.get('/users/country/:country/region/:region', UsersController.getUsersByCountryAndRegion);

    // GET /api/users/country/:country/region/:region/town/:town
    router.get('/users/country/:country/region/:region/town/:town', UsersController.getUsersByCountryRegionAndTown);

    // DELETE /api/users/delete
    router.delete('/users/delete', UsersController.deleteUser);

    return router;
};

module.exports = injectRoutes;

