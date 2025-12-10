import * as React from 'react';
import FaqScreen from '../screens/FaqScreen/FaqScreen'
import BottomTabNavigator from '../navigation/BottomTabNavigator'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen, SingUpscreen } from '../utils/screen'
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen'
import ApplicationSection from '../screens/ApplicationSection/ApplicationSection'
import VisaTypescreen from '../screens/Visatypescreen/VisaTypescreen'
import VisaDetailScreen from '../screens/VisaDetailScreen/VisaDetailScreen'
import SplashScreen from '../screens/splashScreen/SplashScreen';
import HolidaysScreen from '../screens/HolidaysScreen/HolidaysScreen'
import AdditionalServices from '../screens/AdditionalServices/AdditionalServices'
import InformationScreen from '../screens/lnformationScreen/lnformationScreen'
import GetStartedScreen from '../screens/GetStartedScreen/GetStartedScreen';
import UploadPassportPhoto from '../screens/Uploadyourpassport/Uploadyourpassport'
import UploadSelfiescreen from '../screens/UploadSelfiescreen/UploadSelfiescreen';
import ProcessingScreen from '../screens/ProcessingScreen/ProcessingScreen'
import DownloadHelper from '../download/DownloadHelper'
import LivenessScreen from '../screens/LivenessScreen/LivenessScreen'
import loginSuccessScreen from '../components/LoginSuccessScreen/LoginSuccessScreen'
const Stack = createNativeStackNavigator();
export default function RootStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                animationDuration: 300,
                contentStyle: {
                    backgroundColor: 'transparent',
                },
            }}
            initialRouteName='LivenessScreen'>
            <Stack.Screen name='LivenessScreen' component={LivenessScreen} />
            <Stack.Screen name='DownloadHelper' component={DownloadHelper} />
            <Stack.Screen name='loginSuccessScreen' component={loginSuccessScreen} />
            <Stack.Screen name='UploadPassportPhoto' component={UploadPassportPhoto} />
            <Stack.Screen name='ProcessingScreen' component={ProcessingScreen} />
            <Stack.Screen name='Uploadselfiescreen' component={UploadSelfiescreen} />
            <Stack.Screen name='SplashScreen' component={SplashScreen} />
            <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} />
            <Stack.Screen name='BottomTabNavigator' component={BottomTabNavigator} />
            <Stack.Screen name='InformationScreen' component={InformationScreen} />
            <Stack.Screen name='FaqScreen' component={FaqScreen} />
            <Stack.Screen name='AdditionalServices' component={AdditionalServices} />
            <Stack.Screen name='ForgotPasswordScreen' component={ForgotPasswordScreen} />
            <Stack.Screen name='HolidaysScreen' component={HolidaysScreen} />
            <Stack.Screen name='VisaTypescreen' component={VisaTypescreen} />
            <Stack.Screen name='VisaDetailScreen' component={VisaDetailScreen} />
            <Stack.Screen name='ApplicationSection' component={ApplicationSection} />
            <Stack.Screen name='logScreen' component={SignInScreen} />
            <Stack.Screen name='SingUpscreen' component={SingUpscreen} />
        </Stack.Navigator>
    );
}