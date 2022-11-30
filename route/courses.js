const express = require('express');
const router = express.Router({mergeParams: true});

const {
        getCourses,
        getCourse 
   
    } = require('../controller/courses');

router.route('/').get(getCourses);
router.route('/:id').get(getCourse);

module.exports = router;