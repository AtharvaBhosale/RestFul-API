const express = require('express');
const server = express();
const table = require('./db/db-config.js');
const users = require ('./data/users.json');
const jwt = require('jsonwebtoken');



server.use(express.json());

// login and generate token
server.post('/login',(req,res)=>{
    const user = users.find(usr => usr.username === req.body.username);
    if(user){
        if(user.password === req.body.password){
            const token = jwt.sign(user.username,"secretKey"); // "secretKey" to be places in .env file
            res.status(200).json({token});
        }
        else{
            res.status(401).json({message:'Access denied'})
        }
    }
    else {
        res.status(401).json({message:'Access denied'});
    }
})

//validate token and callback next function in line if token is valid

function checkToken(req,res,next){
    const token = req.headers['access-token'];  //token to be sent in header of request with header-field name 'access-token' 
    if(token){
        jwt.verify(token,"secretKey",(err)=>{   // "secretKey" to be places in .env file
            if(err){
                res.status(401).json({message:'Access denied'}); 
            }
            else{
                next(); // proceed if no error found
            }
        })
    }
    else{
        res.status(401).json({message:'Access denied'});
    }
}

// CRUD Operations on students

// All functions checktoken first and then process request

//FIND ALL STUDENTS
server.get('/api/students',(req,res)=>{
    table.findStudent()
    .then(studen =>{
        
        res.setHeader('Content-type','application/json')
        res.status(200).json(studen[0]);
    })
    .catch(error =>{
        res.status(500).json({message:'unable to get students'});
    })
})


// FIND STUDENT WITH ID
server.get('/api/students/:id',checkToken,(req,res)=>{
    const {id} = req.params;

    table.findStudentById(id)
        .then(student =>{
            if(student.length != 0){
                res.status(200).json(student);
            }
            else{
                res.status(500).json({message:`couldn\'t find student with id = ${id} `});
            }
        })
        .catch(error =>{
            res.status(500).json({message:'unable to get students'});
        })
})

// INSERT STUDENT RECORD

server.post('/api/students',checkToken,(req,res)=>{
    table.insertStudent(req.body)
        .then(student =>{
            res.status(200).json(student);
        })
        .catch(error =>{
            res.status(500).json({message:'unable to add students'});
        })
})

// UPDATE STUDENT RECORD

server.patch('/api/students/:id',checkToken,(req,res)=>{
    const {id} = req.params;
    const change = req.body;
    table.updateStudent(id,change)
        .then(student =>{
            if(student.length !=0){ // empty array returned == record not found
                res.status(200).json(student);
            }
            else{
                res.status(500).json({message:`couldn\'t find student with id = ${id} `});
            }
        })
        .catch(error =>{
            res.status(500).json({message:'unable to update students'});
        })
})

//DELETE STUDENT RECORD WITH ID

server.delete('/api/students/:id',checkToken,(req,res)=>{
    const {id} = req.params;
    table.removeStudent(id)
        .then(student =>{
            if(student.length !=0){ // empty array returned == record not found
                res.status(200).json(student);
            }
            else{
                res.status(500).json({message:`couldn\'t find student with id = ${id} `});
            }
        })
        .catch(error =>{
                res.status(500).json({message:'unable to delete students'});
        })
})

//Fetching class of a student and list of all students in the same class

server.get('/api/class/:cname',checkToken,(req,res)=>{ 
    const {cname} = req.params;
    table.selectStudentfromClass(cname)
        .then(students =>{
            res.status(200).json(students);
        })
        .catch(error =>{
            res.status(500).json({message:'unable to retrieve data'});
    })
})

//Fetching all ongoing courses of a student

server.get('/api/student/:sid/courses',checkToken,(req,res)=>{
    const {sid} = req.params;
    console.log(sid);
    table.getStudentCourses(sid)
        .then(students =>{
            if(students.length !=0){ // empty array returned == record not found
                res.status(200).json(students);
            }
            else{
                res.status(500).json({message:`couldn\'t find student with id = ${id} `});
            }
    })
        .catch(error =>{
            res.status(500).json({message:'unable to retrieve student\'s data'});
    })
})

module.exports = server;