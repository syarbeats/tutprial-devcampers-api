const User = require('../models/user');
const asyncHandler = require('../middleware/async');
const ErrorResponse =  require('../utils/errorResponse');


//@desc          Register user
//@route         /api/v1/auth/register
//@access        Public

exports.register = asyncHandler(async (req, res, next) => {

   const {name, email, password, role} = req.body;

   const user = await User.create({
    name,
    email,
    password,
    role
   });
    
   const token = user.getSignedJwtToken();

   res.status(201).json({ success: true, token });   
});