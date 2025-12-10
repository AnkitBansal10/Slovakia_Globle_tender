import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import RootStack from './src/navigation/AppNavigator';
import { store, persistor } from './src/state/store';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);

export default function App() {
  return (
    <Provider store={store}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
    </Provider>
  );
}