import { SignJWT, jwtVerify } from "jose";
import { env } from "./env";

export interface jwt_payload {
  user_id: string;
  email: string;
  [key: string]: unknown; // jose requires this index signature for verification
}

const secret_key = new TextEncoder().encode(env.JWT_SECRET);
export const jwt_utils = {
  sign_token: async (payload: jwt_payload): Promise<string> => {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret_key);
  },

  verify_token: async (token: string): Promise<jwt_payload | null> => {
    try {
      const { payload } = await jwtVerify(token, secret_key);
      return payload as jwt_payload;
    } catch (error) {
      console.error("JWT verification failed:", error);
      return null;
    }
  },
};