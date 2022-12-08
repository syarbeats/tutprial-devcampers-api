const express = require('express');
const router = express.Router({mergeParams: true});
const { protect } = require('../middleware/auth');

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
}), getCourses).post(protect, addCourse);

router.route('/:id').get(getCourse).put(protect, updateCourse).delete(protect, deleteCourse);

module.exports = router;