// pages/api/verify-image.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    const results = [];
    let isReal = true;

    // 1. Check with Sightengine for AI generation
    try {
      const sightengineResult = await checkSightengine(imageUrl);
      if (sightengineResult.probability > 0.7) { // Threshold for AI detection
        results.push('AI Generated (Sightengine)');
        isReal = false;
      }
    } catch (error) {
      console.error('Sightengine error:', error);
    }

    // 2. Check with Replicate for tampering
    try {
      const replicateResult = await checkReplicate(imageUrl);
      if (replicateResult.manipulation_score > 0.6) { // Threshold for manipulation
        results.push('Manipulated/Tampered (Replicate)');
        isReal = false;
      }
    } catch (error) {
      console.error('Replicate error:', error);
    }

    // 3. Check with Google Reverse Image
    try {
      const googleResult = await checkGoogleReverseImage(imageUrl);
      if (googleResult.suspicious) {
        results.push('Suspicious Source (Google Reverse)');
        isReal = false;
      }
    } catch (error) {
      console.error('Google Reverse Image error:', error);
    }

    return res.status(200).json({
      status: isReal ? 'Real' : results.length > 1 ? 'Fake' : 'Likely Fake',
      failedTests: results,
      imageUrl
    });

  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ 
      error: 'Failed to verify image',
      details: error.message 
    });
  }
}

async function checkSightengine(imageUrl) {
  const SIGHTENGINE_API_USER = process.env.NEXT_PUBLIC_FIREBASE_SIGHTENGINE_USER;
  const SIGHTENGINE_API_SECRET = process.env.NEXT_PUBLIC_FIREBASE_SIGHTENGINE_SECRET;

  const response = await axios.get('https://api.sightengine.com/1.0/check.json', {
    params: {
      url: imageUrl,
      api_user: SIGHTENGINE_API_USER,
      api_secret: SIGHTENGINE_API_SECRET,
      models: 'ai-generated'
    }
  });

  return {
    probability: response.data.ai_generated?.probability || 0
  };
}

async function checkReplicate(imageUrl) {
  const REPLICATE_API_TOKEN = process.env.NEXT_PUBLIC_FIREBASE_REPLICATE_API_KEY;
  
  // First, download the image to get its base64
  const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');

  const response = await axios.post(
    'https://api.replicate.com/v1/predictions',
    {
      version: "7a411a13adc9264242c5cd6b88eb68968e1be5bbfc21aac092e2759ed1b4ab33", // Image manipulation detection model
      input: { image: `data:image/jpeg;base64,${base64Image}` }
    },
    {
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );

  // Poll for results
  let result = response.data;
  while (result.status !== 'succeeded' && result.status !== 'failed') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const pollResponse = await axios.get(result.urls.get, {
      headers: { 'Authorization': `Token ${REPLICATE_API_TOKEN}` }
    });
    result = pollResponse.data;
  }

  return {
    manipulation_score: result.output?.manipulation_score || 0
  };
}



function analyzeSearchResults(results) {
  if (results.length === 0) {
    return true; // Suspicious if no matches found
  }

  // Check if image appears on known reliable sources
  const reliableDomains = [
    'reuters.com',
    'apnews.com',
    'bbc.com',
    'nytimes.com',
    // Add more reliable domains
  ];

  const hasReliableSource = results.some(result => 
    reliableDomains.some(domain => result.link.includes(domain))
  );

  // Check if image appears on known fact-checking sites
  const factCheckDomains = [
    'snopes.com',
    'factcheck.org',
    'politifact.com',
    // Add more fact-checking domains
  ];

  const hasFactCheckSource = results.some(result =>
    factCheckDomains.some(domain => result.link.includes(domain))
  );

  return !hasReliableSource || hasFactCheckSource;
}