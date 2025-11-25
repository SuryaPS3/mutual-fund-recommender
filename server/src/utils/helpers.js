export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const calculateReturns = (currentNAV, previousNAV) => {
  if (!previousNAV || previousNAV === 0) return null;
  return ((currentNAV - previousNAV) / previousNAV) * 100;
};

export const calculateVolatility = (returns) => {
  if (!returns || returns.length === 0) return 0;
  
  const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
  const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / returns.length;
  return Math.sqrt(variance);
};