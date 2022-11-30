const errorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const Course =  require('../models/course');
const asyncHandler = require('../middleware/async');
const { Query } = require('mongoose');


//@desc          Get courses
//@route         /api/v1/courses
//@route         /api/v1/bootcamps/:bootcampId/courses
//@access        Public

exports.getCourses = asyncHandler(async(req, res, next) => {
    let query;

    if(req.params.bootcampId){
        query = Course.find({bootcamp: req.params.bootcampId});
    }else{
        query = Course.find();
    }
    
    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
});