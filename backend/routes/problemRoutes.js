const express = require('express');
const router = express.Router();
const { 
    getAllProblems, 
    getProblemById, 
    createProblem, 
    updateProblem, 
    deleteProblem 
} = require('../controllers/problemController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getAllProblems)
    .post(protect, admin, createProblem);

router.route('/:id')
    .get(getProblemById)
    .put(protect, admin, updateProblem)
    .delete(protect, admin, deleteProblem);

module.exports = router;