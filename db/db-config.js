const knex = require('knex');
const config = require('../knexfile.js');

const db = knex(config.development);

module.exports ={
    findStudent,
    findStudentById,
    insertStudent,
    updateStudent,
    removeStudent,
    selectStudentfromClass,
    getStudentCourses

}

function findStudent(){
    return db('students');
}

function findStudentById(id){
    return db('students')
        .where({id: Number(id)});
}

async function insertStudent(post){
    return await db('students')
            .insert(post)
            .then(ids =>({id : ids}));
}

async function updateStudent(id,post){
    return await db('students')
            .where('id',Number(id))
            .update(post);
}

async function removeStudent(id){
    return await db('students')
            .where('id',Number(id))
            .del();
}

async function selectStudentfromClass(cname){
    return await db.from('students')
                    .innerJoin('classes','students.classId','classes.id')
                    .select()
                    .where('classes.className',cname);
}

async function getStudentCourses(sid){
    return await db.from('students')
                    .innerJoin('courses','students.classID','courses.classID')
                    .select()
                    .where('students.id',sid);
}
