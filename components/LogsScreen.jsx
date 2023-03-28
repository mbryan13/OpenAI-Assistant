import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Log from './Log';

const LogsScreen = () => {
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
    backgroundColor: 'rgba(68,70,84,1)',
  },
  contentContainer: {
    gap: 10,
  }
}

export default LogsScreen;