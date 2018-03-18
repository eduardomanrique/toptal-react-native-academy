import Datastore from 'nedb';

const db = new Datastore({ filename: '../db/todo.db' });
db.loadDatabase((err) => {});

export default db;