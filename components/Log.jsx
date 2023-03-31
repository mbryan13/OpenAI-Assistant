import React from 'react'
import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const Log = ({prompt, response, timestamp}) => {
  const navigation = useNavigation();
  return (
    <TouchableHighlight style={styles.container} underlayColor="gray" onPress={() => navigation.navigate('Log', {prompt, response, timestamp})}>
      <View>
        <Text style={styles.text}>{prompt}</Text>
      </View>
    </TouchableHighlight >
  )
}

const styles = {
  container: {
    // width: 50,
    // height: 50,
    padding: 30,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'black'
  },
  text: {
    fontSize: 20,
    color: 'white'
  }
}
export default Log;