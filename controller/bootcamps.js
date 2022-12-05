const Bootcamp = require('../models/bootcamp');
const asyncHandler = require('../middleware/async');
const path = require('path');
const ErrorResponse =  require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const { findOne } = require('../models/bootcamp');

//@desc          Get all bootcamps
//@route         /api/v1/bootcamps
//@access        Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    console.log(req.query);
    let query;
    const reqQuery = {...req.query};

    let queryStr = JSON.stringify(reqQuery);
    const removeFields = ['select', 'sort'];
    removeFields.forEach(param => delete reqQuery[param]);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    console.log('QueryStr:'+queryStr);

    query = Bootcamp.find(JSON.parse(queryStr)).populate({
        path: 'courses',
        select: 'title description tuition'
    });

    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        console.log(fields);
        query =  query.select(fields);
    }

    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }else{
        query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 2;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const bootcamp = await query;
    //const bootcamp = await Bootcamp.find(req.query);

    const pagination = {};

    if(endIndex < total){
        pagination.next = {
            page: page + 1, 
            limit: limit
        }
    }

    if(startIndex > 0){
        pagination.prev = {
            page: page - 1,
            limit: limit
        }
    }

    res.status(200).json({success: true, count: bootcamp.length, pagination: pagination, data: bootcamp});
      
});

//@desc          Get one bootcamp
//@route         /api/v1/bootcamps/:id
//@access        Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
    
    const bootcamp = await Bootcamp.findById(req.params.id).populate({
        path: 'courses',
        select: 'title description tuition'
    });
        
    if(!bootcamp){
        return  next(new ErrorResponse(`Bootcamp not found wit id ${req.params.id}`, 404));;
    }
    res.status(200).json({success: true, data: bootcamp});
   
});

//@desc          Creeate bootcamps
//@route         /api/v1/bootcamps
//@access        Public

exports.createBootcamps = asyncHandler(async (req, res, next) => {

   
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json(
        {
            success: true, 
            data: bootcamp
        }
    );  
    
});

//@desc          Update bootcamps
//@route         /api/v1/bootcamps/:id
//@access        Public

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    if(!bootcamp){
        next(err);
    }
    res.status(200).json({success: true, data: bootcamp}); 
});

//@desc          Delete one bootcamps
//@route         /api/v1/bootcamps/:id
//@access        Public

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    
    const bootcamp = await Bootcamp.findById(req.params.id);
    
    if(!bootcamp){
        next(err);
    }

    bootcamp.remove();

    res.status(200).json({success: true});
});

//@desc          Get bootcamp by radius from zipcode
//@route         /api/v1/bootcamps/radius/:zipcode/:distance
//@access        Public

exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
   const {zipcode, distance} = req.params; 
   
   const loc = await geocoder.geocode(zipcode);
   const lat = loc[0].latitude;
   const lng = loc[0].longitude;

   const radius = distance / 3963;

   const bootcamps = await Bootcamp.find({
    location: {$geoWithin: {$centerSphere: [[lng, lat], radius]}}
   });
   
   res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
   });
});

//@desc          Upload photo for bootcamps
//@route         PUT /api/v1/bootcamps/:id/photo
//@access        Public

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    
    const bootcamp = await Bootcamp.findById(req.params.id);
    
    if(!bootcamp){
        next(err);
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }
    
    console.log(req.files);

    const file = req.files.file;

    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Please upload a image file`, 400));
    }

    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload a image file less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    console.log(file.name);

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, {
            photo: file.name
        });

        res.status(200).json({
            success: true,
            data: file.name
        });
    });
});