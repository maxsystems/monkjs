import React from 'react';
import Constants from 'expo-constants';

import store from 'store';
import { Provider } from 'react-redux';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import theme from 'config/theme';
import { Provider as PaperProvider } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Authentication from 'components/Authentication';
import Test from 'components/Test';

const Stack = createNativeStackNavigator();

function Navigation() {
  const { isAuthenticated } = useAuth0();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Authentication">
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Test" component={Test} />
          </>
        ) : <Stack.Screen name="Authentication" component={Authentication} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Auth0Provider
        domain={Constants.manifest.extra.AUTH_DOMAIN}
        clientId={Constants.manifest.extra.AUTH_CLIENT_ID}
        redirectUri={window.location.origin}
      >
        <PaperProvider theme={theme}>
          <Navigation />
        </PaperProvider>
      </Auth0Provider>
    </Provider>
  );
}