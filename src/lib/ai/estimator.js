// Project Estimator logic - Google AI Studio (Gemini API) integration

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function estimateProject(answers, apiKey) {
  if (!apiKey) {
    // Basic estimation without AI
    return estimateBasic(answers);
  }

  try {
    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-pro as it's the most widely available model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create a detailed prompt for project estimation
    const prompt = createEstimationPrompt(answers);

    // Generate AI-powered estimate
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Try to parse JSON response from AI
    try {
      // Extract JSON from response (handle markdown code blocks if present)
      let jsonText = text.trim();
      if (jsonText.includes('```json')) {
        jsonText = jsonText.split('```json')[1].split('```')[0].trim();
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.split('```')[1].split('```')[0].trim();
      }

      const aiEstimate = JSON.parse(jsonText);

      // Validate and merge with basic estimate as fallback
      return {
        priceRange: {
          min: aiEstimate.priceRange?.min || estimateBasic(answers).priceRange.min,
          max: aiEstimate.priceRange?.max || estimateBasic(answers).priceRange.max,
        },
        timeline: {
          min: aiEstimate.timeline?.min || estimateBasic(answers).timeline.min,
          max: aiEstimate.timeline?.max || estimateBasic(answers).timeline.max,
        },
        suggestedTechStack: aiEstimate.suggestedTechStack || estimateBasic(answers).suggestedTechStack,
        confidence: 'high',
        aiInsights: aiEstimate.insights || null,
      };
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fall back to basic estimation if parsing fails
      return estimateBasic(answers);
    }
  } catch (error) {
    console.error('Gemini API error in estimator:', error);
    // Fall back to basic estimation on error
    return estimateBasic(answers);
  }
}

function createEstimationPrompt(answers) {
  const { projectType, complexity, features, timeline, budget, additionalInfo } = answers;

  const projectTypes = {
    'web-app': 'Web Application',
    'mobile-app': 'Mobile Application',
    'ai-solution': 'AI Solution',
    'custom-software': 'Custom Software',
  };

  const complexityLevels = {
    'simple': 'Simple',
    'medium': 'Medium',
    'complex': 'Complex',
    'enterprise': 'Enterprise',
  };

  return `You are an expert project estimator for a premium software development agency. Analyze the following project requirements and provide a detailed estimate in JSON format.

Project Details:
- Type: ${projectTypes[projectType] || projectType}
- Complexity: ${complexityLevels[complexity] || complexity}
- Features: ${Array.isArray(features) ? features.join(', ') : features || 'Not specified'}
- Desired Timeline: ${timeline || 'Flexible'}
- Budget Range: ${budget || 'Not specified'}
- Additional Info: ${additionalInfo || 'None'}

Please provide your estimate in the following JSON format:
{
  "priceRange": {
    "min": <minimum_price_in_usd>,
    "max": <maximum_price_in_usd>
  },
  "timeline": {
    "min": <minimum_weeks>,
    "max": <maximum_weeks>
  },
  "suggestedTechStack": ["technology1", "technology2", ...],
  "insights": "Brief explanation of your estimation reasoning"
}

Guidelines:
- Price should be realistic for a premium development agency (typically $15,000 - $100,000+)
- Timeline should account for design, development, testing, and deployment
- Tech stack should be modern and appropriate for the project type
- Consider complexity and feature count in your estimates
- Provide insights that explain your reasoning

Respond ONLY with valid JSON, no additional text.`;
}

function estimateBasic(answers) {
  const { projectType, complexity, features, timeline } = answers;
  
  // Basic estimation logic
  let basePrice = 0;
  let baseTimeline = 0;

  // Base pricing by project type
  const typeMultipliers = {
    'web-app': { price: 15000, timeline: 8 },
    'mobile-app': { price: 20000, timeline: 12 },
    'ai-solution': { price: 25000, timeline: 10 },
    'custom-software': { price: 30000, timeline: 14 },
  };

  const type = typeMultipliers[projectType] || typeMultipliers['web-app'];
  basePrice = type.price;
  baseTimeline = type.timeline;

  // Complexity multiplier
  const complexityMultipliers = {
    'simple': 0.7,
    'medium': 1.0,
    'complex': 1.5,
    'enterprise': 2.0,
  };
  const complexityMulti = complexityMultipliers[complexity] || 1.0;

  // Features multiplier
  const featureCount = Array.isArray(features) ? features.length : 0;
  const featureMulti = 1 + (featureCount * 0.1);

  // Calculate estimates
  const estimatedPrice = Math.round(basePrice * complexityMulti * featureMulti);
  const estimatedTimeline = Math.round(baseTimeline * complexityMulti * (1 + featureCount * 0.1));

  // Suggested tech stack based on project type
  const techStacks = {
    'web-app': ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    'mobile-app': ['React Native', 'TypeScript', 'Firebase'],
    'ai-solution': ['Next.js', 'Google AI Studio', 'Python', 'PostgreSQL'],
    'custom-software': ['Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
  };

  return {
    priceRange: {
      min: Math.round(estimatedPrice * 0.8),
      max: Math.round(estimatedPrice * 1.2),
    },
    timeline: {
      min: Math.max(4, estimatedTimeline - 2),
      max: estimatedTimeline + 4,
    },
    suggestedTechStack: techStacks[projectType] || techStacks['web-app'],
    confidence: 'medium',
  };
}

