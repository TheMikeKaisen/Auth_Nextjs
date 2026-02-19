import { db_pool } from "@/lib/db_client";
import { RowDataPacket } from "mysql2/promise";

export const user_repository = {
  find_by_email: async (email: string) => {
    const [rows] = await db_pool.execute<RowDataPacket[]>(
      "SELECT id FROM user_account WHERE email = ?",
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  create_user: async (id: string, full_name: string, email: string, password_hash: string) => {
    await db_pool.execute(
      "INSERT INTO user_account (id, full_name, email, password_hash) VALUES (?, ?, ?, ?)",
      [id, full_name, email, password_hash]
    );
  },
};