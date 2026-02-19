import { auth_error_type } from "@/features/auth/constants/auth_errors";
import { http_status } from "./http_status";

export class app_error extends Error {
  public readonly code: auth_error_type;
  public readonly status_code: number;

  constructor(code: auth_error_type, message: string, status_code: http_status) {
    super(message);
    this.code = code;
    this.status_code = status_code;
    
    // Restores the prototype chain 
    Object.setPrototypeOf(this, new.target.prototype);
  }
}