// pages/api/verify-video.js
import axios from 'axios';
import FormData from 'form-data';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ error: 'Video URL is required' });
  }

  try {
    // Download video to buffer
    const videoResponse = await axios.get(videoUrl, {
      responseType: 'arraybuffer'
    });
    const videoBuffer = Buffer.from(videoResponse.data);

    // Initialize results array
    const results = [];
    let isReal = true;

    // Check video with Face++ API
    try {
      const facePlusPlusResult = await checkFacePlusPlus(videoBuffer);
      
      // Process Face++ results
      if (facePlusPlusResult.is_fake) {
        results.push({
          test: 'Face++ Deepfake Detection',
          details: facePlusPlusResult.details,
          confidence: facePlusPlusResult.confidence
        });
        isReal = false;
      }

      // Check for inconsistent faces across frames
      if (facePlusPlusResult.face_inconsistencies) {
        results.push({
          test: 'Face Consistency Check',
          details: 'Inconsistent facial features detected across frames',
          confidence: facePlusPlusResult.consistency_score
        });
        isReal = false;
      }

      // Check for artificial face movements
      if (facePlusPlusResult.unnatural_movements) {
        results.push({
          test: 'Natural Movement Check',
          details: 'Unnatural facial movements detected',
          confidence: facePlusPlusResult.movement_score
        });
        isReal = false;
      }

    } catch (error) {
      console.error('Face++ API error:', error);
      results.push({
        test: 'API Error',
        details: 'Face++ analysis failed',
        error: error.message
      });
    }

    return res.status(200).json({
      status: isReal ? 'Real' : results.length > 1 ? 'Fake' : 'Likely Fake',
      confidence: calculateOverallConfidence(results),
      failedTests: results,
      videoUrl,
      metadata: {
        analysisTimestamp: new Date().toISOString(),
        videoLength: getVideoDuration(videoBuffer),
        analysisVersion: '1.0'
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ 
      error: 'Failed to verify video',
      details: error.message 
    });
  }
}

async function checkFacePlusPlus(videoBuffer) {
  const FACEPP_API_KEY = process.env.FACEPP_API_KEY;
  const FACEPP_API_SECRET = process.env.FACEPP_API_SECRET;
  const FACEPP_ENDPOINT = 'https://api-us.faceplusplus.com/facepp/v3/video/analyze';

  // Create form data for the API request
  const formData = new FormData();
  formData.append('api_key', FACEPP_API_KEY);
  formData.append('api_secret', FACEPP_API_SECRET);
  formData.append('video_file', videoBuffer, {
    filename: 'video.mp4',
    contentType: 'video/mp4'
  });

  // Initial request to start analysis
  const initResponse = await axios.post(FACEPP_ENDPOINT, formData, {
    headers: {
      ...formData.getHeaders()
    }
  });

  // Get the task ID from the response
  const taskId = initResponse.data.task_id;

  // Poll for results
  const result = await pollForResults(taskId);
  return processResults(result);
}

async function pollForResults(taskId) {
  const FACEPP_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_FACEPP_API_KEY;
  const FACEPP_API_SECRET = process.env.NEXT_PUBLIC_FIREBASE_FACEPP_API_SECRET;
  const CHECK_ENDPOINT = 'https://api-us.faceplusplus.com/facepp/v3/video/getResult';

  let attempts = 0;
  const maxAttempts = 30; // 5 minutes maximum waiting time
  
  while (attempts < maxAttempts) {
    const response = await axios.post(CHECK_ENDPOINT, {
      api_key: FACEPP_API_KEY,
      api_secret: FACEPP_API_SECRET,
      task_id: taskId
    });

    if (response.data.status === 'SUCCEEDED') {
      return response.data.result;
    }

    if (response.data.status === 'FAILED') {
      throw new Error('Face++ analysis failed');
    }

    // Wait 10 seconds before next attempt
    await new Promise(resolve => setTimeout(resolve, 10000));
    attempts++;
  }

  throw new Error('Analysis timeout');
}

function processResults(result) {
  // Process and structure the Face++ API results
  return {
    is_fake: result.fake_probability > 0.7,
    confidence: result.fake_probability,
    face_inconsistencies: result.face_consistency_score < 0.8,
    consistency_score: result.face_consistency_score,
    unnatural_movements: result.movement_naturalness_score < 0.75,
    movement_score: result.movement_naturalness_score,
    details: getFakeDetails(result)
  };
}

function getFakeDetails(result) {
  const details = [];
  
  if (result.fake_probability > 0.7) {
    details.push(`High probability of deepfake (${(result.fake_probability * 100).toFixed(2)}%)`);
  }
  
  if (result.face_consistency_score < 0.8) {
    details.push(`Inconsistent facial features detected (${(result.face_consistency_score * 100).toFixed(2)}% consistency)`);
  }
  
  if (result.movement_naturalness_score < 0.75) {
    details.push(`Unnatural facial movements detected (${(result.movement_naturalness_score * 100).toFixed(2)}% natural)`);
  }

  return details;
}

function calculateOverallConfidence(results) {
  if (results.length === 0) return 1.0;
  
  const confidenceScores = results
    .filter(result => result.confidence !== undefined)
    .map(result => result.confidence);
  
  if (confidenceScores.length === 0) return null;
  
  return confidenceScores.reduce((a, b) => a + b) / confidenceScores.length;
}

function getVideoDuration(videoBuffer) {
  // This is a placeholder - you might want to use a library like fluent-ffmpeg
  // to get actual video duration
  return 'Unknown';
}