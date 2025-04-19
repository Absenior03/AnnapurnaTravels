export const dynamic = "force-dynamic";

// This page renders a loading state and redirects to the login page
export default function LoginLoaderPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign In</h1>
        <p className="text-gray-600 text-center mb-8">
          Please wait while we prepare your login page...
        </p>

        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-emerald-100 rounded"></div>
        </div>

        {/* Redirect script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            setTimeout(function() {
              window.location.href = "/(regular-routes)/login";
            }, 1000);
          `,
          }}
        />
      </div>
    </div>
  );
}
