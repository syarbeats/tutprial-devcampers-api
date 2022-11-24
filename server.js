const express =  require('express');
const dotenv =  require('dotenv');
const bootcamps = require('./route/bootcamps');
//const logger =  require('./middleware/logger')
const morgan =  require('morgan');

dotenv.config({path: './config/config.env'});

const app = express();
const PORT = process.env.PORT || 5000;

//app.use(logger);
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcamps);


app.listen(PORT, console.log(`The server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`));