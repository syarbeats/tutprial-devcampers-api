const express = require('express');
const router = express.Router();

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

router.route('/:id/photo').put(bootcampPhotoUpload);

router
    .route('/')
    .get(advancedResult(Bootcamp, {
        path: 'courses',
        select: 'title description tuition'
    }), getBootcamps)
    .post(createBootcamps)

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)


module.exports = router;