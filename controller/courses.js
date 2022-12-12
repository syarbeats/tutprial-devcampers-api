const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const Course =  require('../models/course');
const Bootcamp =  require('../models/bootcamp');
const asyncHandler = require('../middleware/async');
const { Query } = require('mongoose');
const course = require('../models/course');


//@desc          Get courses
//@route         GET /api/v1/courses
//@route         GET /api/v1/bootcamps/:bootcampId/courses
//@access        Public

exports.getCourses = asyncHandler(async(req, res, next) => {
    
    if(req.params.bootcampId){
        const courses = await Course.find({bootcamp: req.params.bootcampId});

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    }else{
      res.status(200).json(res.advancedResult);
    }
});


//@desc          Get course by id
//@route         GET /api/v1/courses/:id
//@access        Public

exports.getCourse = asyncHandler(async(req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    }); 

    if(!course){
        return next(new ErrorResponse(`No course with id ${req.params.id}`), 404);
    }

    res.status(200).json({
        success: true,
        data: course
    });
});

//@desc          Add course
//@route         POST /api/v1/bootcamps/:bootcampId/courses/
//@access        Public

exports.addCourse = asyncHandler(async(req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    
    if(!bootcamp){
        return next(new ErrorResponse(`NO bootcamp with id ${req.params.bootcampId}`), 404);
    }

    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return  next(new ErrorResponse(`User with id ${req.user.id} is not authorized to add course to this bootcamp with id ${bootcamp.id}`, 401));
    }

    const course = await Course.create(req.body);
    
    res.status(201).json({
        success: true,
        data: course
    });
});

//@desc          Update course
//@route         PUT /api/v1/courses/:id
//@access        Public

exports.updateCourse = asyncHandler(async(req, res, next) => {

    let course = await Course.findById(req.params.id);

    if(!course){
        return next(new ErrorResponse(`No course with id ${req.params.id}`), 404);
    }

    if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return  next(new ErrorResponse(`User with id ${req.user.id} is not authorized to update course with id ${course.id}`, 401));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
        success: true,
        data: course
    });
});

//@desc          Delete course
//@route         DELETE /api/v1/courses/:id
//@access        Public

exports.deleteCourse = asyncHandler(async(req, res, next) => {

    const course = await Course.findById(req.params.id);

    if(!course){
        return next(new ErrorResponse(`No course with id ${req.params.id}`), 404);
    }

    if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return  next(new ErrorResponse(`User with id ${req.user.id} is not authorized to delete course with id ${course.id}`, 401));
    }

    await course.remove();
    
    res.status(200).json({
        success: true,
        data: {}
    });
});