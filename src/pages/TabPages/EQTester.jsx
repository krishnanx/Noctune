import React from 'react';
import { View, Button } from 'react-native';
import { testBass,resetEQ } from '../../functions/Equailizer/EqualiserTest';

export default function EQTester() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Increase Bass" onPress={() => testBass(1000)} />
      <Button title="Decrease Bass" onPress={() => testBass(-1000)} />
      <Button title="Reset EQ" onPress={resetEQ} />
    </View>
  );
}
