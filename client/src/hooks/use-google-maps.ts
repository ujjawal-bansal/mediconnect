import { useEffect, useState } from "react";

declare global {
  interface Window {
    google?: any;
  }
}

interface UseGoogleMapsResult {
  isLoaded: boolean;
  error: string | null;
}

/**
 * Dynamically loads the Google Maps JavaScript API using the API key
 * provided via Vite environment variables.
 *
 * - Uses: VITE_GOOGLE_MAPS_API_KEY
 * - Never hardcodes the key inside components.
 */
export const useGoogleMaps = (): UseGoogleMapsResult => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-google-maps="true"]',
    );

    if (existingScript) {
      if (window.google?.maps) {
        setIsLoaded(true);
      } else {
        existingScript.addEventListener("load", () => setIsLoaded(true));
        existingScript.addEventListener("error", () =>
          setError("Unable to load map at the moment."),
        );
      }
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError("Google Maps API key is not configured.");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";

    script.onload = () => {
      if (window.google?.maps) {
        setIsLoaded(true);
      } else {
        setError("Google Maps loaded but is unavailable.");
      }
    };

    script.onerror = () => {
      setError("Unable to load map at the moment.");
    };

    document.head.appendChild(script);
  }, []);

  return { isLoaded, error };
};



