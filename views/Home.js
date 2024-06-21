
import { SafeAreaView, StyleSheet } from 'react-native';
import SetGoal from './SetGoal';
import DailyGoal from './DailyGoal';


export default function Home() {
    const hasGoal = false;

    return (
        <SafeAreaView style={styles.container}>
            {
                !hasGoal ?
                    <SetGoal />
                    :
                    <DailyGoal />
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});