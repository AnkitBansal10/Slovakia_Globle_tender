import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

export default function OZLoadingScreen() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200, // speed of rotation
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analysis is in progress</Text>
      <Text style={styles.sub}>Please wait a moment...</Text>

      <View style={styles.ring}>
        <Animated.View
          style={[
            styles.progress,
            { transform: [{ rotate }] },
          ]}
        />
      </View>

      <Text style={styles.footer}>Waiting for results...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 6,
  },
  sub: {
    color: '#9A9A9A',
    fontSize: 14,
    marginBottom: 40,
  },
  ring: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 14,
    borderColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  progress: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 14,
    borderColor: '#12C7C2',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  footer: {
    color: '#9A9A9A',
    fontSize: 14,
  },
});
