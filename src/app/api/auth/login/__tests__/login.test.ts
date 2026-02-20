// 1. ALL MOCKS AT THE TOP
jest.mock("@/features/auth/services/auth_service");
jest.mock("@/lib/jwt_utils", () => ({
  token_utils: {
    sign_access_token: jest.fn().mockResolvedValue("mock_access"),
    generate_refresh_token: jest.fn().mockReturnValue("mock_refresh"),
    hash_refresh_token: jest.fn().mockReturnValue("mock_hash"),
  }
}));

// Mock next/headers for cookies
const mock_cookie_set = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn().mockResolvedValue({
    set: (...args: unknown[]) => mock_cookie_set(...args),
    get: jest.fn(),
    delete: jest.fn(),
  }),
}));

// 2. IMPORTS
import { POST } from "../route";
import { auth_service } from "@/features/auth/services/auth_service";
import { http_status } from "@/lib/http_status";
import { NextRequest } from "next/server";

describe("Login API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and set cookies on successful login", async () => {
    (auth_service.authenticate_user as jest.Mock).mockResolvedValue({
      user: { id: "1", full_name: "Karthik", email: "k@gmail.com" },
      access_token: "fake_access",
      refresh_token: "fake_refresh",
    });

    const req = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "k@gmail.com",
        password: "Karthik123",
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    // Debug: If it still fails, see what the error message is
    if (response.status !== 200) {
        console.log("Error Response Data:", data);
    }

    expect(response.status).toBe(http_status.ok);
    expect(data.user.full_name).toBe("Karthik");
    
    // Verify that cookies.set was called twice (access + refresh)
    expect(mock_cookie_set).toHaveBeenCalledTimes(2);
  });
});