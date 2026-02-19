import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";
import { env } from "@/lib/env";

export interface jwt_payload {
  user_id: string;
  email: string;
  [key: string]: unknown;
}

const secret_key = new TextEncoder().encode(env.JWT_SECRET);

export const token_utils = {
  sign_access_token: async (payload: jwt_payload): Promise<string> => {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(secret_key);
  },

  verify_access_token: async (token: string): Promise<jwt_payload | null> => {
    try {
      const { payload } = await jwtVerify(token, secret_key);
      return payload as jwt_payload;
    } catch {
      return null; 
    }
  },

  // 2. Opaque Refresh Token (e.g., 64 random hex characters)
  generate_refresh_token: () => {
    return crypto.randomBytes(32).toString("hex");
  },

  hash_refresh_token: (token: string) => {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
};