//@desc          Get all bootcamps
//@route         /api/v1/bootcamps
//@access        Public

exports.getBootcamps = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Show all bootcamps'});
}

//@desc          Get one bootcamp
//@route         /api/v1/bootcamps/:id
//@access        Public

exports.getBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Get bootcamps with id ${req.params.id}`});
}

//@desc          Creeate bootcamps
//@route         /api/v1/bootcamps
//@access        Public

exports.createBootcamps = (req, res, next) => {
    res.status(201).json({success: true, msg: 'Create bootcamps'});
}

//@desc          Update bootcamps
//@route         /api/v1/bootcamps/:id
//@access        Public

exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Update bootcamps with id ${req.params.id}`});
}

//@desc          Delete one bootcamps
//@route         /api/v1/bootcamps/:id
//@access        Public

exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Delete bootcamps with id ${req.params.id}`});
}