
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SetGoal from './views/SetGoal';
import DailyGoal from './views/DailyGoal';
import Done from './views/Done';

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
        <Stack.Screen
          name="Done"
          component={Done}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}