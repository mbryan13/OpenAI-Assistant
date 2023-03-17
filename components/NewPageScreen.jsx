import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const NewPageScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>New Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 25,
  },
});

export default NewPageScreen;
