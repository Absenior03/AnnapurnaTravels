module.exports = {
  extends: "next",
  rules: {
    // Disable all rules
    "react/no-unescaped-entities": "off",
    "@next/next/no-html-link-for-pages": "off",
    "@next/next/no-img-element": "off",
    "react/display-name": "off",
    "jsx-a11y/alt-text": "off",
    "import/no-anonymous-default-export": "off",
    "react-hooks/rules-of-hooks": "off",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
  },
  // Ignore all files
  ignorePatterns: ["**/*"],
};
