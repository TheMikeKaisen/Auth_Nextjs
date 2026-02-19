export const cookie_names = {
  access_token: "access_token",
  refresh_token: "refresh_token",
} as const;

export const api_routes = {
  auth: {
    login: "/api/auth/login",
    sign_up: "/api/auth/sign_up",
    logout: "/api/auth/logout",
    refresh: "/api/auth/refresh",
  },
} as const;

export const page_routes = {
  home: "/",
  dashboard: "/dashboard",
  login: "/login",
  sign_up: "/sign_up",
} as const;