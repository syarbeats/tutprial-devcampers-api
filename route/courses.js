const express = require('express');
const router = express.Router({mergeParams: true});

const {
        getCourses,
        getCourse,
        addCourse,
        updateCourse,
        deleteCourse 
   
    } = require('../controller/courses');

const Course =  require('../models/course');
const advancedResult = require('../middleware/advancedResult');

router.route('/').get(advancedResult(Course, {
    path: 'bootcamp',
    select: 'name description'
}), getCourses).post(addCourse);

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;