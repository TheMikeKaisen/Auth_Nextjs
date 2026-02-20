import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { token_utils } from "@/lib/jwt_utils";
import { user_repository } from "@/features/auth/repositories/user_repository";
import { LogoutButton } from "@/features/auth/components/logout_button";

// Ensure this page is never cached statically so the user data is always fresh
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookie_store = await cookies();
  const access_token = cookie_store.get("access_token")?.value;

  if (!access_token) {
    redirect("/login");
  }

  const decoded_payload = await token_utils.verify_access_token(access_token);
  
  if (!decoded_payload) {
    redirect("/login");
  }

  const user = await user_repository.find_by_id(decoded_payload.user_id);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Provus Portal
              </h1>
            </div>
            <div className="flex items-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          
          {/* Welcome Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Hello, {user.full_name}! 👋
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Welcome to your secure dashboard. Your session is protected by rotating JSON Web Tokens.
            </p>
          </div>

          {/* Placeholder for Dashboard Widgets */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Widget 1 */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Account Status</dt>
                <dd className="mt-1 text-3xl font-semibold text-green-600">Active</dd>
              </div>
            </div>

            {/* Widget 2 */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Registered Email</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">{user.email}</dd>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}