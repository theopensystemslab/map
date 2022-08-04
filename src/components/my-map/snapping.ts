import { Feature } from "ol";
import Point from "ol/geom/Point";
import { Vector as VectorLayer } from "ol/layer";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorSource from "ol/source/Vector";
import { Fill, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { splitEvery } from "rambda";

export const pointsSource = new VectorSource({
  features: [],
  wrapX: false,
});

export const pointsLayer = new VectorLayer({
  source: pointsSource,
  style: new Style({
    image: new CircleStyle({
      radius: 3,
      fill: new Fill({
        color: "grey",
      }),
    }),
  }),
});

/**
 * Extract points that are available to snap to when a VectorTileLayer basemap is displayed
 * @param basemap - a VectorTileLayer
 * @param extent - an array of 4 points
 * @returns - a VectorSource populated with points within the extent
 */
export function getSnapPointsFromVectorTiles(
  basemap: VectorTileLayer,
  extent: number[]
) {
  const points =
    basemap &&
    basemap
      .getSource()
      ?.getFeaturesInExtent(extent)
      ?.filter((feature) => feature.getGeometry()?.getType() !== "Point")
      ?.flatMap((feature: any) => feature.flatCoordinates_);

  if (points) {
    return (splitEvery(2, points) as [number, number][]).forEach((pair, i) => {
      pointsSource.addFeature(
        new Feature({
          geometry: new Point(pair),
          i,
        })
      );
    });
  }
}
