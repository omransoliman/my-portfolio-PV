import React from "react";

function HomePage() {
  return (
    <div>
      <h1>Welcome to My Website</h1>
      <p>Explore my portrait gallery below:</p>
      <iframe
        src="https://omransoliman.pixieset.com/portrait/"
        style={{
          width: "100%",
          height: "80vh",
          border: "none",
        }}
        title="Portrait Gallery"
      ></iframe>
    </div>
  );
}

export default HomePage;