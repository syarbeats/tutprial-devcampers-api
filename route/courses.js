const express = require('express');
const router = express.Router({mergeParams: true});
const { protect, authorize } = require('../middleware/auth');

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
}), getCourses).post(protect, authorize('admin', 'publisher'), addCourse);

router.route('/:id').get(getCourse).put(protect, authorize('admin', 'publisher'), updateCourse).delete(protect, authorize('admin', 'publisher'), deleteCourse);

module.exports = router;