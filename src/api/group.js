const express = require('express');
const { createGroup, groupOwner, addMembre } = require('../controller/group');
const logger = require('../logger');
const jwt = require('jwt-simple');

const apiGroup = express.Router();

apiGroup.put('/membre', (req, res) => {
    !req.body.groupId || !req.body.userId
        ? res.status(400).send({
            success: false,
            message: 'grou and user id  are required'
        })
        : !groupOwner(req.user.id, req.body.id)
            ? res.status(403).send({
                success: false,
                message: 'you must be the group owner '
            })

            : addMembre(req.body.userId, req.body.groupId)
                .then(res.status(200).send({
                    success: true,
                    profile: req.user,
                    message: 'member added'
                })
                )
                .catch(err => {
                    logger.error(`💥 Failed to add member : ${err.stack}`);
                    return res.status(500).send({
                        success: false,
                        message: `${err.name} : ${err.message}`
                    });
                })

})


apiGroup.post('/', (req, res) => {
    !req.body.title || !req.body.description
        ? res.status(400).send({
            success: false,
            message: 'title and description  are required'
        })
        : createGroup(req.user.id, req.body)
            .then(res.status(201).send({
                success: true,
                profile: req.user,
                message: 'group created'
            })
            )
            .catch(err => {
                logger.error(`💥 Failed to create group : ${err.stack}`);
                return res.status(500).send({
                    success: false,
                    message: `${err.name} : ${err.message}`
                });
            })
});
module.exports = { apiGroup };