import {useEffect, useContext} from 'react';
import { Text, View, ScrollView, Button, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../themes/ThemeContext';

const ResponseScreen = ({route}) => {
  const {theme, toggleTheme} = useContext(ThemeContext);
  const { response, prompt } = route.params;
  console.log(prompt);
  useEffect(() => {
    setTimeout(() => {
      Speech.speak(response);
    }, 2000)
    storeData();
  }, [prompt])

  const stopSpeech = () => Speech.stop();
  const storeData = async () => {
    try {
      const logs = await AsyncStorage.getItem('apiLogs');
      const parsedLogs = logs ? JSON.parse(logs): [];
      const newLogs = [...parsedLogs, { prompt, response, timestamp: Date.now() }];
      console.log('updated logs: ', newLogs);
      await AsyncStorage.setItem('apiLogs', JSON.stringify(newLogs));
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.bgPrimary, borderColor: theme.borderPrimary }]}>
      <TouchableOpacity onPress={stopSpeech}>
        <View style={styles.stopButton}><Text style={{color: 'white'}}>Stop</Text></View>
      </TouchableOpacity>
      <ScrollView style={[styles.scrollContainer, { backgroundColor: theme.bgSecondary }]}>
        <Text style={[styles.response, { color: theme.textPrimary }]}>{response}</Text>
      </ScrollView>
    </View>
  )
}

const styles = {
  container: {

    gap: 20,
    borderWidth: 1,
    height: '100%'
  },
  stopButton: {
    borderColor: 'black',
    backgroundColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10
  },
  scrollContainer: {
    borderRadius: 5,
    margin: 10,
    marginTop: 0,
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    padding: 5,
    flexGrow: 0
  },
  response: {
    fontSize: 25,
    lineHeight: 35,
    textAlign: 'left',
    padding: 10,
    paddingLeft: 30,
    position: 'relative',
    top: 0,
    left: 0,
  }
}

export default ResponseScreen;