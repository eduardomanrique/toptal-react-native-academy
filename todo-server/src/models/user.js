const db = require('../config/database').userDB;
const _ = require('lodash');
const md5 = require('md5');
const { toPromise } = require('../helpers/util');

const VALID_USERNAME_PATTERN = /^[A-Za-z]+(?:[_\-A-Za-z0-9]+)*$/;

const create = (user) => {
    if (_.isEmpty(user.name) || !VALID_USERNAME_PATTERN.exec(user.name)) {
        throw new Error('Invalid username');
    }
    if(_.isEmpty(user.password) || user.password.length < 8){
        throw new Error('Invalid password');
    }
    user.password = md5(user.password);
    return toPromise((callback) => db.insert(user, callback));
}

const get = (name) => toPromise((callback) => db.findOne({ name }, callback));

const listAll = () => toPromise((callback) => db.find({}).projection({ password: 0 }).sort({ name: 1}).exec(callback));

module.exports = { create, get, listAll };