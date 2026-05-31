import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/lib/jwt";

import { LoginInput, RegisterInput } from "@/validation/auth.validation";

const REFRESH_EXPIRES_IN_DAYS = 7;

// ======================
// REGISTER
// ======================
export async function registerService(data: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    },
  });

  const accessToken = generateAccessToken(user.id, user.role);

  const refreshToken = generateRefreshToken(user.id, user.role);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + REFRESH_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
      ),
    },
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
}

// ======================
// LOGIN
// ======================
export async function loginService(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id, user.role);

  const refreshToken = generateRefreshToken(user.id, user.role);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + REFRESH_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
      ),
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    },
    accessToken,
    refreshToken,
  };
}

// ======================
// REFRESH TOKEN
// ======================
export async function refreshService(refreshToken: string) {
  if (!refreshToken) {
    throw new Error("Refresh token required");
  }

  const decoded = verifyRefreshToken(refreshToken) as {
    userId: string;
    role: string;
  };

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
    include: {
      user: true,
    },
  });

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    throw new Error("Refresh token expired");
  }

  const accessToken = generateAccessToken(
    storedToken.user.id,
    storedToken.user.role,
  );

  return {
    accessToken,
  };
}
