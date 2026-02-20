import { auth_service } from "../auth_service";
import { app_error } from "@/lib/app_error";
import { http_status } from "@/lib/http_status";
import { user_repository } from "../../repositories/user_repository";
import { auth_error_type } from "../../constants/auth_errors";

jest.mock("../../repositories/user_repository");
jest.mock("../../repositories/refresh_token_repository");

jest.mock("@/lib/jwt_utils", () => ({
  token_utils: {
    sign_access_token: jest.fn().mockResolvedValue("mock_access_token"),
    generate_refresh_token: jest.fn().mockReturnValue("mock_refresh_token"),
    hash_refresh_token: jest.fn().mockReturnValue("mock_hash"),
  },
}));

describe("auth_service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register_new_user", () => {
    const mock_sign_up_data = {
      full_name: "Test User",
      email: "test@example.com",
      password: "Password123!",
      confirm_password: "Password123!"
    };

    it("should successfully register a new user and return tokens", async () => {
      (user_repository.find_by_email as jest.Mock).mockResolvedValue(null);
      
      (user_repository.create_user as jest.Mock).mockResolvedValue(undefined);

      const result = await auth_service.register_new_user(mock_sign_up_data);

      expect(result).toHaveProperty("user");
      expect(result.user.email).toBe(mock_sign_up_data.email);
      expect(result).toHaveProperty("access_token");
      expect(result).toHaveProperty("refresh_token");
      
      // Assertion: Check that the database was actually called
      expect(user_repository.create_user).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if the email already exists", async () => {
      // Setup: Pretend the database says the email IS taken
      (user_repository.find_by_email as jest.Mock).mockResolvedValue({
        id: "123",
        email: "test@example.com",
      });

      // Action & Assertion: We expect the service to throw our custom app_error
      await expect(
        auth_service.register_new_user(mock_sign_up_data)
      ).rejects.toThrow(app_error);

      try {
        await auth_service.register_new_user(mock_sign_up_data);
      } catch (e) {
        const error = e as app_error;
        // Assert the exact error code and status
        expect(error.code).toBe(auth_error_type.user_exists);
        expect(error.status_code).toBe(http_status.conflict);
      }

      // Ensure it never tried to create the user
      expect(user_repository.create_user).not.toHaveBeenCalled();
    });
  });
});