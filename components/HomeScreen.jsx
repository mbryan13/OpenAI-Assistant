import {useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';

const STORAGE_KEY = 'apiKey';

const HomeScreen = () => {
  const [apiKey, setApiKey] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  console.log('home');
  console.log('response: ', (response));
  useFocusEffect(() => {
    const getApiKey = async () => {
      const value = await SecureStore.getItemAsync(STORAGE_KEY);
      if (value) {
        setApiKey(value);
      }
    };
    getApiKey();
  });


  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Settings');
  };

  useEffect(() => {
    if(response !== '') Speech.speak(response);
  }, [response]);
  const handleSpeak = () => {
    console.log('speak!');
    Speech.speak('oh wow!');
  }

  const handleStartRecording = async () => {
    try {
      setIsRecording(true);
      await Voice.start('en-US');
      Voice.onSpeechResults = (event) => {
        console.log('event: ', event);
        setPrompt(event.value[0]);
      };
    } catch (error) {
      console.log('handleStart error: ', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      await Voice.stop();
      Voice.removeAllListeners();
    } catch (error) {
      console.log('handleStop error: ', error);
    }
  };

  const submitQuery = async () => {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    console.log('prompt: ', prompt);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": prompt}],
        max_tokens: 1000
      })
    });
  
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to generate text from OpenAI API: ${error}`);
    }
  
    const data = await response.json();
    console.log('data: ', data);
    setResponse(data.choices[0].message.content);
  }
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.settings} onPress={handlePress}>
        <Image
          source={{uri: 'https://www.citypng.com/public/uploads/preview/black-round-cog-gear-icon-png-image-11641123347s4r0ejgdft.png'}}
          style={styles.settings}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleStartRecording}>
        <View style={styles.container}>
            <Image
              source={{uri: 'https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png'}}
              style={styles.logo}
            />
            <Text style={styles.text}>OpenAI</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          value={prompt}
          style={styles.input}
          onChangeText={setPrompt}
        />
        <Button title="Submit" onPress={() => submitQuery()} />
      </View>
      {isRecording && (
        <View style={styles.recording}>
          <Text>Recording...</Text>
          <TouchableOpacity onPress={handleStopRecording}>
            <Text>Stop</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 100,
    marginBottom: 15
  },
  text: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 15
  },
  settings: {
    position: 'absolute',
    height: 50,
    width: 50,
    right: 5,
    top: 5
  },
  recording: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  inputContainer: {
    width: '85%',
    borderRadius: 10,
    marginTop: 30
  },
  input: {
    width: '100%',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    height: 200, 
    marginBottom: 15,
    padding: 10,
    textAlignVertical: 'top',
    fontSize: 20
  }
});

export default HomeScreen;
