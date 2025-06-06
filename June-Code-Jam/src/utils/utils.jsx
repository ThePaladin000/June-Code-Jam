export async function fetchAutocompleteSuggestions(input) {
  const apiKey = import.meta.env.VITE_MAPS_API_KEY;
  if (!input) return [];
  const url = "https://places.googleapis.com/v1/places:autocomplete";
  const body = JSON.stringify({
    input,
  });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat",
    },
    body,
  });
  const data = await response.json();
  return (data.suggestions || [])
    .filter((s) => s.placePrediction)
    .map((s) => ({
      placeId: s.placePrediction.placeId,
      description: s.placePrediction.text.text,
      mainText: s.placePrediction.structuredFormat?.mainText?.text,
      secondaryText: s.placePrediction.structuredFormat?.secondaryText?.text,
    }));
}
