const User = require('../models/user');
const asyncHandler = require('../middleware/async');
const ErrorResponse =  require('../utils/errorResponse');


//@desc          Register user
//@route         POST /api/v1/auth/register
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


//@desc          Login user
//@route         POST /api/v1/auth/login
//@access        Public

exports.login = asyncHandler(async (req, res, next) => {

   const {email, password} = req.body;

   if(!email || !password){
      return next(new ErrorResponse('Please provide an email and password', 400));
   }
    
   const user = await User.findOne({email}).select('+password');

   if(!user){
      return next(new ErrorResponse('Invalid credentials', 400));
   }

   const isMatch = await user.matchPassword(password);

   if(!isMatch){
      return next(new ErrorResponse('Invalid password', 400));
   }

   const token = user.getSignedJwtToken();

   res.status(200).json({ success: true, token });   
});