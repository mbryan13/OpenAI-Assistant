import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const Log = ({prompt, response, timestamp}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Log', {prompt, response, timestamp})}>
      <View style={styles.container}>
        <Text style={styles.text}>{prompt}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = {
  container: {
    // width: 50,
    // height: 50,
    padding: 30,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5
  },
  text: {
    fontSize: 20
  }
}
export default Log;