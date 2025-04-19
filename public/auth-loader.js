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

  // Redirect to the client-rendered page
  setTimeout(function () {
    window.location.href = type === "login" ? "/login" : "/signup";
  }, 1500);
};
