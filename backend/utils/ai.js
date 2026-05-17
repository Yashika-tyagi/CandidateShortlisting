const axios = require('axios');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-v4-flash:free'; // Using an actively supported free model

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
Respond in the following JSON format ONLY, with no extra text or markdown:
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
        messages: [{ role: 'user', content: prompt }]
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

    let resultText = response.data.choices[0].message?.content;
    
    if (!resultText) {
      throw new Error(`AI returned empty response. Full response: ${JSON.stringify(response.data)}`);
    }

    // Sometimes free models wrap JSON in markdown blocks even when told not to. Strip them out.
    if (resultText.includes('\`\`\`json')) {
      resultText = resultText.split('\`\`\`json')[1].split('\`\`\`')[0].trim();
    } else if (resultText.includes('\`\`\`')) {
      resultText = resultText.split('\`\`\`')[1].split('\`\`\`')[0].trim();
    }

    return JSON.parse(resultText);
  } catch (error) {
    const errorDetails = error?.response?.data || error.message;
    console.error('Error calling OpenRouter API:', errorDetails);
    throw new Error(`OpenRouter API Error: ${JSON.stringify(errorDetails)}`);
  }
};

module.exports = {
  analyzeCandidates
};
