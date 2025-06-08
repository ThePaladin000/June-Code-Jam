import { useEffect } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Search from "./components/search";
import { loadGoogleMapsScript } from "./utils/loadGoogleMaps";

// NEW: Import our clean hook
import { usePlaces } from "./hooks/usePlaces";

function App() {
  // NEW: Use the hook - so clean!
  const { places, loading, error, addPlace } = usePlaces();

  useEffect(() => {
    loadGoogleMapsScript(import.meta.env.VITE_MAPS_API_KEY);
  }, []);

  // Test function
  const testHook = async () => {
    try {
      await addPlace({
        name: "Hook Test Park",
        description: "Testing our new React hook!",
        location: { lat: 40.7580, lng: -73.9855 },
        type: "park",
        address: "Hook Test Address",
        amenities: ["react-hooks", "clean-code"]
      });
    } catch (error) {
      console.error('Test failed:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="main-container">
        <h1>Green Finder</h1>
        
        {/* Hook Test Section */}
        <div style={{ 
          backgroundColor: '#e3f2fd', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          color: '#333'
        }}>
          <h3>🪝 React Hook Test</h3>
          
          <button onClick={testHook} style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '15px'
          }}>
            Test usePlaces Hook
          </button>

          <div>
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error || 'None'}</p>
            <p><strong>Places Count:</strong> {places.length}</p>
          </div>
        </div>

        <Search />
      </div>
      <Footer />
    </>
  );
}

export default App;
