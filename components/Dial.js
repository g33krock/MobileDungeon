import React, { useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

const numbers = Array.from(Array(10).keys());

// Get screen dimensions
const { width } = Dimensions.get('window');
const radius = width * 0.1; // Dial radius is 25% of screen width
const fontSize = radius / 5; // Adjust this value to change the font size according to your preference

const Dial = ({ value, position }) => {
  const rotateValue = new Animated.Value(0);

  const rotateAnimation = rotateValue.interpolate({
    inputRange: [0, 9],
    outputRange: ['0deg', '-360deg'],
  });

  useEffect(() => {
    Animated.timing(rotateValue, {
      toValue: value,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <View style={[styles.dialContainer, { width: radius * 2, height: radius * 2, borderRadius: radius }]}>
      <Animated.View style={{ transform: [{ rotate: rotateAnimation }] }}>
        {numbers.map((num, i) => {
          // Calculate angle based on position in array, but offset by current value
          const angle = (Math.PI * 2 * (i - value)) / numbers.length;
          const x = radius * Math.sin(angle) - fontSize / 2;
          const y = -radius * Math.cos(angle) + fontSize / 2;
          const positionOffset = position === 'ones' ? Math.PI : 0;

          return (
            <View
              key={num}
              style={{
                position: 'absolute',
                top: radius - y + positionOffset,
                left: radius + x,
              }}
            >
              <Text style={[styles.dialText, { fontSize }]}>{num}</Text>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  dialContainer: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  dialText: {
    textAlign: 'center',
    position: 'absolute',
    transform: [
      { translateX: -fontSize / 2 },
      { translateY: -fontSize / 2 },
    ],
  },
});

export default Dial;