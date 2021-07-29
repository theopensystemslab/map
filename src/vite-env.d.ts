/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_ORDNANCE_SURVEY_KEY: string;
  VITE_APP_OS_WFS_KEY: string;
}

declare module "ol-mapbox-style/dist/stylefunction";
