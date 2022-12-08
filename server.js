const path =  require('path');
const express =  require('express');
const dotenv =  require('dotenv');
const bootcamps = require('./route/bootcamps');
const courses = require('./route/courses');
const auth = require('./route/auth');
const fileupload = require('express-fileupload');
//const logger =  require('./middleware/logger')
const morgan =  require('morgan');
const connectDB = require('./config/db');
const colors = require('colors')
const errorHandler =  require('./middleware/error');
const cookieParser = require('cookie-parser');

dotenv.config({path: './config/config.env'});

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

//app.use(logger);
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(fileupload());
app.use(express.static(path.join(__dirname,'public')));
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use(errorHandler);


const server = app.listen(PORT, console.log(`The server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`));

//handle unhandled promise Rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
});