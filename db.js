const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const db = {};

db.mongoose = mongoose;
const Student = require('./models/student.js');
const Role = require('./models/role.model.js');
const User = require('./models/user.model.js');
db.ROLES = ["user", "admin"];

module.exports = db;