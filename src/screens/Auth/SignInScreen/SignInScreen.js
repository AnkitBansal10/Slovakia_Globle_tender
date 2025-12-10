import { styles } from "../styles"
import React, { useState } from "react";
import Textinput from '../../../components/TextInput/Textinput'
import { BackgroundGradient, Logo } from "../../../utils/SvgImage";
import ContactCard from '../../../components/ContactCard/ContactCard'
import CustomButton from '../../../components/CustomButton/CustomButton'
import PasswordInput from '../../../components/PasswordInput/PasswordInput'
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useForm, Controller } from 'react-hook-form';

export default function SignInScreen({ navigation }) {
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value?.trim()) return 'Email is required';
    if (!emailRegex.test(value)) return 'Invalid email format';
    return true;
  };
  const handleLogin = () => {
    setLoading(true)
    navigation.navigate("loginSuccessScreen")
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
        <Text style={styles.title}>Sign in now</Text>
        <Text style={styles.subtitle}>Please sign in to continue our app</Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'required',
            validate: validateEmail
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Textinput
              placeholder="Email *"
              validationType="email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              externalError={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          rules={{
            required: 'required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Password"
              validationRules={{
                minLength: 6,
                requireUppercase: false,
                requireNumber: true,
                requireSpecialChar: false
              }}
              error={errors.password?.message}
            />
          )}
          name="password"
        />

        <View style={styles.forgetTextView}>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordScreen")}>
            <Text style={styles.forgetText}>Forget Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
      <CustomButton
        label="SIGN IN"
        onPress={handleSubmit(handleLogin)}
        loading={loading}
        loadingText="Processing..."
      />
      <View style={styles.accountTextContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("SingUpscreen")}>
          <Text style={styles.accountText}>
            Don't have an account?{' '}
            <Text style={styles.signUpText}>
              Sign up
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}