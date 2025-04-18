// Import CSS instead of using the font loader to avoid SWC conflicts
// This file will be imported with a standard import statement to avoid the need for SWC

import localFont from "next/font/local";

export const fontClasses = {
  heading: "font-heading",
  body: "font-body",
};

export function addFontStyles() {
  // Add this to the <head> of your document via a standard <style> tag
  return `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap');
    
    :root {
      --font-cormorant: 'Cormorant Garamond', serif;
      --font-libre: 'Libre Baskerville', serif;
    }
    
    .font-heading {
      font-family: var(--font-cormorant);
    }
    
    .font-body {
      font-family: var(--font-libre);
    }
  `;
}
