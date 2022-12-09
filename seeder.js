const fs = require('fs');
const dotenv = require('dotenv');
const colors =  require('colors');
const mongoose =  require('mongoose');
const bootcamp = require('./models/bootcamp');
const course = require('./models/course');
const user = require('./models/user');

dotenv.config({path: './config/config.env'});


mongoose.connect(process.env.MONGODB_URI);

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));


const importData = async ()=>{
    try {
        await bootcamp.create(bootcamps);
        await course.create(courses);
        await user.create(users);
        console.log('Data imported...'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

const deleteData = async ()=>{
    try {
        await bootcamp.deleteMany();
        await course.deleteMany();
        await user.deleteMany();
        console.log('Data deleted...'.red);
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

if(process.argv[2] === '-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}