import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import NativeDrivingGame from './src/NativeDrivingGame';

export default function App() {
  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <NativeDrivingGame />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#90b5cb' },
});
