import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
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
    const getData = async () => {
        try {
            const hasPrevGoal = await AsyncStorage.getItem('daily-minutes-goal');
            if (hasPrevGoal) navigation.navigate('DailyGoal');
        } catch (e) {
            console.error('data not stored correctly')
        }
    };
    useEffect(() => {
        getData();
    }, []);

    return (
        <SafeAreaView style={styles.mainContainer}>
            {
                showModal && minutes ?
                    <>
                        <View style={styles.container} height={'80%'}>
                            <Text style={styles.title} padding={30}>How does it work?</Text>
                            <Text style={styles.desc}>
                                Your daily goal will slowly increase basing upon how many minutes you manage to read every day. {"\n"}
                                This will help you stay consistent and read more, day by day.
                            </Text>
                            <Button
                                color='#bf6204'
                                title='MAKE THE STORY BEGIN'
                                aria-label='Send Goal Button'
                                onPress={onPress}
                            />
                        </View>
                    </>
                    :
                    <>
                        <View style={styles.container}>
                            <Text style={styles.title}>Let's set your first reading goal!</Text>
                            <TextInput
                                value={minutes}
                                style={styles.input}
                                keyboardType='numeric'
                                placeholder='Today, I will read for...'
                                placeholderTextColor='white'
                                onChangeText={onChangeText}
                            />
                            <Text style={{ color: '#ffff', fontSize: 16, paddingBottom: 30 }}>minutes</Text>
                            <View style={{ width: 150, marginTop: 30 }}>
                                <Button
                                    color='#bf6204'
                                    title='SEND'
                                    aria-label='Send Goal Button'
                                    onPress={onSend}
                                    disabled={!minutes}
                                />
                            </View>
                        </View>
                    </>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        alignItems: 'center',
        flexDirection: 'column',
    },
    container: {
        alignItems: 'center',
        flexDirection: 'column',
        height: '50%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 20,
        color: 'white',
    },
    input: {
        height: 40,
        margin: 12,
        borderBottomWidth: 1,
        padding: 10,
        borderBottomColor: 'white',
        color: 'white',
        textAlign: 'center',
    },
    desc: {
        fontSize: 18,
        textAlign: 'center',
        paddingBottom: 20,
        color: 'white',
        padding: 30,
        marginBottom: 30,
    },
    image: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
});
