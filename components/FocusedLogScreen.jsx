import { useRef, useContext } from 'react';
import { Color, Text, View, ScrollView, Dimensions, PanResponder, Animated } from 'react-native';
import Swiper from 'react-native-swiper';
import { ThemeContext } from '../themes/ThemeContext';
import { TinyColor } from '@ctrl/tinycolor';


console.log('color: ', Color)


const FocusedLogScreen = ({route}) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { response, prompt, timestamp } = route.params;

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    const monthNames = [
      "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", 
      "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."
    ];
    const monthName = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hour = date.getHours() % 12 || 12;
    const minute = date.getMinutes().toString().padStart(2, '0');
    const period = date.getHours() < 12 ? 'AM' : 'PM';
    const formattedTimestamp = `${monthName} ${day}, ${year} at ${hour}:${minute} ${period}`;
    return formattedTimestamp;
  }
  

  return (
    <View style={[styles.container, { backgroundColor: new TinyColor(theme.bgPrimary).darken(20).toString() }]}>
      <Text style={[styles.timestampText, { color: theme.textPrimary, borderColor: theme.borderPrimary }]}>{formatTimestamp(timestamp)}</Text>
      <Swiper 
        loop={false}
        showsButtons={false}
        showsPagination={true}
      >
        <View style={[styles.page, { backgroundColor: theme.bgPrimary, borderColor: theme.borderPrimary }]}>
          <Text style={[styles.headerText, { color: theme.textPrimary }]}>Prompt</Text>
          <ScrollView style={[styles.prompt, { backgroundColor: theme.bgSecondary }]}>
            <Text style={[styles.promptText, { color: theme.textPrimary }]}>{prompt}I just wanted to drop you a quick note to follow up on my recent application for the [Job Title] role with [Company Name]. I applied via [application platform], but I wanted to reach out directly to express my strong interest in the position and let you know that I am available to answer any questions or provide any additional information that might be helpful.I just wanted to drop you a quick note to follow up on my recent application for the [Job Title] role with [Company Name]. I applied via [application platform], but I wanted to reach out directly to express my strong interest in the position and let you know that I am available to answer any questions or provide any additional information that might be helpful.I just wanted to drop you a quick note to follow up on my recent application for the [Job Title] role with [Company Name]. I applied via [application platform], but I wanted to reach out directly to express my strong interest in the position and let you know that I am available to answer any questions or provide any additional information that might be helpful.I just wanted to drop you a quick note to follow up on my recent application for the [Job Title] role with [Company Name]. I applied via [application platform], but I wanted to reach out directly to express my strong interest in the position and let you know that I am available to answer any questions or provide any additional information that might be helpful.</Text>
          </ScrollView>
        </View>
        <View style={[styles.page, { backgroundColor: theme.bgPrimary, borderColor: theme.borderPrimary }]}>
          <Text style={[styles.headerText, { color: theme.textPrimary }]}>Response</Text>
          <ScrollView style={[styles.response, { backgroundColor: theme.bgSecondary }]}>
            <Text style={[styles.responseText, { color: theme.textPrimary }]}>{response}I just wanted to drop you a quick note to follow up on my recent application for the [Job Title] role with [Company Name]. I applied via [application platform], but I wanted to reach out directly to express my strong interest in the position and let you know that I am available to answer any questions or provide any additional information that might be helpful.I just wanted to drop you a quick note to follow up on my recent application for the [Job Title] role with [Company Name]. I applied via [application platform], but I wanted to reach out directly to express my strong interest in the position and let you know that I am available to answer any questions or provide any additional information that might be helpful.I just wanted to drop you a quick note to follow up on my recent application for the [Job Title] role with [Company Name]. I applied via [application platform], but I wanted to reach out directly to express my strong interest in the position and let you know that I am available to answer any questions or provide any additional information that might be helpful.I just wanted to drop you a quick note to follow up on my recent application for the [Job Title] role with [Company Name]. I applied via [application platform], but I wanted to reach out directly to express my strong interest in the position and let you know that I am available to answer any questions or provide any additional information that might be helpful.I just wanted to drop you a quick note to follow up on my recent application for the [Job Title] role with [Company Name]. I applied via [application platform], but I wanted to reach out directly to express my strong interest in the position and let you know that I am available to answer any questions or provide any additional information that might be helpful.</Text>
          </ScrollView>
        </View>
      </Swiper>
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
  },
  page: {
    width: Dimensions.get('window').width, // width equal to the screen width
    padding: 10, // add some padding to the page content
    paddingTop: 5,
    paddingBottom: 30,
    alignItems: 'center', // center the content horizontally
    justifyContent: 'center', // center the content vertically
    flex: 1,
    borderWidth: 1,
    borderTopWidth: 0
  },
  prompt: {
    backgroundColor: 'black',
    padding: 15,
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 20,
  },
  response: {
    backgroundColor: 'black',
    padding: 15,
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 20,
    flexGrow: 1 // add flexGrow: 1
  },
  promptText: {
    lineHeight: 30,
    fontSize: 20,
  },
  responseText: {
    lineHeight: 30,
    fontSize: 20,
  },
  timestampText: {
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
    borderWidth: 1
  },
  headerText: {
    textAlign: 'left',
    width: Dimensions.get('window').width,
    paddingLeft: 12,
    marginTop: 10
  }
}


export default FocusedLogScreen;