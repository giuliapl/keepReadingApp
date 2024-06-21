import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SetGoal() {
    const [minutes, setMinutes] = useState('');
    const [showModal, setShowModal] = useState(false);
    const onChangeText = (e) => { setMinutes(e) };
    const navigation = useNavigation();
    const onPress = () => {
        navigation.navigate('DailyGoal');
    };
    const onSend = () => {
        if (minutes) storeData(minutes);
        setShowModal((prev) => !prev);
    };
    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem('daily-minutes-goal', value);
        } catch (e) {
            console.error('data not stored correctly')
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {
                showModal && minutes ?
                    <>
                        <Text style={styles.title}>How does it work?</Text>
                        <Text style={styles.desc}>Your daily goal will slowly increase basing upon how many minutes you manage to read every day.</Text>
                        <Text style={styles.desc}>This will help you stay consistent and read more, day by day.</Text>
                        <Button
                            color='#20B2AA'
                            title='MAKE THE STORY BEGIN'
                            accessibilityLabel='Send Goal Button'
                            onPress={onPress}
                        />
                    </>
                    :
                    <>
                        <Text style={styles.title}>Let's set your first reading goal!</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType='numeric'
                            placeholder='Today I will read for...'
                            onChangeText={onChangeText}
                            value={minutes}
                        />
                        <Text fontSize={16} paddingBottom={30}>minutes</Text>
                        <Button
                            color='#20B2AA'
                            title='SEND'
                            accessibilityLabel='Send Goal Button'
                            onPress={onSend}
                        />
                    </>
            }
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
        fontWeight: 'bolder',
        paddingBottom: 20,
    },
    input: {
        height: 40,
        width: '100%',
        margin: 12,
        borderBottomWidth: 1,
        padding: 10,
    },
    desc: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 20,
    },
});
