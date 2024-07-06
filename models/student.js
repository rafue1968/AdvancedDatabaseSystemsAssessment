const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create a schema in mongoose
const studentSchema = new Schema({
    studentName: {
        type: String,
        required: true
    },
    StudentContactNo: {
        type: String,
        required: true
    },
    dateofbirth: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    ethnicity: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    enrollmentDate: {
        type: String,
        required: true
    },
    degreetype: {
        type: String,
        required: true
    },
    currentCourse: {
        type: String,
        required: true
    },
    currentUni: {
        type: String,
        required: true
    },
    currentAddress: {
        type: String,
        required: true
    },
    currentCity: {
        type: String,
        required: true
    },
    emergencyContactName: {
        type: String,
        required: true
    },
    emergencyContactRelation: {
        type: String,
        required: true
    },
    emergencyContactPhone: {
        type: String,
        required: true
    },
    emergencyContactEmail: {
        type: String,
        required: true
    }
}, {timestamps: true});


//create model in mongoose
const Student = mongoose.model('Student', studentSchema);

//export model
module.exports = Student;



//Testing
// const mongoose = require('mongoose');

// const studentSchema = new mongoose.Schema({
//     studentName: String,
//     studentEmail: String
// });

// module.exports = mongoose.model('Student', studentSchema);