/**
 * API Key Middleware
 * For internal services (Lambda) to access protected endpoints
 */
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(403).json({
      success: false,
      error: 'API key is required. Provide X-API-KEY header.'
    });
  }
  
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return res.status(403).json({
      success: false,
      error: 'Invalid API key'
    });
  }
  
  next();
};

module.exports = apiKeyMiddleware;
