/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_OS_VECTOR_TILES_API_KEY: string;
  VITE_APP_OS_FEATURES_API_KEY: string;
  VITE_APP_OS_PLACES_API_KEY: string;
  VITE_APP_MAPBOX_ACCESS_TOKEN: string;
}

declare module "ol-mapbox-style/dist/stylefunction";
declare module "accessible-autocomplete";
