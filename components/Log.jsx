import {useContext} from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../themes/ThemeContext';


const Log = ({prompt, response, timestamp}) => {
  const {theme, toggleTheme} = useContext(ThemeContext);
  const navigation = useNavigation();
  return (
    <TouchableHighlight style={[styles.container, {backgroundColor: theme.bgSecondary, borderColor: theme.borderPrimary}]} underlayColor="gray" onPress={() => navigation.navigate('Log', {prompt, response, timestamp})}>
      <View>
        <Text style={[styles.text, {color: theme.textPrimary}]}>{prompt}</Text>
      </View>
    </TouchableHighlight >
  )
}

const styles = {
  container: {
    padding: 30,
    borderWidth: 1,
    borderRadius: 5,
  },
  text: {
    fontSize: 20,
  }
}
export default Log;