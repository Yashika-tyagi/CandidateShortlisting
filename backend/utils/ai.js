const axios = require('axios');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-3.5-turbo'; // A standard, fast model

const analyzeCandidates = async (jobRequirements, candidates) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    throw new Error('OpenRouter API key is not configured.');
  }

  const prompt = `
Job requires: ${jobRequirements.requiredSkills.join(', ')}
Minimum Experience: ${jobRequirements.minExperience} years

Candidates:
${candidates.map((c, index) => `${index + 1}. ${c.name} - ${c.skills.join(', ')} - ${c.experience} years. Bio: ${c.bio || 'N/A'}`).join('\n')}

Task:
Analyze the candidates against the job requirements. Rank them from best match to worst match.
Explain why each candidate is suitable or not suitable. Keep the explanations concise (1-2 sentences per candidate).
Respond in the following JSON format ONLY:
{
  "rankedCandidates": [
    {
      "name": "Candidate Name",
      "rank": 1,
      "explanation": "Explanation here..."
    }
  ]
}
`;

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173', // Vite default port
          'X-Title': 'Candidate Shortlisting App'
        }
      }
    );

    const resultText = response.data.choices[0].message.content;
    return JSON.parse(resultText);
  } catch (error) {
    console.error('Error calling OpenRouter API:', error?.response?.data || error.message);
    throw new Error('Failed to analyze candidates with AI.');
  }
};

module.exports = {
  analyzeCandidates
};
