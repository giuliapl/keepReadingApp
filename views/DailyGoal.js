import { Button, SafeAreaView, StyleSheet, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function DailyGoal() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Today's Reading Goal Is:</Text>
            <Text fontSize={18} paddingBottom={30}>30 minutes</Text>
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
