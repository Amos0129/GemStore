import jwt from 'jsonwebtoken'

// Generate access token (expires in 15 minutes)
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  )
}

// Generate refresh token (expires in 7 days)
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Verify token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

// Verify refresh token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
}