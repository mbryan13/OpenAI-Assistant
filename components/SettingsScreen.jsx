import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ThemeContext } from '../themes/ThemeContext';

const STORAGE_KEY = 'apiKey';

const SettingsScreen = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
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
    <View style={[styles.mainContainer, { backgroundColor: theme.bgPrimary }]}>
      <View style={styles.container}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>API Key</Text>
        <TextInput
          style={[styles.input, { color: theme.textPrimary, borderColor: theme.borderPrimary, backgroundColor: theme.bgSecondary }]}
          value={apiKey}
          onChangeText={setApiKey}
          secureTextEntry
        />
        <Button title="Save" onPress={handleSave} />
      </View>
      <Button title="Toggle theme" onPress={toggleTheme}></Button>
        {recentlySaved && <Text style={styles.saved}>API key saved!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 20,
    paddingHorizontal:10,
    flex: 1,
    gap: 15,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 28,
    marginBottom: 10  
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 20,
    fontSize: 30,
  },
  saved: {
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold'
  }
});

export default SettingsScreen;
