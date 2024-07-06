const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require('mongoose');
const multer = require('multer');
const { MongoClient } = require ('mongodb');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const Student = require('./models/student.js');
const Role = require('./models/role.model.js');



//csv
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const results = [];




// const Role = require('./models/role.model.js');
// const User = require('./models/user.model.js');
// const db = require('./db');


//Initialize Express app
const app = express();

//Connecting db atlas with mongoose and node js

// const dbURI = 'mongodb+srv://rafue1968:2qsf9KZFhc5adgbZ@Cluster0/StudentDB';


//Configuring Multure for file uploads

const upload = multer({ dest: 'uploads/' });


//MongoDB Connection URI
const dbURI = 'mongodb+srv://rafue1968:ZqEyclIfddHqcUIh@Cluster0.xzg6ror.mongodb.net/StudentDB';







//RETURN TO THIS IF FAILS
// mongoose.connect(dbURI)
//     .then((result) => app.listen(3000))
//     .catch((err) => console.log(err));


//Middleware configuration
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(morgan('dev'));


//Setting view engine to ejs
app.set('view engine', 'ejs');  //makes 'views' folder the default
app.set('views', path.join(__dirname, 'views'));


//MongoDB Connection
mongoose.connect(dbURI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(3000, () => console.log("Server running on port 3000"));
    })
    .catch(err => console.log(err));


// mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
//     .then((result) => app.listen(3000))
//     .catch((err) => console.log(err));



// var corsOptions ={
//     origin: "http://localhost:3000"
// };

// app.use(cors(corsOptions));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));



//Routes

app.get("/", (req, res) => {
    // res.json( {message: "Welcome to User Authentication Application."});
    res.render('pages/index');
    // res.sendFile(__dirname + '/index.html'); //MAY NEED TO CHANGE THIS
});

//For handling form submission and inserting data into JSON file
app.post('/insert', upload.single('file'), (req, res) => {
    const { studentName, studentId, dateofbirth, nationality } = req.body;
    ///MAY NEED TO ADD MORE (ADD COLUMNS)

    //Creating object from form data
    const userData = {studentName, studentId, dateofbirth, nationality};


    //Reads existing JSON file

    let jsonData = [];

    try{
        jsonData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    } catch (err) {
        console.error('Error reading JSON file:', err);
    }



    //Adds new data to JSON array
    jsonData.push(userData);


    //Writes updated JSON data back to file
    fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2));

    res.send('Data inserted successfully.');

});




app.get('/DBAtlas', (req, res) => {
    res.render('pages/inputsDBAtlas');
})


///Create (GET)
app.get('/add-student', (req, res) => {
    res.render('pages/create.ejs');
});

///Create (POST)
app.post('/add-student', (req, res) => {

    const { studentName, StudentContactNo, dateofbirth, nationality, ethnicity, gender, email, enrollmentDate, degreetype, currentCourse, currentUni, currentAddress, currentCity, emergencyContactName, emergencyContactRelation, emergencyContactPhone, emergencyContactEmail } = req.body;
    // const student = new Student({ studentName, studentId, dateofbirth, nationality});



    const student = new Student({

    //     //FIRST ATTEMPT
    //     // studentName: 'Rafue',
    //     // studentId: '1234567',
    //     // dateofbirth: '16-11-2002',
    //     // nationality: 'Ireland'

        //SECOND ATTEMPT
        studentName,
        StudentContactNo,
        // studentEmail,
        dateofbirth,
        nationality, 
        ethnicity,
        gender, 
        email, 
        enrollmentDate, 
        degreetype, 
        currentCourse, 
        currentUni, 
        currentAddress, 
        currentCity, 
        emergencyContactName, 
        emergencyContactRelation, 
        emergencyContactPhone, 
        emergencyContactEmail
    });

    student.save()
            .then((result) => res.send(result))
            .catch((err) => {
                console.log(err);
                res.status(500).send("Saving Student Error!!!");
            });


    
        // //Creating object from form data
        // const userData = {studentName, studentId, dateofbirth, nationality};


        // //Reads existing JSON file
    
        // let jsonData = [];
    
        // try{
        //     jsonData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
        // } catch (err) {
        //     console.error('Error reading JSON file:', err);
        // }
    
    
    
        // //Adds new data to JSON array
        // jsonData.push(userData);
    
    
        // //Writes updated JSON data back to file
        // fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2));
    
        // res.send('Data inserted successfully.');

    
});


// app.get('/create-student', (req, res) => {
//     res.render('pages/create');
// });

