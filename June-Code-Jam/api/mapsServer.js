import express from "express";
import fetch from "node-fetch";
import { GoogleAuth } from "google-auth-library";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your service account key file
const SERVICE_ACCOUNT_KEY_PATH = path.join(
  __dirname,
  "../service-account.json"
);

const app = express();
app.use(cors());

const auth = new GoogleAuth({
  keyFile: SERVICE_ACCOUNT_KEY_PATH,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

app.get("/api/place-details", async (req, res) => {
  const { placeId } = req.query;
  if (!placeId) {
    return res.status(400).json({ error: "Missing placeId" });
  }

  try {
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const fields = "name,formatted_address,id,photos,location";
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=${fields}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken.token || accessToken}`,
        "X-Goog-FieldMask": fields,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();

    // Extract the first photo URL if available
    let photoUrl = null;
    if (data.photos && data.photos.length > 0 && data.photos[0].name) {
      // Construct the photo URL using the v1 API
      photoUrl = `https://places.googleapis.com/v1/${data.photos[0].name}/media?maxWidthPx=600&key=${process.env.VITE_MAPS_API_KEY}`;
    }

    res.json({ ...data, photoUrl });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

app.get("/api/nearby-parks", async (req, res) => {
  const { placeId } = req.query;
  if (!placeId) {
    return res.status(400).json({ error: "Missing placeId" });
  }

  try {
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    // 1. Get the location of the selected place
    const placeFields = "location";
    const placeUrl = `https://places.googleapis.com/v1/places/${placeId}?fields=${placeFields}`;
    const placeResp = await fetch(placeUrl, {
      headers: {
        Authorization: `Bearer ${accessToken.token || accessToken}`,
        "X-Goog-FieldMask": placeFields,
      },
    });
    const placeData = await placeResp.json();
    const { latitude, longitude } = placeData.location || {};

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Could not get location for placeId" });
    }

    // 2. Search for nearby parks
    const nearbyUrl = "https://places.googleapis.com/v1/places:searchNearby";
    const body = JSON.stringify({
      includedTypes: ["park"],
      excludedTypes: [
        "restaurant",
        "cafe",
        "bar",
        "store",
        "supermarket",
        "bakery",
      ],
      maxResultCount: 5,
      locationRestriction: {
        circle: {
          center: { latitude, longitude },
          radius: 20000,
        },
      },
    });
    console.log(
      "Fetching nearby parks for placeId:",
      placeId,
      "at",
      new Date().toISOString()
    );
    const parksResp = await fetch(nearbyUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken.token || accessToken}`,
        "Content-Type": "application/json",
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.id,places.photos,places.location",
      },
      body,
    });
    const parksData = await parksResp.json();
    console.log(
      "Nearby parks API response:",
      JSON.stringify(parksData, null, 2)
    );

    // 3. Format parks with photo URLs
    const parks = (parksData.places || []).map((park) => {
      let photoUrl = null;
      if (park.photos && park.photos.length > 0 && park.photos[0].name) {
        photoUrl = `https://places.googleapis.com/v1/${park.photos[0].name}/media?maxWidthPx=600&key=${process.env.VITE_MAPS_API_KEY}`;
      }
      return {
        id: park.id,
        name: park.displayName?.text || park.name,
        formatted_address: park.formattedAddress,
        photoUrl,
      };
    });

    res.json({ parks });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default app;
