import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'apiKey';

const SettingsScreen = () => {
  const [apiKey, setApiKey] = useState('');
  const [recentlySaved, setRecentlySaved] = useState(false);

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
      .then(() => {
        setRecentlySaved(true);
        setTimeout(() => setRecentlySaved(false), 3000);
      })
      .catch(error => console.log(error));
  };

  return (
    <View style={styles.mainContainer}>
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
        {recentlySaved && <Text style={styles.saved}>API key saved!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 20,
    flex: 1,
    gap: 15,
    backgroundColor: 'rgba(68,70,84,1)'
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 28,
    marginBottom: 10,
    color: 'white'
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    backgroundColor: 'black',
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 20,
    fontSize: 30,
    color: 'white'
  },
  saved: {
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold'
  }
});

export default SettingsScreen;
