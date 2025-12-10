import { styles } from "../styles";
import React, { useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import Textinput from '../../../components/TextInput/Textinput'
import { BackgroundGradient, Logo } from '../../../utils/SvgImage'
import DateofBirth from '../../../components/DateBirth/DateofBirth'
import ContactCard from '../../../components/ContactCard/ContactCard'
import CustomButton from '../../../components/CustomButton/CustomButton'
import { View, KeyboardAvoidingView, Text, ScrollView } from "react-native";
import PhoneInputField from '../../../components/PhoneInputField/PhoneInputField'
import PassportCountryDropdown from '../../../components/PassportCountryDropdown/PassportCountryDropdown'

export default function SignInScreen({navigation}) {
    const [callingCodeCountry, setCallingCodeCountry] = useState("91");
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [country, setCountry] = useState("IN");
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        trigger
    } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            passport: '',
            dateOfBirth: '',
            mobile: '',
            nationality_id: '',
            country_id: ''
        },
        mode: 'onBlur'
    });

    const onSubmit = async (data) => {
        console.log('Form data:', data);
        navigation.navigate("logScreen")
        // Your sign up logic here
        try {
            navigation.navigate("logScreen")

            // Simulate API call
            // await signUpAPI(data);
            console.log('Sign up successful!', data);
        } catch (error) {
            console.error('Sign up failed:', error);
        }
    };

    // Custom validation functions
    const validateName = (value) => {
        if (!value?.trim()) return 'Name is required';
        if (value.length < 3) return 'Name must be at least 3 characters';
        return true;
    };

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value?.trim()) return 'Email is required';
        if (!emailRegex.test(value)) return 'Invalid email format';
        return true;
    };

    const validatePassport = (value) => {
         if (!value?.trim()) return 'Passport number is required';
        if (value.length < 3) return 'Passport number be at least 3 characters';
        return true;
        // const passportRegex = /^[A-PR-WY][1-9]\d\s?\d{4}[1-9]$/i;
        // if (!value?.trim()) return 'Passport number is required';
        // if (!passportRegex.test(value)) return 'Invalid passport format';
        // return true;
    };

    const validateDateOfBirth = (value) => {
        if (!value?.trim()) return 'required';
        // Additional validation for age (must be at least 18 years old)
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            return 'You must be at least 18 years old';
        }
        return true;
    };

    const validateRequired = (value) => {
        if (!value) return 'required';
        return true;
    };

    // Handle country change for phone input
    const handleCountryChange = (newCountry) => {
        setCountry(newCountry);
        // You might want to update calling code based on country
        // setCallingCodeCountry(getCallingCode(newCountry));
    };
    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView>
                <BackgroundGradient style={styles.background} />
                <View style={styles.logo}>
                    <Logo width={95} height={60} />
                </View>
                <ContactCard />
                <View style={styles.titleTextView}>
                    <Text style={styles.title}>Sign up now</Text>
                    <Text style={styles.subtitle}>Please sign up to continue our app</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    {/* First Name */}
                    <Controller
                        control={control}
                        name="firstName"
                        rules={{
                            required: 'required',
                            validate: validateName
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Textinput
                                placeholder="First Name *"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                autoCapitalize="none"
                                externalError={errors.firstName?.message}
                            />
                        )}
                    />
                    {/* Last Name */}
                    <Controller
                        control={control}
                        name="lastName"
                        rules={{
                            required: 'required',
                            validate: validateName
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Textinput
                                placeholder="Last Name *"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                autoCapitalize="none"
                                externalError={errors.lastName?.message}
                            />
                        )}
                    />
                    {/* Email */}
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
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                autoCapitalize="none"
                                externalError={errors.email?.message}
                            />
                        )}
                    />
                    {/* Nationality Dropdown */}
                    <Controller
                        control={control}
                        name="nationality_id"
                        rules={{
                            required: 'required',
                            validate: validateRequired
                        }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <PassportCountryDropdown
                                label="Select Nationality"
                                value={value}
                                onValueChange={onChange}
                                error={error?.message}
                            />
                        )}
                    />
                    {/* Date of Birth */}
                    <Controller
                        control={control}
                        name="dateOfBirth"
                        rules={{
                            required: 'required',
                            validate: validateDateOfBirth
                        }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <DateofBirth
                                date={value}
                                setDate={onChange}
                                placeholder="Date of Birth*"
                                required={true}
                                showHover={true}
                                error={error?.message}
                            />
                        )}
                    />
                    {/* Country Applying From Dropdown */}
                    <Controller
                        control={control}
                        name="country_id"
                        rules={{
                            required: 'required',
                            validate: validateRequired
                        }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <PassportCountryDropdown
                                label="Select Country Applying From"
                               value={value}
                                onValueChange={onChange}
                                error={error?.message}
                            />
                        )}
                    />
                    {/* Passport Number */}
                    <Controller
                        control={control}
                        name="passport"
                        rules={{
                            required: 'required',
                            validate: validatePassport
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Textinput
                                placeholder="Passport Number *"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                autoCapitalize="characters"
                                externalError={errors.passport?.message}
                                validationType="passport"
                            />
                        )}
                    />
                    {/* Phone Input */}
                    <Controller
                        control={control}
                        name="mobile"
                        rules={{
                            required: 'required',
                            validate: (value) => {
                                if (!value?.trim()) return 'required';
                                // Add phone number validation regex if needed
                                const phoneRegex = /^[0-9]{10,15}$/;
                                if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                                    return 'Invalid mobile number format';
                                }
                                return true;
                            }
                        }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <PhoneInputField
                                value={value}
                                onChangeText={onChange}
                                callingCodeCountry={callingCodeCountry}
                                selectedCountry={country}
                                onCountryChange={handleCountryChange}
                                showError={!!error}
                                errorMessage={error?.message}
                            />
                        )}
                    />
                </View>
                <CustomButton
                    label="SIGN UP"
                    onPress={handleSubmit(onSubmit)}
                    loading={isSubmitting}
                    loadingText="Processing..."
                />
                <View style={{ marginBottom: 20 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}