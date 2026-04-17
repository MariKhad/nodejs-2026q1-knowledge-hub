import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const JWT_ACCESS_TTL = process.env.JWT_ACCESS_TTL || '15m';
const JWT_REFRESH_TTL = process.env.JWT_REFRESH_TTL || '7d';

export const generateAccessToken = (user: { id: number; login: string; role: string }) => {
  return jwt.sign(
    { userId: user.id, login: user.login, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_ACCESS_TTL } as any
  );
};

export const generateRefreshToken = (user: { id: number; login: string }) => {
  return jwt.sign(
    { userId: user.id, login: user.login },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_TTL } as any
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};