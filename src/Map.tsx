import "mapbox-gl/dist/mapbox-gl.css";
import React from "react";
import ReactMapGL, { AttributionControl, Layer, Source } from "react-map-gl";
import type { InteractiveMapProps } from "react-map-gl/src/components/interactive-map";

interface Props extends InteractiveMapProps {
  layer: string;
  LAYER_ORDNANCE_SURVEY: string;
}

const Component = ({ children = null, ...props }: Props) => (
  <ReactMapGL
    width="100%"
    height="100vh"
    mapboxApiAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
    attributionControl={false}
    mapStyle={
      // XXX: Mapbox only shows the Ordnance Survey layer if we give it a valid mapStyle too.
      //      Although this is unfortunate, at least the mapbox layerStyle below works as a fallback
      //      in case Ordnance Survey's API stops working.
      props.layer === props.LAYER_ORDNANCE_SURVEY
        ? "mapbox://styles/opensystemslab/ckbuw2xmi0mum1il33qucl4dv"
        : props.layer
    }
    {...props}
  >
    <AttributionControl
      compact={false}
      customAttribution={process.env.MAP_ATTRIBUTION}
      style={{
        bottom: 0,
        left: 0,
        right: 0,
        fontSize: "0.8rem",
        textAlign: "right",
      }}
    />
    <Source
      id="source_id"
      type="raster"
      tiles={[
        `https://api.os.uk/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}.png?key=${process.env.REACT_APP_ORDNANCE_SURVEY_KEY}`,
      ]}
      tileSize={256}
    >
      <Layer
        type="raster"
        paint={{}}
        layout={{
          visibility:
            props.layer === props.LAYER_ORDNANCE_SURVEY ? "visible" : "none",
        }}
      />
    </Source>
    {children}
  </ReactMapGL>
);

export default Component;
