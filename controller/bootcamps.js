const Bootcamp = require('../models/bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse =  require('../utils/errorResponse');

//@desc          Get all bootcamps
//@route         /api/v1/bootcamps
//@access        Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.find();
    res.status(200).json({success: true, count: bootcamp.length, data: bootcamp});
      
});

//@desc          Get one bootcamp
//@route         /api/v1/bootcamps/:id
//@access        Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
    
    const bootcamp = await Bootcamp.findById(req.params.id);
        
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
    
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    
    if(!bootcamp){
        next(err);
    }
    res.status(200).json({success: true, data: bootcamp});
});