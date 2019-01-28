const omit = require('lodash.omit');
const { Group } = require('../model');
const logger = require('../logger');

const createGroup = (userId, { title, description, metadata }) =>
    Group.create({
        title,
        description,
        metadata: metadata || '',
        own_id: userId
    }).then(group =>
        omit(
            group.get({
                plain: true
            }),
            Group.excludeAttributes
        )
    );

const groupOwner = (userId, groupId) =>
    Group.findOne({
        where: {
            id: groupId
        }
    }).then(group => group.own_id == userId);

const addMember = (userId, groupId) =>
    Group.findOne({
        where: {
            id: groupId
        }
    }).then(group => { return group.addUsers(userId) }
    );
const deleteMember = (userId, groupId) =>
    Group.findOne({
        where: {
            id: groupId
        }
    }).then(group => {
        return group.removeUsers(userId);
    }
    );


const getAllGroups = () => Group.findAll();

module.exports = {
    createGroup,
    addMember,
    groupOwner,
    deleteMember,
    getAllGroups
};
