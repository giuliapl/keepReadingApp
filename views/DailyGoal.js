import { Button, SafeAreaView, StyleSheet, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function DailyGoal() {
    const navigation = useNavigation();
    const [minutes, setMinutes] = useState(null);
    useFocusEffect(() => {
        //AsyncStorage.clear()
        getData();
    });
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('daily-minutes-goal');
            if (value !== null) {
                setMinutes(value);
            } else {
                navigation.navigate('SetGoal');
            }
        } catch (e) {
            console.error('data not found');
        }
    };
    const onDone = () => {
        navigation.navigate('Done');
    }
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
                onPress={onDone}
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
