const auth = require('./auth');
const cards = require('./cards');

exports.login = auth.login;
exports.signup = auth.signup;
exports.jwtAuth = auth.jwtAuth;
exports.getCards = cards.getCards;