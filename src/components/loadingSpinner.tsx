import React, { useEffect, useRef } from "react";
import { Animated, View, Image, StyleSheet, Text } from "react-native";

export function LoadingSpinner() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/wormies-outdoors.svg')}
        style={[styles.image, { transform: [{ rotate: rotation }] }]}
      />
      <Text>Carregando</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
  },
});
