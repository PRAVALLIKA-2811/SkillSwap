/**
 * Smart Skill Matching Algorithm for SkillSwap
 * Compares currentUser skills (to teach & to learn) with target candidate user
 */

// Helper to normalize strings for comparison
const normalize = (str) => (str || '').trim().toLowerCase();

// Level weight mapping
const LEVEL_WEIGHT = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

/**
 * Calculates matching score between currentUser and candidateUser
 * @param {Object} currentUser 
 * @param {Object} candidateUser 
 * @returns {Object} Match details { score, matchPercentage, mutualMatch, teachMatch, learnMatch, matchingSkills }
 */
function calculateMatchScore(currentUser, candidateUser) {
  if (!currentUser || !candidateUser || currentUser._id.toString() === candidateUser._id.toString()) {
    return { score: 0, matchPercentage: 0, isMatch: false };
  }

  const currentTeach = currentUser.skillsToTeach || [];
  const currentLearn = currentUser.skillsToLearn || [];
  const candidateTeach = candidateUser.skillsToTeach || [];
  const candidateLearn = candidateUser.skillsToLearn || [];

  // 1. What Candidate TEACHES that Current User wants to LEARN (Forward match)
  const candidateCanTeachUser = [];
  let forwardScore = 0;

  for (const cTeach of candidateTeach) {
    const cTeachNorm = normalize(cTeach.name);
    for (const uLearn of currentLearn) {
      const uLearnNorm = normalize(uLearn.name);
      if (cTeachNorm === uLearnNorm || cTeachNorm.includes(uLearnNorm) || uLearnNorm.includes(cTeachNorm)) {
        // Level compatibility bonus:
        const teacherLevel = LEVEL_WEIGHT[cTeach.level] || 2;
        const learnerDesired = LEVEL_WEIGHT[uLearn.level] || 1;
        const levelBonus = teacherLevel >= learnerDesired ? 15 : 5;
        
        forwardScore += (35 + levelBonus);
        candidateCanTeachUser.push({
          skill: cTeach.name,
          teacherLevel: cTeach.level,
          learnerDesiredLevel: uLearn.level,
        });
      }
    }
  }

  // 2. What Current User TEACHES that Candidate wants to LEARN (Reverse mutual match)
  const userCanTeachCandidate = [];
  let reverseScore = 0;

  for (const uTeach of currentTeach) {
    const uTeachNorm = normalize(uTeach.name);
    for (const cLearn of candidateLearn) {
      const cLearnNorm = normalize(cLearn.name);
      if (uTeachNorm === cLearnNorm || uTeachNorm.includes(cLearnNorm) || cLearnNorm.includes(uTeachNorm)) {
        const teacherLevel = LEVEL_WEIGHT[uTeach.level] || 2;
        const learnerDesired = LEVEL_WEIGHT[cLearn.level] || 1;
        const levelBonus = teacherLevel >= learnerDesired ? 15 : 5;

        reverseScore += (35 + levelBonus);
        userCanTeachCandidate.push({
          skill: uTeach.name,
          teacherLevel: uTeach.level,
          candidateDesiredLevel: cLearn.level,
        });
      }
    }
  }

  const isMutual = candidateCanTeachUser.length > 0 && userCanTeachCandidate.length > 0;
  
  // Total raw score calculation
  let rawScore = forwardScore + reverseScore;

  // Mutual match bonus
  if (isMutual) {
    rawScore += 20; // 20% synergy bonus for reciprocal exchange
  }

  // College affinity bonus (if same college)
  let collegeBonus = 0;
  if (
    currentUser.college &&
    candidateUser.college &&
    normalize(currentUser.college) === normalize(candidateUser.college)
  ) {
    collegeBonus = 5;
    rawScore += collegeBonus;
  }

  // Rating bonus (up to 5 points for high rated peers)
  if (candidateUser.rating && candidateUser.rating >= 4.5) {
    rawScore += 5;
  }

  // Normalize match percentage between 35% and 98% for meaningful matches
  let matchPercentage = 0;
  if (candidateCanTeachUser.length > 0 || userCanTeachCandidate.length > 0) {
    matchPercentage = Math.min(98, Math.max(45, Math.round(rawScore)));
    if (isMutual) {
      matchPercentage = Math.max(85, Math.min(99, matchPercentage));
    }
  }

  return {
    score: rawScore,
    matchPercentage,
    isMutual,
    canTeachYou: candidateCanTeachUser,
    youCanTeachThem: userCanTeachCandidate,
    totalMatchingSkills: candidateCanTeachUser.length + userCanTeachCandidate.length,
  };
}

module.exports = {
  calculateMatchScore,
};
