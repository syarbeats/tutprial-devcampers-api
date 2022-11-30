const express = require('express');
const router = express.Router();

const {
        getBootcamps, 
        getBootcamp,
        createBootcamps,
        updateBootcamp,
        deleteBootcamp,
        getBootcampInRadius
    } = require('../controller/bootcamps');

const courseRouter = require('./courses');
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

router
    .route('/')
    .get(getBootcamps)
    .post(createBootcamps)

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)


module.exports = router;