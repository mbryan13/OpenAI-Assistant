import {useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput, Button, Animated } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';
import { Picker } from '@react-native-picker/picker';


const STORAGE_KEY = 'apiKey';

const HomeScreen = () => {
  const [apiKey, setApiKey] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [sentPrompt, setSentPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [awaiting, setAwaiting] = useState(false);
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [step, setStep] = useState(1);
  const [isTutorial, setIsTutorial] = useState();

  const tutorialMessages = ['Click on the logo to activate voice input.', 'The dropdown menu allows you to choose the OpenAI model to query.', 'Alternatively, type in your prompt in the input box.', 'Access settings and past logs in the top right corner.' ];

  console.log('home');
  console.log('step: ', step);
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

  const handlePress = page => {
    navigation.navigate(page);
  };

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

  const submitQuery = async (url, body) => {
    setAwaiting(true);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });
  
    if (!response.ok) {
      const error = await response.text();
      setAwaiting(false);
      throw new Error(`Failed to generate text from OpenAI API: ${error}`);
    }
  
    const data = await response.json();
    return data;
  }

  const modelQueries = {
    'gpt-3.5-turbo': async () => {
      const url = 'https://api.openai.com/v1/chat/completions';
      const body = {
        model: model,
        messages: [{"role": "user", "content": prompt}],
        max_tokens: 1000
      }
      const response = await submitQuery(url, body);
      setAwaiting(false);
      return response.choices[0].message.content;
      // setResponse(response.choices[0].message.content);
    },
    'gpt-4': async () => {
      const url = 'https://api.openai.com/v1/chat/completions';
      const body = {
        model: model,
        messages: [{"role": "user", "content": prompt}],
        max_tokens: 1000
      }
      const response = await submitQuery(url, body);
      setAwaiting(false);
      return response.choices[0].message.content;
      // setResponse(response.choices[0].message.content);
    },
    'davinci': async () => {
      const url = 'https://api.openai.com/v1/completions';
      const body = {
        model: 'davinci',
        prompt: prompt,
        max_tokens: 100
      }
      const response = await submitQuery(url, body);
      setAwaiting(false);
      return response.choices[0].text;
      // setResponse(response.choices[0].text);
    }
  }

  const handleSubmit = async () => {
    const response = (await modelQueries[model]()).trim();
    navigation.navigate('Response', {prompt, response});
  }

  const handleStep = () => {
    setStep(prevStep => prevStep + 1)
  }

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      {step >= 1 && step < 5 && <View style={styles.tutorialContainer}>
        <Text style={styles.tutorialText}>{tutorialMessages[step - 1]}</Text>
      </View>}
      {step >= 1 && step < 5 && <TouchableOpacity style={[StyleSheet.absoluteFillObject, styles.overlay]} onPress={() => handleStep()}></TouchableOpacity>}
      <TouchableOpacity style={{...styles.logs, zIndex: step === 4 ? 2 : 0}} onPress={() => handlePress('Logs')}>
        <Image
          source={{uri: 'https://w7.pngwing.com/pngs/428/775/png-transparent-history-icon-order-icon-angle-text-rectangle.png'}}
          style={styles.settings}
        />
      </TouchableOpacity>
      <TouchableOpacity style={{...styles.settings, zIndex: step === 4 ? 2 : 0}} onPress={() => handlePress('Settings')}>
        <Image
          source={{uri: 'https://www.citypng.com/public/uploads/preview/black-round-cog-gear-icon-png-image-11641123347s4r0ejgdft.png'}}
          style={styles.settings}
        />
      </TouchableOpacity>
      <TouchableOpacity style={{zIndex: 2, backgroundColor: step === 1 ? 'white' : 'transparent', marginTop: 40}} onPress={handleStartRecording}>
        <View style={styles.logoContainer}>
            <Image
              source={{uri: 'https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png'}}
              style={styles.logo}
            />
        </View>
      </TouchableOpacity>
      <View pointerEvents={step > 0 && step < 5 ? 'none' : 'auto'} style={{...styles.pickerContainer, zIndex: step === 2 ? 2 : 1, backgroundColor: step === 2 ? 'white' : null}}>
        <Picker
          style={styles.picker}
          selectedValue={model}
          onValueChange={(itemValue, itemIndex) => setModel(itemValue)}>
          <Picker.Item label="GPT-3.5" value="gpt-3.5-turbo" />
          <Picker.Item label="Davinci" value="davinci" />
          <Picker.Item label="GPT-4" value="gpt-4" />
        </Picker>
      </View>
      {/* <Text style={styles.text}>OpenAI</Text> */}
      <View pointerEvents={step > 0 && step < 5 ? 'none' : 'auto'} style={{...styles.inputContainer, zIndex: step === 3 ? 2 : 1}}>
        <TextInput
          multiline={true}
          value={prompt}
          style={{...styles.input, zIndex: step === 3 ? 2 : 1, backgroundColor: step === 3 ? 'white' : null}}
          onChangeText={setPrompt}
        />
        {!awaiting && <Button title="Submit" onPress={() => handleSubmit()} />}
        {awaiting && <Button title="Pending..."/>}
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
  tutorialContainer: {
    backgroundColor: 'white',
    borderColor: 'yellow',
    borderWidth: 1,
    width: '90%',
    height: 100,
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    borderRadius: 5,
    padding: 10
  },
  tutorialText: {
    fontSize: 20
  },
  overlay: {
    backgroundColor: 'black',
    opacity: .8,
    zIndex: 1
  },
  logoContainer: {
    alignItems: 'center',
    padding: 10
  },
  logo: {
    width: 200,
    height: 200,
    // marginTop: 50,
    // marginBottom: 15,
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
    top: 5,
  },
  logs: {
    position: 'absolute',
    height: 40,
    width: 40,
    right: 5,
    top: 60,
  },
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    marginTop: 10
  },
  picker: {
    width: 150,
    height: 30,
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
    borderColor: 'gray',
    borderWidth: 1,
    height: 200, 
    marginBottom: 15,
    padding: 10,
    paddingHorizontal: 20,
    textAlignVertical: 'top',
    fontSize: 20,
    lineHeight: 25
  }
});

export default HomeScreen;
