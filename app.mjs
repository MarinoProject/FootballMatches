import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonday(date) {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return new Date(date.setDate(date.getDate() + diff));
}

function getSunday(monday) {
  return new Date(monday.getTime() + 7 * 24 * 60 * 60 * 1000);
}

app.get("/", (req, res) => {
  res.send("root path");
});

app.get("/api/football-data", async (req, res) => {
  try {
    const today = new Date();
    const monday = getMonday(new Date(today));
    const sunday = getSunday(monday);

    const dateFrom = formatDate(monday);
    const dateTo = formatDate(sunday);

    const apiURL = `https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    const apiToken = "";

    const response = await fetch(apiURL, {
      headers: {
        "X-Auth-Token": apiToken,
      },
    });

    const data = await response.json();
    console.log("API Response:", data);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
