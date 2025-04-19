// Client-side auth
(function () {
  console.log("Loading signup form client-side...");

  // Find the container
  const container = document.getElementById("auth-container");
  if (!container) {
    console.error("Auth container not found");
    return;
  }

  // Load the React dependencies (already on the page from Next.js)
  const React = window.React;

  // Create loading UI
  container.innerHTML = `
    <div class="p-12 text-center">
      <h2 class="text-xl font-semibold mb-4">Please Wait</h2>
      <p class="mb-4">Loading signup form...</p>
      <div class="animate-pulse">
        <div class="h-10 bg-gray-200 rounded mb-4"></div>
        <div class="h-10 bg-gray-200 rounded mb-4"></div>
        <div class="h-10 bg-gray-200 rounded mb-4"></div>
        <div class="h-10 bg-emerald-100 rounded"></div>
      </div>
    </div>
  `;

  // Redirect to signup form directly
  setTimeout(() => {
    window.location.href = "/signup";
  }, 2000);
})();
