const Datastore = require('nedb');

const userDB = new Datastore({ filename: '../db/user.db' });
userDB.ensureIndex({ fieldName: 'name', unique: true });
userDB.loadDatabase((err) => {});

const todoDB = new Datastore({ filename: '../db/todo.db' });
todoDB.loadDatabase((err) => {});

module.exports = { userDB, todoDB };