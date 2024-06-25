import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { DAILY_MINUTES_GOAL, DONE_DATES, LAST_CHECK_DATE } from '../constants/storage.const';
import { ImageBackground } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export const INCREMENT_DECREMENT_PERCENTAGE = 0.10;

export default function DailyGoal() {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params;
    const [minutes, setMinutes] = useState(null);
    const [isGoalMet, setIsGoalMet] = useState(false);
    useEffect(() => {
        handleGoal();
    }, [])
    useFocusEffect(() => {
        getData();
        if (!params?.goalMet) {
            checkStorageGoalMet();
        } else {
            setIsGoalMet(true);
        }
    });
    const handleGoal = async () => {
        const lastCheckDate = await AsyncStorage.getItem(LAST_CHECK_DATE);
        if (!lastCheckDate) return;
        if (lastCheckDate !== new Date().toLocaleDateString()) {
            const data = await AsyncStorage.getItem(DONE_DATES);
            const wrapper = JSON.parse(data);
            let yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (wrapper.completed[0].date !== yesterday.toLocaleDateString()) {
                const prevGoal = await AsyncStorage.getItem(DAILY_MINUTES_GOAL);
                const newGoal = parseInt(prevGoal) - parseInt(prevGoal * INCREMENT_DECREMENT_PERCENTAGE);
                await AsyncStorage.setItem(DAILY_MINUTES_GOAL, newGoal.toString());
                await AsyncStorage.setItem(LAST_CHECK_DATE, new Date().toLocaleDateString());
                setMinutes(newGoal);
            }
        }
    }
    const checkStorageGoalMet = async () => {
        const doneDatesStorage = await AsyncStorage.getItem(DONE_DATES);
        const parsedDoneDates = JSON.parse(doneDatesStorage);
        const isTodayGoalMet = parsedDoneDates?.completed[0]?.date === new Date().toLocaleDateString();
        setIsGoalMet(isTodayGoalMet)
    }
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem(DAILY_MINUTES_GOAL);
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
        <SafeAreaView style={styles.mainContainer}>
            {
                isGoalMet ?
                    <>
                        <Text style={styles.title}>Cheers!</Text>
                        <Text fontSize={18} paddingBottom={30}>You have completed your daily goal</Text>
                        <Button
                            color='#20B2AA'
                            title='clear!'
                            aria-label='clear storage Button'
                            onPress={async () => await AsyncStorage.clear()}
                        />
                    </>
                    :
                    <>
                        <ImageBackground style={styles.image} resizeMode='cover'
                            source={require('../assets/images/paper.jpg')}>
                            <View style={styles.container} height={'80%'}>
                                <Text style={styles.title}>Today Reading Goal:</Text>
                                <Text style={{ paddingBottom: 30, fontSize: 30 }}>{minutes} minutes</Text>
                                <FontAwesome5 name="hourglass-start" size={200} />
                                {/* <Button
                                color='#20B2AA'
                                title='ENTER DO NOT DISTURB MODE'
                                aria-label='Do Not Disturb Mode Button'
                                onPress={() => console.log('todo')}
                                /> */}
                                <View style={{ width: 150, marginTop: 30 }}>
                                    <Button
                                        color='#bf6204'
                                        title='DONE'
                                        aria-label='Done Button'
                                        onPress={onDone}
                                    />
                                </View>
                                {/* <Button
                                    color='#bf6204'
                                    title='clear'
                                    aria-label='clear storage Button'
                                    onPress={async () => await AsyncStorage.clear()}
                                /> */}
                            </View>
                        </ImageBackground>
                    </>
            }
        </SafeAreaView >
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
    },
    image: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
});
