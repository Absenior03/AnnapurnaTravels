export const dynamic = "force-dynamic";
export const runtime = "edge";

export default function SignUpPage() {
  return (
    <>
      <div
        id="auth-container"
        data-auth-type="signup"
        className="min-h-screen flex items-center justify-center"
      >
        <div className="p-12 text-center">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4 mx-auto"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mb-8 mx-auto"></div>
            <div className="h-10 w-72 bg-gray-200 rounded mb-4 mx-auto"></div>
            <div className="h-10 w-72 bg-gray-200 rounded mb-4 mx-auto"></div>
            <div className="h-10 w-72 bg-gray-200 rounded mb-6 mx-auto"></div>
            <div className="h-10 w-72 bg-emerald-100 rounded mb-4 mx-auto"></div>
          </div>
        </div>
      </div>

      <script src="/auth-loader.js" />

      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined' && window.initAuthClient) {
              window.initAuthClient('signup');
            }
          `,
        }}
      />
    </>
  );
}
