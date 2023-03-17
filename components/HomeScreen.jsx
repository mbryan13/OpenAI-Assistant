import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('NewPage');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <Image
          source={{uri: 'https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png'}}
          style={styles.logo}
        />
        <Text style={styles.text}>OpenAI</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 15
  },
  text: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 15
  },
});

export default HomeScreen;
