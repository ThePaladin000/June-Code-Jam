export async function fetchPlaces(input) {
  const apiKey = import.meta.env.VITE_MAPS_API_KEY;
  if (!input) return [];
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.predictions || [];
}
