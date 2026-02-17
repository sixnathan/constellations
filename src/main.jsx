import { createRoot } from "react-dom/client";
import { ConvexProvider } from "convex/react";
import { convex, isConvexEnabled } from "./lib/convexClient.js";
import { migrateLocalDataToConvex } from "./lib/migration.js";
import App from "./App.jsx";

if (isConvexEnabled) {
  migrateLocalDataToConvex();
}

function Root() {
  if (isConvexEnabled) {
    return (
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    );
  }
  return <App />;
}

createRoot(document.getElementById("root")).render(<Root />);
