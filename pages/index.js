import React, { useEffect } from "react";

function HomePage() {
  useEffect(() => {
    // Check if the script is already added
    if (!window.picflow) {
      window.picflow = true;
      const script = document.createElement("script");
      script.src = "https://picflow.com/embed/main.js";
      script.type = "module";
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div>
      <h1>Welcome to My Website</h1>
      <p>This is the homepage with a Picflow gallery:</p>
      {/* Picflow gallery element */}
      <picflow-gallery id="gal_cBCgnwN8J3xVUCf7" lightbox="#000000E6"></picflow-gallery>
    </div>
  );
}

export default HomePage;