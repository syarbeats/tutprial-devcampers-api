const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
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

//@desc          Get current login user
//@route         POST /api/v1/auth/me
//@access        Private
exports.getMe = asyncHandler(async (req, res, next) => {
   const user = await User.findById(req.user.id);
   
   res.status(200).json({
      success: true,
      data: user
   });
});

//@desc          Forgot password
//@route         POST /api/v1/auth/forgotpassword
//@access        Private
exports.forgotPassword = asyncHandler(async (req, res, next) => {
   const user = await User.findOne({email: req.body.email});

   if(!user){
      return next(new ErrorResponse(`There is no user with email ${req.body.email}`, 404));
   }

   const resetToken = user.getResetPasswordToken();

   await user.save({validateBeforeSave: false});

   const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
   const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

   try{
      await sendEmail({
         email: user.email,
         subject: 'Password reset token',
         message
      });
      
      res.status(200).json({  
         success: true,
         data: 'Email sent'
      });

   }catch(err){
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({validateBeforeSave: false});
      return next(new ErrorResponse('Email could not be sent', 500));
   }

});

//@desc          Reset Password
//@route         POST /api/v1/auth/resetpassword/:resettoken
//@access        Private
exports.resetPassword = asyncHandler(async (req, res, next) => {
   
   const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

   
   const user = await User.findOne({ 
      resetPasswordToken,
      resetPasswordExpire: {
         $gt: Date.now()
      }
   });

   if(!user){
      return next(new ErrorResponse('Invalid token', 400));
   }

   user.password = req.body.password;
   user.resetPasswordToken = undefined;
   user.resetPasswordExpire = undefined;
   await user.save();

   sendTokenResponse(user, 200, res);
});