///READ ALL
app.get('/all-students', (req, res) => {
    Student.find()
        //.then((result) => res.send(result))
        .then((students) => {
            res.render('pages/allstudentslist', {students});
        })
        .catch((err) => {
            console.error("Error fetching students:", err);
            res.status(500).send("Error fetching students data");
        });
});


///Will fetch student details by student name
app.get('/single-student/:name', (req, res) => {
    const { name } = req.params;
    Student.findOne({studentName: name})
    .then(student => {
        if (!student){
            return res.status(404).send("Student not found");
        } else {
        res.render('pages/single-student.ejs', {student});
        }
    })
    .catch(err => {
        // console.log(err);
        console.error("Error fetching student:", err);
        res.status(500).send("Error fetching student data!!");
    });
});

// app.get('/single-student/:id', (req, res) => {
//     const { id } = req.params;
//     Student.findById(id)
//         .then((result) => res.send(result))
//         .catch((err) => console.log(err));
// });



///To navigate to search page - for __Update__
app.get('/searchupdate', (req, res) => {
    res.render('pages/search-student');
});

//Update
app.get('/find-student', (req, res) => {
    const { studentName } = req.query;
    Student.findOne({ studentName })
        .then(student => {
            if (!student) {
                return res.status(404).send("Student not found");
            }
            res.render('pages/update.ejs', { student });
        })
        .catch(err => {
            console.error("Error fetching student:", err);
            res.status(500).send("Error fetching student data!!");
        });
});


////Update
app.post('/update-student/:id', (req, res) => {
    const { id } = req.params;
    const { studentName, StudentContactNo, dateofbirth, nationality, ethnicity, gender, email, enrollmentDate, degreetype, currentCourse, currentUni, currentAddress, currentCity, emergencyContactName, emergencyContactRelation, emergencyContactPhone, emergencyContactEmail } = req.body;
    Student.findByIdAndUpdate(id, { studentName, StudentContactNo, dateofbirth, nationality, ethnicity, gender, email, enrollmentDate, degreetype, currentCourse, currentUni, currentAddress, currentCity, emergencyContactName, emergencyContactRelation, emergencyContactPhone, emergencyContactEmail }, { new: true })
        .then(updatedStudent => {
            if (!updatedStudent) {
                return res.status(404).send("Student not found");
            }
            res.send("Student updated successfully");
        })
        .catch(err => {
            console.error("Error updating student:", err);
            res.status(500).send("Error updating student data!!");
        });
});

//To get to Delete page
app.get("/delete-student", (req, res) => {
    res.render('pages/delete-student');
});

app.post('/delete-student', (req, res) => {
    const { studentName } = req.body;
    Student.findOneAndDelete({ studentName })
        .then(deletedStudent => {
            if(!deletedStudent){
                return res.status(404).send("Student not found");
            }
            res.send({ message: "Student deleted successfully"})
        })
        .catch (err => {
            console.error("Error deleting student:", err);
            res.status(500).send("Error deleting student");
        });
});

// ///Remove/Delete
// app.delete('/delete-student/:name', (req, res) => {
//     const { name } = req.params;
//     Student.findOneAndDelete({studentName: name})
//         .then(() => res.send({ message: "Student deleted successfully"}))
//         .catch(err => {
//             console.error("Error deleting student:", err);
//             res.status(500).send("Error deleting student");
//         });
// });





///Inserting data into a JSON file

app.post('/insert-json', (req, res) => {
    const newData = req.body;


    //Reading existing JSON data

    fs.readFile('StudentDB.json', 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error reading JSON file");
        }

        let jsonData = JSON.parse(data);
        jsonData.push(newData);

        ///Writing updated data back to JSON file

        fs.writeFile('StudentDB.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error writing JSON file");
            }
            res.status(200).send("Data inserted into JSON file successfully");
        });

    });


});





app.get('/test', (req, res) => {
    const blogs = [
        {studentName: 'Charles', studentId: '91939', dateofbirth: '12/12/2002'},
        {studentName: 'Tarkin', studentId: '91978', dateofbirth: '10/06/1940'},
        {studentName: 'Bradly', studentId: '10003', dateofbirth: '20/08/2008'},
        {studentName: 'Chris', studentId: '91999', dateofbirth: '14/03/1973'}
    ];
    res.render('index', {title: 'Student Home', blogs: blogs});
});

app.get('/blogs/create', (req, res) => {
    res.render('create', {title: 'Create a student blog'});
});

app.get('/about1', (req, res) => {
    res.render('about', { title: 'About Student Blog'});
});

