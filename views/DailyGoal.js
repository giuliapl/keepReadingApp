import { Button, SafeAreaView, StyleSheet, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function DailyGoal() {
    const [minutes, setMinutes] = useState(null);
    useEffect(() => {
        getData();
    })

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('daily-minutes-goal');
            if (value !== null) {
                console.log("ok", value);
                setMinutes(value);
            }
        } catch (e) {
            console.error('data not found');
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Today Reading Goal:</Text>
            <Text fontSize={18} paddingBottom={30}>{minutes} minutes</Text>
            <FontAwesome5 name="hourglass-start" size={200} color="#0b99b5" />
            {/* <Button
                color='#20B2AA'
                title='ENTER DO NOT DISTURB MODE'
                accessibilityLabel='Do Not Disturb Mode Button'
                onPress={() => console.log('todo')}
            /> */}
            <Button
                color='#20B2AA'
                title='DONE!'
                accessibilityLabel='Done Button'
                onPress={() => console.log('todo')}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 20,
    },
});
