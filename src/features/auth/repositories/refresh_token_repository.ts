import { db_pool } from "@/lib/db_client";
import { RowDataPacket } from "mysql2/promise";

export interface refresh_token_row extends RowDataPacket {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
}

export const refresh_token_repository = {
  create_token: async (id: string, user_id: string, token_hash: string, expires_at: Date) => {
    await db_pool.execute(
      "INSERT INTO refresh_token (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)",
      [id, user_id, token_hash, expires_at]
    );
  },

  find_token_by_hash: async (token_hash: string) => {
    const [rows] = await db_pool.execute<refresh_token_row[]>(
      "SELECT id, user_id, token_hash, expires_at FROM refresh_token WHERE token_hash = ?",
      [token_hash]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  delete_token: async (id: string) => {
    await db_pool.execute("DELETE FROM refresh_token WHERE id = ?", [id]);
  },

  // Reuse Detection
  revoke_all_tokens_for_user: async (user_id: string) => {
    await db_pool.execute("DELETE FROM refresh_token WHERE user_id = ?", [user_id]);
  }
};