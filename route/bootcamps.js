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