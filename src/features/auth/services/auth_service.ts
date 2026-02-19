import { hash } from "bcryptjs";
import crypto from "crypto";

import { sign_up_type } from "../validations/auth_schema";
import { user_repository } from "../repositories/user_respository";

export const auth_service = {
  register_new_user: async (user_data: sign_up_type) => {
    // 1. Ask the repository if the user exists
    const existing_user = await user_repository.find_by_email(user_data.email);
    
    if (existing_user) {
      // Throwing a standardized error that the controller will catch
      throw new Error("user_exists");
    }

    // 2. Apply business rules (hashing, ID generation)
    const hashed_password = await hash(user_data.password, 12);
    const new_user_id = crypto.randomUUID();

    // 3. Tell the repository to save the data
    await user_repository.create_user(
      new_user_id,
      user_data.full_name,
      user_data.email,
      hashed_password
    );

    return new_user_id;
  },
};