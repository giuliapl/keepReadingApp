import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { DAILY_MINUTES_GOAL, DONE_DATES, LAST_CHECK_DATE } from '../constants/storage.const';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

export const INCREMENT_DECREMENT_PERCENTAGE = 0.10;

export default function DailyGoal() {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params;
    const [minutes, setMinutes] = useState(null);
    const [isGoalMet, setIsGoalMet] = useState(false);
    const [totalMinutes, setTotalMinutes] = useState(0);
    useEffect(() => {
        handleGoal();
    }, [])
    useFocusEffect(() => {
        getData();
        getTotalMinutes();
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
    const getTotalMinutes = async () => {
        const data = await AsyncStorage.getItem(DONE_DATES);
        const wrapper = JSON.parse(data);
        const minutesList = wrapper?.completed?.map((obj) => obj.minutes);
        const total = minutesList?.reduce((accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue));
        if (total) setTotalMinutes(total);
    }
    const onDone = () => {
        navigation.navigate('Done');
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            {
                isGoalMet ?
                    <>
                        <View>
                            <Text style={styles.title}>Cheers!</Text>
                            <Text fontSize={18} paddingBottom={30}>You have completed your daily goal</Text>
                        </View>
                        <Button
                            color='#20B2AA'
                            title='clear!'
                            aria-label='clear storage Button'
                            onPress={async () => await AsyncStorage.clear()}
                        />
                    </>
                    :
                    <>
                        <LinearGradient start={{ x: 1.5, y: 0.5 }} colors={['#ff5c83', '#ffb688']} style={{ height: '100%', width: '100%' }}>
                            <View style={styles.container}>
                                <View style={styles.upper}>
                                    <Text style={styles.title}>Today Reading Goal:</Text>
                                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffff' }}>{minutes} minutes</Text>
                                </View>
                                <View style={styles.middle} elevation={5} onPress={onDone}>
                                    <FontAwesome5 name="check" size={50} color={'#ffff'} />
                                </View>
                                <View style={styles.lower}>
                                    <Text>Total time spent reading since using the app</Text>
                                    <Text fontSize={18} paddingBottom={30}>{totalMinutes} minutes</Text>
                                </View>
                            </View>
                        </LinearGradient>
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
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 30,
        paddingBottom: 20,
        color: '#ffff'
    },
    upper: {
        height: '40%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    middle: {
        width: '20%',
        height: '10.5%',
        borderRadius: 200,
        position: 'absolute',
        top: 260,
        zIndex: 999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ed4c72',
        shadowColor: '#910936',
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: .5
    },
    lower: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        backgroundColor: '#f5efe1',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    }
})
