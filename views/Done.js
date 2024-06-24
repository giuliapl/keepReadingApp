import { Button, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export const DONE_DATES = 'done-dates';

export default function Done() {
    const navigation = useNavigation();
    const [minutes, setMinutes] = useState('');
    const onChangeText = (e) => { setMinutes(e) };
    const onPress = () => {
        updateData(minutes);
    };
    const updateData = async (value) => {
        try {
            if (!await AsyncStorage.getItem(DONE_DATES)) {
                const all = [{ date: new Date().toLocaleDateString(), minutes: value }];
                const wrapper = { completed: [...all] };
                await AsyncStorage.setItem(DONE_DATES, JSON.stringify(wrapper));
            } else {
                const prevMinutes = await AsyncStorage.getItem(DONE_DATES);
                const wrapper = JSON.parse(prevMinutes);
                const list = [{ date: new Date().toLocaleDateString(), minutes: value }, ...wrapper?.completed];
                wrapper.completed = list;
                const serializedWrapper = JSON.stringify(wrapper);
                await AsyncStorage.setItem(DONE_DATES, serializedWrapper);
            }
            navigation.navigate('DailyGoal', { goalMet: true });
        } catch (e) {
            console.error('data not stored correctly')
        }
    };

    return (<SafeAreaView style={styles.container}>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.desc}>How long did you read today?</Text>
        <TextInput
            style={styles.input}
            keyboardType='numeric'
            placeholder='I read for...'
            onChangeText={onChangeText}
            value={minutes}
        />
        <Text fontSize={16} paddingBottom={30}>minutes</Text>
        <Button
            color='#20B2AA'
            title='SEND'
            accessibilityLabel='Send Actual Minutes Button'
            onPress={onPress}
            disabled={!minutes}
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
    input: {
        height: 40,
        width: '100%',
        margin: 12,
        borderBottomWidth: 1,
        padding: 10,
    },
    desc: {
        fontSize: 18,
        textAlign: 'center',
        paddingBottom: 20,
    },
});
