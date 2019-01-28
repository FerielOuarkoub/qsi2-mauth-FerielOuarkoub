const omit = require('lodash.omit');
const { Users } = require('../model');
const logger = require('../logger');

const createUser = ({ firstName, lastName, email, password }) =>
  Users.create({
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    hash: password
  }).then(user =>
    omit(
      user.get({
        plain: true
      }),
      Users.excludeAttributes
    )
  );

const updateUser = (userId, { firstName, lastName, email, password }) =>
  Users.update({
    id: userId,
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    hash: password
  }, { where: { id: userId } }).then(user =>
    omit(

    )
  ).catch(err => {
    logger.error(`💥 Failed to update user : ${err.stack}`);
  });

const loginUser = ({ email, password }) =>
  Users.findOne({
    where: {
      email
    }
  }).then(user =>
    user && !user.deletedAt
      ? Promise.all([
        omit(
          user.get({
            plain: true
          }),
          Users.excludeAttributes
        ),
        user.comparePassword(password)
      ])
      : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  );

const getUser = ({ id }) =>
  Users.findOne({
    where: {
      id
    }
  }).then(user =>
    user && !user.deletedAt
      ? omit(
        user.get({
          plain: true
        }),
        Users.excludeAttributes
      )
      : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  );

const deleteUser = (user) => {
  user.deletedAt = new Date();
  return Users.update(user, { where: { id: user.id }, returning: true }).then(user =>
    omit(
    )
  ).catch(err => {
    logger.error(`💥 Failed to delete user : ${err.stack}`);
  })
};
module.exports = {
  createUser,
  updateUser,
  getUser,
  loginUser,
  deleteUser
};
