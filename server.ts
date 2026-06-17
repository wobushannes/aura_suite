import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { INITIAL_MOCK_DATA } from "./src/mockData";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware with generous limits to support embedded high-fidelity assets (files, images, etc.)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const dataFilePath = path.join(process.cwd(), "crm_data.json");

  // Load CRM Data Helper
  function loadDataFromFile() {
    try {
      if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, "utf-8");
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.error("Error reading data file:", e);
    }
    // Fallback/Initial write
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(INITIAL_MOCK_DATA, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing default data file:", e);
    }
    return INITIAL_MOCK_DATA;
  }

  // API endpoints
  app.get("/api/crm-data", (req, res) => {
    const data = loadDataFromFile();
    res.json(data);
  });

  app.post("/api/crm-data", (req, res) => {
    try {
      const newData = req.body;
      if (!newData || typeof newData !== "object") {
        return res.status(400).json({ error: "Invalid data format" });
      }
      fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), "utf-8");
      res.json({ success: true });
    } catch (e) {
      console.error("Error saving CRM data:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
