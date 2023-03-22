import {useEffect} from 'react';
import { Text, View, ScrollView, Button, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';

const ResponseScreen = ({route}) => {
  const { response } = route.params;
  useEffect(() => {
    setTimeout(() => {
      Speech.speak(response);
    }, 2000)
  }, [])

  const stopSpeech = () => Speech.stop();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={stopSpeech}>
        <View style={styles.stopButton}><Text style={{color: 'white'}}>Stop</Text></View>
      </TouchableOpacity>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.response}>{response}</Text>
      </ScrollView>
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    margin: 15,
    gap: 20
  },
  stopButton: {
    borderColor: 'black',
    backgroundColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  scrollContainer: {
    // flex: 1,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
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