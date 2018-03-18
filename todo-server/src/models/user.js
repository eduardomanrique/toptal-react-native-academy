import db from '../config/database';
import _ from 'lodash';
import md5 from 'md5';
import { toPromise } from '../helpers/util';

const VALID_USERNAME_PATTERN = /^[A-Za-z]+(?:[_\-A-Za-z0-9]+)*$/;

const create = (user) => {
    if (_.isEmpty(user.name) || !VALID_USERNAME_PATTERN.exec(user.name.startsWith)) {
        throw new Error('Invalid username');
    }
    if(_.isEmpty(user.password) || user.password.length < 8){
        throw new Error('Invalid password');
    }
    user.password = md5(user.password);
    return toPromise((callback) => db.insert(user, callback));
}

const saveToken = async (name, token) => {
    const user = await get(name);
    if(user){
        user.token = token;
        return await toPromise((callback) => db.update({ name }, { $set: { token } }, callback));
    }else{
        throw new Error('Setting token on invalid user');
    }
}

const get = (name) => toPromise((callback) => db.findOne({ name }, callback));

export default { create, get, saveToken };