import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.jwt_secret || "shoppingmall-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export const getBearerToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
};

export const signAuthToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

export const verifyAuthToken = (token) => jwt.verify(token, JWT_SECRET);
