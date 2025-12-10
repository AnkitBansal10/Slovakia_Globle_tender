import { styles } from "./styles"
import React, { useState } from "react";
import Textinput from '../../components/TextInput/Textinput'
import { BackgroundGradient, Logo } from "../../utils/SvgImage";
import ContactCard from '../../components/ContactCard/ContactCard'
import CustomButton from '../../components/CustomButton/CustomButton'
import PasswordInput from '../../components/PasswordInput/PasswordInput'
import { View, KeyboardAvoidingView, Text, TouchableOpacity } from "react-native";


export default function ForgotPasswordScreen({ navigation }) {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const handleLogin = () => {
    setLoading(true)
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <BackgroundGradient style={styles.background} />
      <View style={styles.logo}>
        <Logo width={95} height={60} />
      </View>
      <ContactCard />
      <View style={styles.titleTextView}>
        <Text style={styles.title}>Forgot Password</Text>
        {/* <Text style={styles.subtitle}>Please sign in to continue our app</Text> */}
      </View>
      <View style={{alignItems:"center"}}>
      <Textinput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        validationType="email"
      />
      <PasswordInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        validationRules={{
          minLength: 6,
          requireUppercase: false,
          requireNumber: true,
          requireSpecialChar: false
        }}
      />
       <PasswordInput
        value={password}
        onChangeText={setPassword}
        placeholder=" Re Enter Password"
        validationRules={{
          minLength: 6,
          requireUppercase: false,
          requireNumber: true,
          requireSpecialChar: false
        }}
      />
      </View>
      <CustomButton
        label="Continue"
        onPress={handleLogin}
        loading={loading}
        loadingText="Processing..."
      />
    </KeyboardAvoidingView>
  );
}