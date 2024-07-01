import { Button, Modal, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { DAILY_MINUTES_GOAL, DONE_DATES, LAST_CHECK_DATE } from '../constants/storage.const';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';

export const INCREMENT_DECREMENT_PERCENTAGE = 0.10;

export default function DailyGoal() {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params;
    const [minutes, setMinutes] = useState(null);
    const [isGoalMet, setIsGoalMet] = useState(false);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [doneMinutes, setDoneMinutes] = useState('');

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

    const onChangeDoneMinutesText = (e) => { setDoneMinutes(e) };
    const onSendDoneMinutes = () => {
        setModalVisible(false);
        updateData(doneMinutes);
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
            setNewGoal(value);
        } catch (e) {
            console.error('data not stored correctly')
        }
    };
    const setNewGoal = async (todayMinutes) => {
        const newDailyGoal = parseInt(todayMinutes) + parseInt(todayMinutes * INCREMENT_DECREMENT_PERCENTAGE);
        await AsyncStorage.setItem(DAILY_MINUTES_GOAL, newDailyGoal.toString());
        await AsyncStorage.setItem(LAST_CHECK_DATE, new Date().toLocaleDateString());
    }
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
        setModalVisible(true);
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            {
                isGoalMet ?
                    <>
                        {/* @todo: ui */}
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
                                <Pressable style={styles.middle} elevation={5} onPress={onDone}>
                                    <FontAwesome5 name="check" size={50} color={'#ffff'} />
                                </Pressable>
                                <View style={styles.lower}>
                                    <View elevation={5} style={styles.card}>
                                        <Text style={styles.cardContent}>Total time spent reading since day one:</Text>
                                        <Text style={styles.cardContentDesc}>{totalMinutes} minutes</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </>
            }
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Pressable
                            style={styles.buttonClose}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Fontisto name="close-a" size={15} color={'#ff5c83'} />
                        </Pressable>
                        <Text style={{ fontSize: 24, marginBottom: 30, }} >Great job!</Text>
                        <Text style={styles.modalText}>How long did you read today?</Text>
                        <TextInput
                            selectionColor={'#ff5c83'}
                            inputMode='numeric'
                            placeholder='I read for ... minutes'
                            onChangeText={onChangeDoneMinutesText}
                            value={doneMinutes}
                        />
                        <Pressable
                            style={styles.buttonSubmit}
                            aria-label='Send Actual Minutes Button'
                            disabled={!minutes}
                            onPress={onSendDoneMinutes}>
                            <MaterialCommunityIcons name="send-check-outline" size={50} color={'#ffff'} />
                        </Pressable>
                    </View>
                </View>
            </Modal>
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
        height: '50%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    middle: {
        width: '20%',
        height: '10.5%',
        borderRadius: 200,
        position: 'absolute',
        top: 340,
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
        height: '50%',
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        backgroundColor: '#ffff',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 25,
        marginTop: 10,
    },
    card: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffff',
        height: '50%',
        width: '80%',
        borderRadius: 50,
        padding: 20,
        shadowColor: '#910936',
    },
    cardContent: {
        color: '#ff5c83',
        fontSize: 22,
        textAlign: 'center',
        padding: 10,
        fontWeight: 'bold'
    },
    cardContentDesc: {
        color: '#ff5c83',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        padding: 10,
    },
    modalContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        backgroundColor: 'rgba(100,100,100, 0.5)',
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '100%',
    },
    buttonSubmit: {
        borderRadius: 100,
        padding: 10,
        elevation: 3,
        backgroundColor: '#ff5c83',
        marginTop: 20,
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonClose: {
        alignSelf: 'flex-end',
        paddingBottom: 10,
    },
    btnModalText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
})
