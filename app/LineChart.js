import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Dimensions, Animated, Easing } from "react-native";
import Svg, { G, Line, Circle, Text as SvgText, Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");
export default function LineChart({
  data = [],
  containerHeight = 400,
  circleColor = "#d9d050",
  circleRadius = 4,
  axisColor = "#6da",
  axisWidth = 2,
  axisLabelFontSize = 10,
  chartLineColor = "#d9d050",
  chartLineWidth = 2,
}) {
  //values
  const yAxisMinValue = 0;
  const yAxisMaxValue = Math.max.apply(
    Math,
    data.map(item => item.value),
  );

  // spaces
  const marginForXFromLeft = 50;
  const marginForYFromBottom = 50;
  const paddingFromScreenBorder = 20;
  const xAxisWidth = width - marginForXFromLeft - paddingFromScreenBorder;

  const gapBetweenXAxisTicks = xAxisWidth / (data.length - 1);

  //x-axis graph points
  const xAxisX1Point = marginForXFromLeft;
  const xAxisY1Point = containerHeight - marginForYFromBottom;
  const xAxisX2Point = width - paddingFromScreenBorder;
  const xAxisY2Point = containerHeight - marginForYFromBottom;

  //y-axis Graph points
  const yAxisX1Point = marginForXFromLeft;
  const yAxisY1Point = paddingFromScreenBorder;
  const yAxisX2Point = marginForXFromLeft;
  const yAxisY2Point = containerHeight - marginForYFromBottom;

  //dependant y-axis values
  const yAxisHeight = yAxisY2Point - yAxisY1Point;
  const gapBetweenYAxisTicks =
    (yAxisHeight - yAxisMinValue) / (data.length - 1);
  const gapBetweenYAxisValues =
    (yAxisMaxValue - yAxisMinValue) / (data.length - 1);

  //animated values
  const animatedXAxisWidth = useRef(new Animated.Value(xAxisX1Point)).current;
  const animatedYAxisWidth = useRef(new Animated.Value(yAxisY2Point)).current;
  const animatedCircleRadius = useRef(new Animated.Value(0)).current;
  const animatedLabelsOpacity = useRef(new Animated.Value(0)).current;
  const animatedPathLength = useRef(new Animated.Value(0)).current;
  const animatedPathOpacity = useRef(new Animated.Value(0)).current;
  const animatedPathRef = useRef(null);

  //animated components
  const AnimatedSvg = Animated.createAnimatedComponent(Svg);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const AnimatedLine = Animated.createAnimatedComponent(Line);
  const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);
  const AnimatedPath = Animated.createAnimatedComponent(Path);

  //states
  const [yAxisLabels, setYAxisLabels] = useState([]);
  const [pathLength, setPathLength] = useState(0);

  //Starting Animations
  const startAxisAnimations = () => {
    Animated.timing(animatedXAxisWidth, {
      toValue: xAxisX2Point,
      duration: 1500,
      delay: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedYAxisWidth, {
      toValue: yAxisY1Point,
      duration: 1500,
      delay: 500,
      useNativeDriver: true,
    }).start();
  };
  const startCircleAnimation = () => {
    Animated.timing(animatedCircleRadius, {
      toValue: circleRadius,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };
  const startLabelsAnimation = () => {
    Animated.timing(animatedLabelsOpacity, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };

  const startGraphAnimation = () => {
    animatedPathLength.setValue(pathLength);
    Animated.timing(animatedPathLength, {
      toValue: 0,
      duration: 1500,
      delay: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
    Animated.timing(animatedPathOpacity, {
      toValue: 1,
      delay: 100,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  };

  const startAnimations = () => {
    startAxisAnimations();
    startLabelsAnimation();
    startCircleAnimation();
  };

  const initializeLabels = () => {
    const yAxisData = data.map((item, index) => {
      if (index === 0) return yAxisMinValue;
      else return yAxisMinValue + gapBetweenYAxisValues * index;
    });

    setYAxisLabels(yAxisData);
  };
  useEffect(() => {
    initializeLabels();
    startAnimations();
  }, []);

  useEffect(() => {
    startGraphAnimation();
  }, [pathLength]);

  const getDPath = () => {
    const maxValueAtYAxis = yAxisLabels[yAxisLabels.length - 1];
    if (maxValueAtYAxis) {
      let path = "";
      data.map((item, index) => {
        let xPoint = xAxisX1Point + gapBetweenYAxisTicks * index;
        let yPoint =
          (maxValueAtYAxis - item.value) *
            (gapBetweenYAxisTicks / gapBetweenYAxisValues) +
          paddingFromScreenBorder;
        if (index === 0) path += `M${xPoint} ${yPoint}`;
        else path += `L${xPoint} ${yPoint}`;
      });
      return path;
    }
  };
  const renderBars = () => {
    return (
      <G key="x-axis y-axis">
        <AnimatedCircle
          key="x-axis x1y1-circle"
          cx={xAxisX1Point}
          cy={xAxisY1Point}
          fill={circleColor}
          r={animatedCircleRadius}
        />
        <AnimatedCircle
          key="x-axis x2y2-circle"
          cx={xAxisX2Point}
          cy={xAxisY2Point}
          fill={circleColor}
          r={animatedCircleRadius}
        />
        <AnimatedCircle
          key="y-axis x1y1-circle"
          cx={yAxisX1Point}
          cy={yAxisY1Point}
          fill={circleColor}
          r={animatedCircleRadius}
        />
        <AnimatedLine
          key="x-axis"
          x1={xAxisX1Point}
          y1={xAxisY1Point}
          x2={animatedXAxisWidth}
          y2={xAxisY2Point}
          stroke={axisColor}
          strokeWidth={axisWidth}
        />

        <AnimatedLine
          key="y-axis"
          x1={yAxisX1Point}
          y1={animatedYAxisWidth}
          x2={yAxisX2Point}
          y2={yAxisY2Point}
          stroke={axisColor}
          strokeWidth={axisWidth}
        />
      </G>
    );
  };

  const renderXAxisLabelsAndTicks = () => {
    return data.map((item, index) => (
      <G key={`x-axis labels & ticks${index}`}>
        <AnimatedLine
          key={`x-axis-tick${index}`}
          x1={xAxisX1Point + gapBetweenXAxisTicks * index}
          y1={xAxisY1Point}
          x2={xAxisX1Point + gapBetweenXAxisTicks * index}
          y2={xAxisY1Point + 10}
          strokeWidth={axisWidth}
          stroke={axisColor}
          opacity={animatedLabelsOpacity}
        />
        <AnimatedSvgText
          x={xAxisX1Point + gapBetweenXAxisTicks * index}
          y={xAxisY1Point + 25}
          fill={axisColor}
          fontWeight="400"
          fontSize={axisLabelFontSize}
          textAnchor="middle"
          opacity={animatedLabelsOpacity}>
          {item?.month}
        </AnimatedSvgText>
      </G>
    ));
  };

  const renderYAxisLabelsAndTicks = () => {
    return yAxisLabels.map((item, index) => (
      <G key={`y-axis labels & ticks${index}`}>
        <AnimatedLine
          key={`y-axis tick${index}`}
          x1={marginForXFromLeft}
          y1={yAxisY2Point - gapBetweenYAxisTicks * index}
          x2={marginForXFromLeft - 10}
          y2={yAxisY2Point - gapBetweenYAxisTicks * index}
          stroke={axisColor}
          strokeWidth={axisWidth}
          opacity={animatedLabelsOpacity}
        />
        <AnimatedSvgText
          key={`y-axis label${index}`}
          x={marginForXFromLeft - 20}
          y={
            yAxisY2Point - gapBetweenYAxisTicks * index + axisLabelFontSize / 3
          }
          fill={axisColor}
          fontWeight="400"
          fontSize={axisLabelFontSize}
          textAnchor="end"
          opacity={animatedLabelsOpacity}>
          {parseFloat(item).toFixed(0)}
        </AnimatedSvgText>
      </G>
    ));
  };

  const renderDPath = () => {
    const path = getDPath();
    return (
      <AnimatedPath
        ref={animatedPathRef}
        d={path}
        strokeWidth={chartLineWidth}
        stroke={chartLineColor}
        onLayout={() =>
          setPathLength(animatedPathRef?.current.getTotalLength())
        }
        strokeDasharray={pathLength}
        strokeDashoffset={animatedPathLength}
        opacity={animatedPathOpacity}
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    );
  };

  const renderCircles = () => {
    const maxValueAtYAxis = yAxisLabels[yAxisLabels.length - 1];
    if (maxValueAtYAxis) {
      return data.map((item, index) => {
        let xPoint = xAxisX1Point + gapBetweenYAxisTicks * index;
        let yPoint =
          (maxValueAtYAxis - item.value) *
            (gapBetweenYAxisTicks / gapBetweenYAxisValues) +
          paddingFromScreenBorder;

        return (
          <G key={`line chart circles${index}`}>
            <AnimatedCircle
              cx={xPoint}
              cy={yPoint}
              r={animatedCircleRadius}
              fill={circleColor}
            />
          </G>
        );
      });
    }
  };

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      <AnimatedSvg width="100%" height="100%" style={styles.svg}>
        {renderBars()}
        {renderXAxisLabelsAndTicks()}
        {renderYAxisLabelsAndTicks()}
        {renderDPath()}
        {renderCircles()}
      </AnimatedSvg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#333",
  },
  svg: {
    backgroundColor: "#333",
  },
});
