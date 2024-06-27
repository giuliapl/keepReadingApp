import { Animated, Button, Easing, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { DAILY_MINUTES_GOAL, DONE_DATES, LAST_CHECK_DATE } from '../constants/storage.const';
import { ImageBackground } from 'react-native';

export const INCREMENT_DECREMENT_PERCENTAGE = 0.10;

export default function DailyGoal() {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params;
    const [minutes, setMinutes] = useState(null);
    const [isGoalMet, setIsGoalMet] = useState(false);
    const [totalMinutes, setTotalMinutes] = useState();
    useEffect(() => {
        handleGoal();
    }, [])
    useFocusEffect(() => {
        spin();
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
        setTotalMinutes(total);
    }
    const onDone = () => {
        navigation.navigate('Done');
    }
    spinValue = new Animated.Value(0);
    const spin = () => {
        spinValue.setValue(0);
        Animated.loop(Animated.timing(
            spinValue,
            {
                toValue: 1,
                duration: 5000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        )).start(() => spin());
    };
    const rotate = this.spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

    return (
        <SafeAreaView style={styles.mainContainer}>
            {
                isGoalMet ?
                    <>
                        <View>
                            <Text style={styles.title}>Cheers!</Text>
                            <Text fontSize={18} paddingBottom={30}>You have completed your daily goal</Text>
                        </View>

                        <View style={styles.container}>
                            <Text style={styles.title}>Total time spent reading</Text>
                            <Text fontSize={18} paddingBottom={30}>{totalMinutes} minutes</Text>
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
                        <ImageBackground style={styles.image} resizeMode='cover'
                            source={require('../assets/images/paper.jpg')}>
                            <View style={styles.container} height={'80%'}>
                                <Text style={styles.title}>Today Reading Goal:</Text>
                                <Text style={{ paddingBottom: 30, fontSize: 30 }}>{minutes} minutes</Text>
                                <Animated.View style={{ transform: [{ rotate }] }}>
                                    {/* todo - image attribution: <a href="https://www.vecteezy.com/free-vector/skull">Skull Vectors by Vecteezy</a> */}
                                    <Image source={require('../assets/images/hourglass-decor.png')} style={{ width: 250, height: 250 }} />
                                </Animated.View>
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
