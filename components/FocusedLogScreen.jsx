import React from 'react';
import { Text, View, ScrollView } from 'react-native';

const FocusedLogScreen = ({route}) => {
  const { response, prompt, timestamp } = route.params;

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    const monthNames = [
      "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", 
      "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."
    ];
    const formattedDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    return formattedDate;
  }



  return (
    <View style={styles.container}>
      <Text style={styles.timestampText}>{formatTimestamp(timestamp)}</Text>
      <View style={styles.prompt}>
        <Text style={styles.promptText}>{prompt}</Text>
      </View>
      <Text style={styles.timestampText}>OpenAI</Text>
      <ScrollView style={styles.response}>
        <Text style={styles.promptText}>{response}</Text>
      </ScrollView>
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
  },
  prompt: {
    backgroundColor: 'red',
    padding: 15,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 20
  },
  response: {
    backgroundColor: 'blue',
    padding: 15,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 10,
    flexGrow: 0
  },
  promptText: {
    lineHeight: 30,
    fontSize: 20,
    color: 'white',
  },
  timestampText: {
    fontSize: 20
  }
}

export default FocusedLogScreen;