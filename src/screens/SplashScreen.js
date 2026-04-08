import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function SplashScreen({ onFinish }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(lineWidth, {
        toValue: 120,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.delay(1000),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.logo, { opacity }]}>
        CROMA
      </Animated.Text>
      <Animated.View style={[styles.linha, { width: lineWidth }]} />
      <Text style={styles.sub}>Mobile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B4FE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 6,
  },
  linha: {
    height: 2,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    opacity: 0.7,
  },
  sub: {
    position: 'absolute',
    bottom: 40,
    color: '#FFFFFF',
    opacity: 0.6,
    fontSize: 13,
    letterSpacing: 2,
  },
});