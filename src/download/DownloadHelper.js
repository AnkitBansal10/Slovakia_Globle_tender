import { styles } from "./styles"
import React, { useState } from "react";
import Textinput from '../components/TextInput/Textinput'
import { BackgroundGradient, Logo } from "../utils/SvgImage";
import ContactCard from '../components/ContactCard/ContactCard'
import CustomButton from '../components/CustomButton/CustomButton'
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DateofBirth from "../components/DateBirth/DateofBirth";
import CaptchaInput from "../components/CaptchaInput/CaptchaInput";
export default function DownloadHelper({ navigation }) {
    const [loading, setLoading] = useState(false)

    const handleLogin = () => {
        setLoading(true)
        navigation.navigate("BottomTabNavigator")
    }

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            extraScrollHeight={20}
            enableAutomaticScroll={true}
        >
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            <BackgroundGradient style={styles.background} />
            <View style={styles.logo}>
                <Logo width={95} height={60} />
            </View>
            <ContactCard />
            <View style={styles.titleTextView}>
                <Text style={styles.title}>BLS Appointment</Text>
                <Text style={styles.subtitle}>Print Appointment Letter</Text>
            </View>
            <View style={{ alignItems: "center", marginBottom: 30 }}>

                <Textinput
                    placeholder="Appointment Number/Passport*"
                    validationType="email"
                    autoCapitalize="none"
                //   externalError={errors.email?.message}
                />
                <DateofBirth
                    // date={value}
                    // setDate={onChange}
                    placeholder="Date of Birth*"
                // required={true}
                // showHover={true}
                // error={error?.message}
                />
                <CaptchaInput />
            </View>
            <CustomButton
                label="Print Appointment Letter"
                onPress={handleLogin}
                loading={loading}
                loadingText="Processing..."
            />
        </KeyboardAwareScrollView>
    );
}