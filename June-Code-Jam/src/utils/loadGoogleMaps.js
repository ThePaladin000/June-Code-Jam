let googleMapsScriptLoadingPromise = null;

export function loadGoogleMapsScript(apiKey) {
  if (window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve();
  }
  if (googleMapsScriptLoadingPromise) {
    return googleMapsScriptLoadingPromise;
  }
  // Check if a script with the same src already exists
  const existingScript = Array.from(
    document.getElementsByTagName("script")
  ).find((s) => s.src.includes("maps.googleapis.com/maps/api/js"));
  if (existingScript) {
    // If script exists but not loaded yet, return a promise that resolves on load
    googleMapsScriptLoadingPromise = new Promise((resolve, reject) => {
      existingScript.addEventListener("load", resolve);
      existingScript.addEventListener("error", reject);
    });
    return googleMapsScriptLoadingPromise;
  }
  googleMapsScriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
  return googleMapsScriptLoadingPromise;
}
