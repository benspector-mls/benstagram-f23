const env = process.env.NODE_ENV || 'development';
console.log(env);
const config = require('../knexfile')[env];
module.exports = require('knex')(config);
