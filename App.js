import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme, useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { SafeAreaView, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Login from './src/pages/Login';
import Signup from './src/pages/Signup';
import Home from './src/pages/Home';
import ForgotPassword from './src/pages/ForgotPassword';
import EditProfile from './src/pages/Editprofile';


const Stack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white', // Set your desired background color
  },
};

const BackButton = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const canGoBack = navigation.canGoBack();

  if (!canGoBack || route.name === 'Login') {
    return null; // Hide the back button if there is no previous route or if the current route is the login page
  }

  const handlePress = () => {
    navigation.goBack();
  };

  return (
    <TouchableOpacity style={{ marginLeft: 10 }} onPress={handlePress}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  );
};

const App = () => {
  return (
    <View className='flex-1 '>
    <NavigationContainer theme={MyTheme}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={({ route }) => ({
            headerStyle: {
              backgroundColor: 'white', // Set your desired background color for the header
            },
            headerTintColor: 'black', // Set your desired text color for the header
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerLeft: () => <BackButton />,
            headerShown: route.name == 'Signup', 
            headerTitle: '',// Hide the header on the Signup screen
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Set the transition animation
          })}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
    </View>
  );
};

export default App;
