import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    // Header looks like: "Bearer eyJhbGci..."
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // 2. Extract just the token part (remove "Bearer ")
    const token = authHeader.split(' ')[1];

    // 3. Verify token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user info to request object
    // Now any route after this middleware can access req.user
    req.user = decoded;

    // 5. Move to the next function (the actual route handler)
    next();

  } catch (error) {
    // jwt.verify throws if token is invalid or expired
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default protect;