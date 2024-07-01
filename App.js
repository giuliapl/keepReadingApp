
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SetGoal from './views/SetGoal';
import DailyGoal from './views/DailyGoal';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="DailyGoal"
          component={DailyGoal}
        />
        <Stack.Screen
          name="SetGoal"
          component={SetGoal}
          options={{ title: 'KeepReading' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}