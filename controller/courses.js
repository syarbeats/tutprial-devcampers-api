const ErrorResponse = require('../utils/errorResponse');
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
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }
    
    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
});


//@desc          Get course by id
//@route         /api/v1/courses/:id
//@access        Public

exports.getCourse = asyncHandler(async(req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    }); 

    if(!course){
        return new ErrorResponse(`No course with id ${req.params.id}`, 404);
    }

    res.status(200).json({
        success: true,
        data: course
    });
});