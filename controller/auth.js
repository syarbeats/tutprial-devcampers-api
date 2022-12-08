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
    
   sendTokenResponse(user, 201, res);  

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

   sendTokenResponse(user, 200, res); 

});

const sendTokenResponse = (user, statusCode, res) => {
   
   const token = user.getSignedJwtToken();
   
   const option = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true 
   };

   if(process.env.NODE_ENV === 'production'){
      option.secure = true;
   }

   res
      .status(statusCode)
      .cookie('token', token, option)
      .json({
         success: true,
         token
      });
};