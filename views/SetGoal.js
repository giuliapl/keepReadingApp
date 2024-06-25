import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Button, ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
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
        <SafeAreaView style={styles.container}>
            {
                showModal && minutes ?
                    <>
                        <ImageBackground style={styles.image} resizeMode='cover'
                            source={require('../assets/images/begin-story.jpg')}>
                            {/* todo - image attribution: <a href="https://www.freepik.com/free-photo/magic-fairytale-book-concept_38110873.htm#fromView=search&page=1&position=0&uuid=8fcd2fa7-7f8c-4087-9e7e-6f8101cffaf2">Image by freepik</a> */}
                            <View style={styles.container}>
                                <Text style={styles.title} padding={30}>How does it work?</Text>
                                <Text style={styles.desc} padding={30}>Your daily goal will slowly increase basing upon how many minutes you manage to read every day.</Text>
                                <Text style={styles.desc} padding={30}>This will help you stay consistent and read more, day by day.</Text>
                                <Button
                                    color='#bf6204'
                                    title='MAKE THE STORY BEGIN'
                                    accessibilityLabel='Send Goal Button'
                                    onPress={onPress}
                                />
                            </View>
                        </ImageBackground>
                    </>
                    :
                    <>
                        <ImageBackground style={styles.image} resizeMode='cover'
                            source={require('../assets/images/books-background.jpg')}>
                            {/* todo - image attribution: <a href="https://www.freepik.com/free-photo/front-view-books-with-copy-space_5207379.htm#fromView=search&page=1&position=15&uuid=98afacbb-1ab7-4d6a-8194-1bc53fc81f8d">Image by freepik</a> */}
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
                                <Button
                                    color='#2cc793'
                                    title='SEND'
                                    accessibilityLabel='Send Goal Button'
                                    onPress={onSend}
                                    disabled={!minutes}
                                />
                            </View>
                        </ImageBackground>
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
    },
    image: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
});
