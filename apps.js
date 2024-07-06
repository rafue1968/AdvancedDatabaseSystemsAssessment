// const express = require('express');
// const morgan = require('morgan');
// const mongoose = require('mongoose');
// const Student = require('./models/student.js');


// //creating express insstance
// const app = express();

// //mongoDB connection URI
// const dbURI = 'mongodb+srv://rafue1968:7zMQ7fXWFoayFpng@cluster0.xzg6ror.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// //use mongoose to connect MongoDB
// mongoose.connect(dbURI, {useNewPriParser: true, useUnifiedTopology: true})
//     .then((result) => app.listen(3000))
//     .catch((err) => console.log(err));

//register the view engine
app.set('view engine', 'ejs'); //makes 'views' the default folder


app.use(morgan('dev'));


app.get('/add-student', (req, res) => {
    const student = new Student({
        studentName: 'Rafue',
        studentId: '1234567',
        dateofbirth: '16-11-2002',
        nationality: 'Ireland'

    });

    student.save()
            .then((result) => {
                res.send(result)
            })
            .catch((err) => {
                console.log(err);
                console.log("Not successful saved!!!");
            });

})

app.get('/all-students', (req, res) => {
    Student.find()
            .then((result) => {
                res.send(result)
            })
            .catch((err) => {
                console.log(err);
                console.log("Not successfully found!!!!!!!")
            });
})

app.get('/single-student', (req, res) => {
    Student.findbyID('MongoDB')
})




//Testing
// const app = require('express')();
// const http = require('http').Server(app);

// const mongoose = require('mongoose');

// // mongoose.connect('mongodb+srv://rafue1968:7zMQ7fXWFoayFpng@cluster0.xzg6ror.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')


// const { MongoClient, ServerApiVersion } = require('mongodb');
// // const uri = "mongodb+srv://rafue1968:MFpSITx9CvXvUpDK@cluster0.xzg6ror.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const uri = "mongodb+srv://rafue1968:MFpSITx9CvXvUpDK@cluster0.mongodb.net/StudentDB";


// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

// const Student = require('./models/student.js');

// async function insert()
// {
//     Student.create({
//         studentName: 'Clark',
//         studentEmail: 'clarkkent@yahoo.co.uk'
//     })
// }

// insert();

// http.listen(3000, function(){
//     console.log('Server is running')
// });

