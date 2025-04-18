/**
 * This script provides a safe way to load auth components only on the client side
 * preventing the "useAuth must be used within an AuthProvider" error in Vercel deploys
 */

// Global function to initialize auth client
window.initAuthClient = function (type) {
  console.log("Auth client initializing:", type);

  const container = document.getElementById("auth-container");
  if (!container) {
    console.error("Auth container not found");
    return;
  }

  // Display loading state
  container.innerHTML = `
    <div class="p-12 text-center">
      <h2 class="text-xl font-semibold mb-4">Loading ${
        type === "login" ? "Login" : "Signup"
      } Form</h2>
      <div class="animate-pulse">
        <div class="h-10 bg-gray-200 rounded mb-4"></div>
        <div class="h-10 bg-gray-200 rounded mb-4"></div>
        <div class="h-10 bg-emerald-100 rounded"></div>
      </div>
    </div>
  `;

  // Dynamically load the appropriate client bundle
  const script = document.createElement("script");
  script.src = type === "login" ? "/login-client.js" : "/signup-client.js";
  script.async = true;
  script.onload = function () {
    console.log("Auth client loaded successfully");
  };
  script.onerror = function () {
    console.error("Failed to load auth client");
    container.innerHTML = `
      <div class="p-12 text-center text-red-500">
        <h2 class="text-xl font-semibold mb-4">Error Loading Auth</h2>
        <p>Please refresh the page to try again</p>
        <button onclick="window.location.reload()" class="mt-4 px-4 py-2 bg-emerald-600 text-white rounded">
          Refresh
        </button>
      </div>
    `;
  };

  document.body.appendChild(script);
};
