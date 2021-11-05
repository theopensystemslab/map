import { Vector as VectorLayer } from "ol/layer";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorSource from "ol/source/Vector";
import { Fill, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";

export const pointsSource = new VectorSource({
  features: [],
  wrapX: false,
});

export const pointsLayer = new VectorLayer({
  source: pointsSource,
  style: function () {
    return new Style({
      image: new CircleStyle({
        radius: 4,
        fill: new Fill({ color: "green" }),
      }),
    });
  },
});

/**
 * Extract points that are available to snap to when a VectorTileLayer basemap is displayed
 * @param basemap - a VectorTileLayer
 * @param extent - an array of 4 points
 * @returns - an array of points within the extent
 */
export function getPointsFromVectorTiles(
  basemap: VectorTileLayer,
  extent: number[]
) {
  return basemap
    .getSource()
    .getFeaturesInExtent(extent)
    .filter((feature) => feature.getGeometry().getType() !== "Point")
    .flatMap((feature: any) => feature.flatCoordinates_);
}
