const express = require('express');
const hpp = require('hpp');
const helmet = require('helmet');
const enforce = require('express-sslify');
const { apiUsers, apiUsersProtected } = require('./users');
const { isAuthenticated, initAuth } = require('../controller/auth');
const { apiGroup, publicApiGroup } = require('./group');
// create an express Application for our api
const api = express();
initAuth();

// apply a middelware to parse application/json body
api.use(express.json({ limit: '1mb' }));
// create an express router that will be mount at the root of the api
const apiRoutes = express.Router();
apiRoutes
    // test api
    .get('/', (req, res) =>
        res.status(200).send({ message: 'hello from my api' })
    )


    // connect api users router
    .use('/users', apiUsers)
    // api bellow this middelware require Authorization
    .use(isAuthenticated)
    .use('/users', apiUsersProtected)
    .use('/group', apiGroup)
    .use('/group', publicApiGroup)
    .use((err, req, res, next) => {
        res.status(403).send({
            success: false,
            message: `${err.name} : ${err.message}`,
        });
        next();
    });

// root of our API will be http://localhost:5000/api/v1
api.use('/api/v1', apiRoutes);
api.use(hpp());
api.use(helmet());
api.use(enforce.HTTPS());
module.exports = api;