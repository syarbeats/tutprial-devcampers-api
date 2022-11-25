const Bootcamp = require('../models/bootcamp');

//@desc          Get all bootcamps
//@route         /api/v1/bootcamps
//@access        Public

exports.getBootcamps = async (req, res, next) => {

    try {
        const bootcamp = await Bootcamp.find();
        res.status(200).json({success: true, data: bootcamp});
    } catch (error) {
        res.status(400).json({success: false});
    }
    
}

//@desc          Get one bootcamp
//@route         /api/v1/bootcamps/:id
//@access        Public

exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        res.status(200).json({success: true, data: bootcamp});
    } catch (error) {
        res.status(400).json({success: false});
    }
}

//@desc          Creeate bootcamps
//@route         /api/v1/bootcamps
//@access        Public

exports.createBootcamps = async (req, res, next) => {

    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json(
            {
                success: true, 
                data: bootcamp
            }
        );
    } catch (error) {
        res.status(400).json({success: false});
    }
    
}

//@desc          Update bootcamps
//@route         /api/v1/bootcamps/:id
//@access        Public

exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
    
        if(!bootcamp){
            return res.status(400).json({success: false});
        }
        res.status(200).json({success: true, data: bootcamp});
    } catch (error) {
        return res.status(400).json({success: false});
    }  
    
}

//@desc          Delete one bootcamps
//@route         /api/v1/bootcamps/:id
//@access        Public

exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    
        if(!bootcamp){
            return res.status(400).json({success: false});
        }
        res.status(200).json({success: true, data: bootcamp});
    } catch (error) {
        return res.status(400).json({success: false});
    }  
}