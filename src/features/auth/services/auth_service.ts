import { compare, hash } from "bcryptjs";
import crypto from "crypto";

import { login_type, sign_up_type } from "../validations/auth_schema";
import { user_repository } from "../repositories/user_respository";
import { app_error } from "@/lib/app_error";
import { auth_error_type } from "../constants/auth_errors";
import { http_status } from "@/lib/http_status";

export const auth_service = {
  register_new_user: async (user_data: sign_up_type) => {
    const existing_user = await user_repository.find_by_email(user_data.email);
    
    if (existing_user) {
      throw new app_error(
        auth_error_type.user_exists,
        "A user with this email already exists",
        http_status.conflict
      )
    }

    const hashed_password = await hash(user_data.password, 12);
    const new_user_id = crypto.randomUUID();

    await user_repository.create_user(
      new_user_id,
      user_data.full_name,
      user_data.email,
      hashed_password
    );

    return new_user_id;
  },



  authenticate_user: async (credentials: login_type) => {
    const user = await user_repository.find_user_for_login(credentials.email);
    
    if (!user) {
      throw new app_error(
        auth_error_type.invalid_credentials,
        "Invalid email or password.",
        http_status.unauthorized
      );
    }

    const is_password_valid = await compare(credentials.password, user.password_hash);
    
    if (!is_password_valid) {
      throw new app_error(
        auth_error_type.invalid_credentials,
        "Invalid email or password.",
        http_status.unauthorized
      );
    }

    // critical: do not return hashed password
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
    };
  },

};