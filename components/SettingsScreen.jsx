import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'apiKey';

const SettingsScreen = () => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    SecureStore.getItemAsync(STORAGE_KEY)
      .then(value => {
        if (value) {
          setApiKey(value);
        }
      })
      .catch(error => console.log(error));
  }, []);

  const handleSave = () => {
    SecureStore.setItemAsync(STORAGE_KEY, apiKey)
      .then(() => console.log('API key saved successfully!'))
      .catch(error => console.log(error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>API Key</Text>
      <TextInput
        style={styles.input}
        value={apiKey}
        onChangeText={setApiKey}
        secureTextEntry
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 28,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 20,
    fontSize: 30,
  }
});

export default SettingsScreen;
