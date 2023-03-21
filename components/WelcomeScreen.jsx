import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput,Button, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import * as Speech from 'expo-speech';


const WelcomeScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSetup, setHasSetup] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [date, setDate] = useState(new Date());
  const [opacity, setOpacity] = useState(new Animated.Value(0));

  const welcomeTextIndex = useRef(0);
  const intervalID = useRef();
  const navigation = useNavigation();

  const STORAGE_KEY = 'apiKey';
  const welcomeMessages = ['Hello there!', 'I\'m your OpenAI assistant.', 'Let\'s get you set up.', 'Enter your OpenAI API key.', 'You\'re good to go! You can always change your API key in the settings.'];
  const fadeInDuration = 500;
  const fadeOutDuration = 500;

  const handleSave = () => {
    SecureStore.setItemAsync('hasSetup', 'true').then(() => null).catch(e => console.log(e));
    SecureStore.setItemAsync(STORAGE_KEY, apiKey)
      .then(() => {
        welcomeTextIndex.current = welcomeTextIndex.current + 1;
        Speech.speak(welcomeMessages[welcomeTextIndex.current]);
        setDate(new Date());
        setTimeout(() => {
          navigation.navigate('Home');
        }, 4500);
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    if(!intervalID.current) intervalID.current = setInterval(() => {
      Speech.speak(welcomeMessages[welcomeTextIndex.current]);
      Animated.timing(opacity, {
        toValue: 1,
        duration: fadeInDuration,
        useNativeDriver: true
      }).start(() => {
        if(welcomeTextIndex.current !== 3 && welcomeTextIndex.current !== welcomeMessages.length - 1) {
          setTimeout(() => {
            Animated.timing(opacity, {
              toValue: 0,
              duration: fadeOutDuration,
              useNativeDriver: true
            }).start(() => {
              welcomeTextIndex.current = welcomeTextIndex.current + 1;
              setDate(new Date());
          })}, 500);
        }
      });
      if(welcomeTextIndex.current === 3 || welcomeTextIndex.current === welcomeMessages.length - 1) return clearInterval(intervalID.current);
    }, 3000);

    return () => clearInterval(intervalID.current);
  }, []);

  useEffect(() => {
    SecureStore.getItemAsync('hasSetup').then((value) => {
      if (value === 'true') {
        setHasSetup(true);
      } else {
        setHasSetup(false);
      }
      setIsLoading(false);
    });
  }, []);
  
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' />
      </View>
    );
  }
  else if(!hasSetup) {
    return (
      <View style={styles.container}>
        <Animated.Text style={{...styles.welcomeText, opacity}}>{welcomeMessages[welcomeTextIndex.current]}</Animated.Text>
        {welcomeTextIndex.current === 3 && <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            secureTextEntry
          />
          <Button title="Save" onPress={handleSave}/>
          <Text style={styles.inputText}>Your API key is locally encrypted on your device - it is not stored anywhere else.</Text>
        </View>}
      </View>
    )
  }

  else navigation.navigate('Home');

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100
  },
  inputContainer: {
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    width: 300,
    marginBottom: 20,
    fontSize: 30,
    marginTop: 20
  },
  inputText: {
    width: 300,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 15,
    color: 'purple'
  },
  welcomeText: {
    fontSize: 35,
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 50,
    marginHorizontal: 20,
  }
})

export default WelcomeScreen;