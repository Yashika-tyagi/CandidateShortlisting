const Candidate = require('../models/Candidate');
const { analyzeCandidates } = require('../utils/ai');

exports.addCandidate = async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.basicMatch = async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;
    
    if (!requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ error: 'requiredSkills array is required' });
    }

    const minExp = minExperience ? parseInt(minExperience, 10) : 0;
    
    // Filter by min experience
    const candidates = await Candidate.find({ experience: { $gte: minExp } });
    
    // Calculate match score
    const reqSkillsLower = requiredSkills.map(s => s.toLowerCase());
    
    const matchedCandidates = candidates.map(candidate => {
      const candidateSkillsLower = candidate.skills.map(s => s.toLowerCase());
      
      const matchedSkills = candidateSkillsLower.filter(s => reqSkillsLower.includes(s));
      const overlapPercentage = reqSkillsLower.length > 0 
        ? (matchedSkills.length / reqSkillsLower.length) * 100 
        : 0;
      
      let matchLevel = 'Low Match';
      if (overlapPercentage >= 75) matchLevel = 'High Match';
      else if (overlapPercentage >= 40) matchLevel = 'Medium Match';

      return {
        candidate,
        matchScore: overlapPercentage,
        matchedSkills,
        matchLevel
      };
    });
    
    // Sort by highest match score
    matchedCandidates.sort((a, b) => b.matchScore - a.matchScore);
    
    res.status(200).json(matchedCandidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.aiShortlist = async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;
    
    if (!requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ error: 'requiredSkills array is required' });
    }

    // Get basic matched candidates first to reduce AI payload (optional, but good practice)
    const minExp = minExperience ? parseInt(minExperience, 10) : 0;
    const candidates = await Candidate.find({ experience: { $gte: minExp } });
    
    if (candidates.length === 0) {
      return res.status(200).json({ message: "No candidates meet the minimum experience requirement.", rankedCandidates: [] });
    }

    // Call AI utility
    const aiResult = await analyzeCandidates({ requiredSkills, minExperience }, candidates);
    
    // Merge AI result with candidate DB records
    const finalResult = aiResult.rankedCandidates.map(ranked => {
      const dbCandidate = candidates.find(c => c.name === ranked.name);
      return {
        ...ranked,
        candidateId: dbCandidate ? dbCandidate._id : null,
        skills: dbCandidate ? dbCandidate.skills : [],
        experience: dbCandidate ? dbCandidate.experience : 0
      };
    });

    res.status(200).json(finalResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to process AI shortlisting' });
  }
};
