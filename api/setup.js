// Import module-alias at the top of your entry file
require("module-alias/register");

// Add the path aliases
require("../moduleAlias");

// This function can be called as an API route to check if setup is working
export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    message: "Module aliases registered successfully",
  });
}
