const db = require('../config/database').todoDB;
const _ = require('lodash');
const { toPromise } = require('../helpers/util');
const fs = require('fs');
const mkdirp = require('mkdirp');

const ATTACH_DIR = "../db/attachments";

const get = (id) => toPromise((callback) => db.findOne({name}, callback));

const search = (name) => toPromise((callback) => db
                                .find({name: new RegExp(`^${name}`)})
                                .projection({ password: 0 })
                                .sort({ name: 1 })
                                .exec(callback));

async function update(todoList, username){
    const existing = get(todoList._id);
    if (!existing){
        throw new Error('TODO List does not exist');
    }
    validateUser(todoList, username);
    todoList.username = username;
    await toPromise(cb => db.update({_id: todoList._id}, {$set: todoList}, cb));
}

async function insert(todoList, username){
    todoList.username = username;
    await toPromise(cb => db.insert(todoList, cb));
}

async function addFile(username, todoId, file){
    const todoList = await get(todoId);
    validateUser(todoList, username);
    await execOnFs(() => fs.writeFile(`${ATTACH_DIR}/${username}_${file.name}`, file.content, cb));
    const attachments = (todoList.attachments || []).concat({name: file.name});
    await toPromise(cb => db.update({_id: todoId}, {$set: {attachments}}, cb));
}

async function deleteFile(username, todoId, file){
    const todoList = await get(todoId);
    validateUser(todoList, username);
    await execOnFs(() => fs.unlink(`${ATTACH_DIR}/${username}_${file.name}`, cb));
    const attachments = todoList.attachments.filter(att => att.name !== file.name);
    await toPromise(cb => db.update({_id: todoId}, {$set: {attachments}}, cb));
}

function execOnFs(fn){
    return toPromise(cb => fs.stat(ATTACH_DIR, function (err, stat) {
        if (err.code == 'ENOENT') {
            mkdirp(`${ATTACH_DIR}/${file.name}`, fn);
        } else if (err) {
            reject(err);
            return;
        } else {
            fn();
        }
    }));
}

function validateUser(todoList, username){
    if(todoList.username != username){
        throw new Error('List does not belong to user');
    }
}

module.exports = {
    insert,
    update,
    get,
    search,
    addFile,
    deleteFile
};