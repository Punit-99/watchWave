import jwt from "jsonwebtoken";
import { UserRole } from "../../../generated/prisma/enums";

type TokenPayload = {
  userId: string;
  role: UserRole;
};

export function generateAccessToken(userId: string, role: UserRole) {
  return jwt.sign(
    {
      userId,
      role,
    },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: "15m",
    },
  );
}

export function generateRefreshToken(userId: string, role: UserRole) {
  return jwt.sign(
    {
      userId,
      role,
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    },
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
}
