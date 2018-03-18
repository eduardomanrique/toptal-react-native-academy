import User from '../models/user';

module.exports = (req, res, next) => {
    const user = await User.get(req.params.username);
    if (user && req.params.token === user.token) {
        next();
    } else {
        res.status(401).end();
    }
}