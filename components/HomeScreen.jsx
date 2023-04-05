import {useEffect, useContext, useState, useCallback } from 'react';
import { StatusBar, StyleSheet, View, Image, Text, TouchableOpacity, TextInput, Button, Animated, SafeAreaView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '../themes/ThemeContext';

// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';


const STORAGE_KEY = 'apiKey';

const HomeScreen = () => {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [apiKey, setApiKey] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [sentPrompt, setSentPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [awaiting, setAwaiting] = useState(false);
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [step, setStep] = useState(10);
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

  const handlePress = page => {
    navigation.navigate(page);
  };

  const onSpeechRecognized = (result) => {
    console.log('speech recognized: ', result);
    setPrompt(result.value);
  };

  const startRecognizing = async () => {
    try {
      await Voice.start('en-US');
      console.log('Voice recognition started');
      Voice.getSpeechRecognitionServices().then(services => console.log('services: ', services))
    } catch (error) {
      console.log('Error starting voice recognition', error);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
      console.log('Voice recognition stopped');
    } catch (error) {
      console.log('Error stopping voice recognition', error);
    }
  };

  const cancelRecognizing = async () => {
    try {
      await Voice.cancel();
      console.log('Voice recognition cancelled');
    } catch (error) {
      console.log('Error cancelling voice recognition', error);
    }
  };

  Voice.onSpeechStart = () => {
    console.log('start!')
    setIsRecording(true);
  };
  Voice.onSpeechEnd = () => {
    console.log('end!');
    setIsRecording(false);
  }
  Voice.onSpeechRecognized = onSpeechRecognized;

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
    <SafeAreaView style={[StyleSheet.absoluteFillObject, styles.container, { backgroundColor: theme.bgPrimary }]}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {step >= 1 && step < 5 && 
        <View style={styles.tutorialContainer}>
          <Text style={[styles.tutorialText, { color: theme.textPrimary }]}>{tutorialMessages[step - 1]}</Text>
        </View>
      }
      {step >= 1 && step < 5 && 
        <TouchableOpacity style={[StyleSheet.absoluteFillObject, styles.overlay]} onPress={() => handleStep()}></TouchableOpacity>
      }
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
      <TouchableOpacity style={{zIndex: 2, backgroundColor: step === 1 ? 'white' : 'transparent', marginTop: 40}} onPress={startRecognizing}>
        <View style={styles.logoContainer}>
            <Image
              source={{uri: 'https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png'}}
              style={styles.logo}
            />
        </View>
      </TouchableOpacity>
      <View pointerEvents={step > 0 && step < 5 ? 'none' : 'auto'} style={{...styles.pickerContainer, zIndex: step === 2 ? 2 : 1, backgroundColor: step === 2 ? 'white' : theme.bgSecondary, borderColor: theme.borderPrimary }}>
        <Picker
          style={[styles.picker, {color: theme.textPrimary }]}
          selectedValue={model}
          onValueChange={(itemValue, itemIndex) => setModel(itemValue)}>
          <Picker.Item label="GPT-3.5" value="gpt-3.5-turbo" />
          <Picker.Item label="Davinci" value="davinci" />
          <Picker.Item label="GPT-4" value="gpt-4" />
        </Picker>
      </View>
      <View pointerEvents={step > 0 && step < 5 ? 'none' : 'auto'} style={{...styles.inputContainer, zIndex: step === 3 ? 2 : 1}}>
        <TextInput
          multiline={true}
          value={prompt}
          style={{...styles.input, zIndex: step === 3 ? 2 : 1, backgroundColor: step === 3 ? theme.bgSecondary : theme.bgSecondary, borderColor: theme.borderPrimary, color: theme.textPrimary}}
          onChangeText={setPrompt}
        />
        <TouchableOpacity onPress={() => handleSubmit()}>
          <View style={styles.submitButton} ><Text style={styles.submitButtonText}>{awaiting ? 'Pending...' : 'Submit'}</Text></View>
        </TouchableOpacity>
      </View>
      {isRecording && (
        <View style={styles.recording}>
          <Text>Recording...</Text>
          {/* <TouchableOpacity onPress={handleStopRecording}>
            <Text>Stop</Text>
          </TouchableOpacity> */}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderWidth: 1,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1987ff',
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitButtonText: {
    color: 'white',
    fontSize: 20
  },
  tutorialContainer: {
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
    fontSize: 20,
     color: 'white'
  },
  overlay: {
    opacity: .85,
    zIndex: 1
  },
  logoContainer: {
    alignItems: 'center',
    padding: 10,
    marginTop: 30
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 25,
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
  logs: {
    position: 'absolute',
    height: 40,
    width: 40,
    right: 5,
    top: 60,
  },
  pickerContainer: {
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
    marginTop: 20,
  },
  input: {
    width: '100%',
    borderRadius: 10,
    color: 'white',
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
