import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

export default {
  Point: new Style({
    image: new CircleStyle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: "magenta",
      }),
    }),
  }),
  Polygon: new Style({
    // stroke: new Stroke({
    //   color: "red",
    //   lineDash: [4],
    //   width: 3,
    // }),
    fill: new Fill({
      color: "rgba(0, 0, 255)",
    }),
  }),
  MultiPolygon: (color, strokewidth) => {
    return new Style({
      stroke: new Stroke({
        color: strokewidth === 0 ? 'transparent' : 'red',
        width: strokewidth,
      }),
      fill: new Fill({
        color: color,
      }),
    })
  },
};