/////REDIRECTS
app.get('/about-me', (req, res) => {
    res.redirect('about1', {title: 'About Student Blog'});
});
/////

app.use((req, res) => {
    res.status(404).render('pages/404', {title: 'Page not found'});
});

app.get('/import-csv', (req, res) => {

    // fs.readFile("student_data.csv", "utf-8", (err, data) => {
    //     if (err) console.log(err);
    //     else console.log(data);
    // })

    fs.createReadStream("student_data.csv")
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            //console.log(results);
            res.send(results);
        });
});


app.get('/export-csvdata', (req, res) => {
    console.log("Accessing export CSV route");
    Student.find()
        .then((students) =>{

            //For CHECKING
            if (!students.length){
                return res.status(404).send("No students found in the database.")
            }
    
            const csvWriter = createCsvWriter({
                path: 'StudentDB.csv',
                header: [
                    {id: 'studentName', title: 'Student Name'},
                    {id: 'studentId', title: 'Student ID'},
                    {id: 'dateofbirth', title: 'Date of Birth'},
                    {id: 'nationality', title: 'Nationality'}
                ]
            });

            // const records = [
            //     {studentName: 'Charles', studentId: '91939', dateofbirth: '12/12/2002', nationality: 'Ireland'},
            //     {studentName: 'Tarkin', studentId: '91978', dateofbirth: '10/06/1940', nationality: 'Spain'},
            //     {studentName: 'Bradly', studentId: '10003', dateofbirth: '20/08/2008', nationality: 'France'},
            //     {studentName: 'Chris', studentId: '91999', dateofbirth: '14/03/1973', nationality: 'Bangladesh'}
            // ];

            const records = students.map(student => ({
                studentName: student.studentName,
                studentId: student.studentId,
                dateofbirth: student.dateofbirth,
                nationality: student.nationality
            }));

            csvWriter.writeRecords(records)
                .then(() => {
                    console.log('Data to CSV!!!!!!!!');
                    res.send('Data exported to CSV successfully');
                })
                .catch(err => {
                    console.error("There is an error writing data to CSV: ", err.message);
                    res.status(500).send('An error with exporting data to CSV: ${err.message}');
                });
        })
.catch(err => {
    console.error("Error fetching students fron MongoDB: ", err.message);
    res.status(500).send("There is an error while fetching data from MongoDB: ${err.message)");
    });
});



app.get('/ejs', function(req, res) {
    
    var mascots = [
        {name: 'Sammy', organization: "Samsung", birth_year: 2012},
        {name: 'Justin', organization: "Apple", birth_year: 2010},
        {name: 'Ben', organization: "BenCorp", birth_year: 2005}
    ];
    var tagline = "No programming concept is complete without animal mascot.";

    
    res.render('C:/Users/rafue/Desktop/NodeJSWebapp_Assessment2024/views/pages/index', {
        mascots: mascots,
        tagline: tagline
    });

});

app.get('/about', function(req, res) {
    // res.render('C:/Users/rafue/Desktop/NodeJSWebapp_Assessment2024/views/pages/about.ejs');

    res.render('pages/about.ejs');

});


app.get('/login', function(req, res) {
    // res.render('C:/Users/rafue/Desktop/NodeJSWebapp_Assessment2024/views/pages/loginpage.ejs');

    res.render('pages/loginpage.ejs');

})


app.get('/add-role', (req, res) => {
    const role = new Role({ name: 'Admin' });

    role.save()
        .then(result => res.send(result))
        .catch(err => {
            console.log(err);
            res.status(500).send("Saving Role Error!");
        });
});


// app.post


// app.use((req, res) => {
//     res.status(404).send('404: Page not found');
// });

// Middleware for error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});




// app.get('/add-role', (req, res) => {
//     const role = new db.role({
//         name: 'Admin'
//     });

//     role.save()
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).send("Saving Role Error!");
//         });
// });

// app.get('/add-user', (req, res) => {
//     const user = new db.user({
//         username: 'user1',
//         password: 'password123'
//         role: '12345'
//     });

//     user.save()
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).send("Saving Role Error!");
//         })
// })



// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log('Server is running on port ${PORT}.');
// });



////PROGRESSING PAUSED
///ROUTE FOR HANDLING FILE UPLOADS
// app.post('/upload', upload.single('file', async))

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }

    // Access the uploaded file via req.file
    console.log(req.file);

    // Handle file processing or saving here

    res.status(200).send('File uploaded successfully.');
});
