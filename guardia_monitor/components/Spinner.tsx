import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';

export default function Spinner() {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000, // 1 secondo per rotazione
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();
  }, [rotation]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View>
      <Animated.View style={[styles.spinner, { transform: [{ rotate: rotateInterpolate }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  spinner: {
    width: 50,
    height: 50,
    marginBottom: 10,
    borderWidth: 5,
    borderColor: '#999',
    borderTopColor: 'transparent',
    borderRadius: 25,
  },
});
