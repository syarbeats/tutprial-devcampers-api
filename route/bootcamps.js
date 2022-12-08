const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
        getBootcamps, 
        getBootcamp,
        createBootcamps,
        updateBootcamp,
        deleteBootcamp,
        getBootcampInRadius,
        bootcampPhotoUpload
    } = require('../controller/bootcamps');

const Bootcamp = require('../models/bootcamp');
const advancedResult = require('../middleware/advancedResult');

const courseRouter = require('./courses');
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

router.route('/:id/photo').put(protect, bootcampPhotoUpload);

router
    .route('/')
    .get(advancedResult(Bootcamp, {
        path: 'courses',
        select: 'title description tuition'
    }), getBootcamps)
    .post(protect, createBootcamps)

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, updateBootcamp)
    .delete(protect, deleteBootcamp)


module.exports = router;