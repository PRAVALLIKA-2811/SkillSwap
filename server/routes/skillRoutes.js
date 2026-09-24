const express = require('express');
const router = express.Router();
const {
  getMySkills,
  addSkillToTeach,
  removeSkillToTeach,
  addSkillToLearn,
  removeSkillToLearn,
  updateAllSkills,
} = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

router.use(protect); // All skill routes are protected

router.get('/', getMySkills);
router.put('/', updateAllSkills);
router.post('/teach', addSkillToTeach);
router.delete('/teach/:skillName', removeSkillToTeach);
router.post('/learn', addSkillToLearn);
router.delete('/learn/:skillName', removeSkillToLearn);

module.exports = router;
