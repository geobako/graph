import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Svg, { Path, Defs, Stop, LinearGradient } from "react-native-svg";
import { scaleLinear, scaleTime } from "d3-scale";
import * as shape from "d3-shape";

import { parsePath, serializePath } from "../components/AnimatedHelpers";
import Cursor from "./Cursor";

const { width } = Dimensions.get("window");
const height = width;
const data: [number, number][] = [
  { x: new Date(2019, 12, 1), y: 4371 },
  { x: new Date(2020, 1, 1), y: 6198 },
  { x: new Date(2020, 2, 1), y: 5310 },
  { x: new Date(2020, 3, 1), y: 7188 },
  { x: new Date(2020, 4, 1), y: 8677 },
  { x: new Date(2020, 5, 1), y: 5012 },
].map((p) => [p.x.getTime(), p.y]);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});

const domain = {
  x: [Math.min(...data.map(([x]) => x)), Math.max(...data.map(([x]) => x))],
  y: [Math.min(...data.map(([, y]) => y)), Math.max(...data.map(([, y]) => y))],
};

const Graph = () => {
  const scaleX = scaleTime().domain(domain.x).range([0, width]);
  const scaleY = scaleLinear().domain(domain.y).range([height, 0]);
  const d = shape
    .line()
    .x(([x]) => scaleX(x))
    .y(([, y]) => scaleY(y))
    .curve(shape.curveBasis)(data) as string;
  const path = parsePath(d);
  const d2 = serializePath(path);
  return (
    <View style={styles.container}>
      <View>
        <Svg {...{ width, height }}>
          <Defs>
            <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="gradient">
              <Stop stopColor="#CDE3F8" offset="0%" />
              <Stop stopColor="#eef6fd" offset="80%" />
              <Stop stopColor="#FEFFFF" offset="100%" />
            </LinearGradient>
          </Defs>
          <Path
            fill="transparent"
            stroke="#367be2"
            strokeWidth={5}
            {...{ d }}
          />
          <Path fill="transparent" stroke="red" strokeWidth={5} d={d2} />
          <Path
            d={`${d}  L ${width} ${height} L 0 ${height}`}
            fill="url(#gradient)"
          />
        </Svg>
        <Cursor {...{ path }} />
      </View>
    </View>
  );
};

export default Graph;