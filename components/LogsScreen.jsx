import { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Log from './Log';
import { ThemeContext } from '../themes/ThemeContext';

const LogsScreen = () => {
  const {theme, toggleTheme} = useContext(ThemeContext);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const readData = async () => {
      const logs = await AsyncStorage.getItem('apiLogs');
      const parsedLogs = logs ? JSON.parse(logs): [];
      setLogs(parsedLogs);
    }
    readData();
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bgPrimary }]} contentContainerStyle={styles.contentContainer}>
      {logs.map(log => {
        return <Log 
          prompt={log.prompt}
          response={log.response}
          timestamp={log.timestamp}
        />
      })}
    </ScrollView>
  )
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    gap: 10,
  }
}

export default LogsScreen;