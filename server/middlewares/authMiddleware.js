import { getBearerToken, verifyAuthToken } from "../utils/jwt.js";

export const protect = (req, res, next) => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({
      message: "인증 토큰이 필요합니다.",
    });
  }

  try {
    req.user = verifyAuthToken(token);
    next();
  } catch (error) {
    res.status(401).json({
      message: "유효하지 않은 토큰입니다.",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.user_type !== "admin") {
    return res.status(403).json({
      message: "어드민 권한이 필요합니다.",
    });
  }

  next();
};
