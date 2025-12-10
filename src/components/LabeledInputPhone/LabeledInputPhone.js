import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { scale } from '../../utils/Responsive';
import { colors } from '../../utils/colors';
import { Poppins_Fonts } from '../../utils/fonts';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LabeledInputPhone = ({
    label,
    value,
    onChangeText,
    placeholder,
    editable = true,
    secureTextEntry = false,
    error = '',
    success = '',
    iconName,
    onIconPress,
    isPhoneInput = false,
    defaultCountry = 'IN',
    selectedCountry, 
    onCountryChange,
    callingCodeCountry,
    isOptional = false,
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [countryCode, setCountryCode] = useState(defaultCountry);
    const [callingCode, setCallingCode] = useState(callingCodeCountry);
    const [phoneRaw, setPhoneRaw] = useState('');
    const [formattedPhone, setFormattedPhone] = useState('');
    const [isValid, setIsValid] = useState(true);
    
    // Use ref to track previous values and prevent unnecessary effects
    const prevValueRef = useRef(value);
    const prevCountryCodeRef = useRef(countryCode);

    const countryNameToCode = useMemo(() => ({
        'pakistan': 'PK',
        'united states': 'US',
        'united kingdom': 'GB',
        'canada': 'CA',
        'australia': 'AU',
        'india': 'IN',
    }), []);

    // Optimized country code setup
    useEffect(() => {
        if (typeof selectedCountry === 'string' && selectedCountry.length > 0) {
            if (selectedCountry.length === 2) {
                setCountryCode(selectedCountry.toUpperCase());
            } else {
                const lowerName = selectedCountry.toLowerCase();
                const foundCode = countryNameToCode[lowerName];
                if (foundCode) {
                    setCountryCode(foundCode);
                }
            }
        }

        if (callingCodeCountry) {
            setCallingCode(callingCodeCountry);
        } else if (defaultCountry === 'IN' && !callingCodeCountry) {
            setCallingCode('91');
        }
    }, [selectedCountry, callingCodeCountry, defaultCountry, countryNameToCode]);

    // Optimized initial phone number parsing - only run when value actually changes
    useEffect(() => {
        if (isPhoneInput && value && value !== prevValueRef.current) {
            try {
                const currentCallingCode = callingCode || '91';
                const fullNumber = value.startsWith('+') ? value : `+${currentCallingCode}${value}`;
                const parsed = parsePhoneNumberFromString(fullNumber);

                if (parsed) {
                    const newCountryCode = parsed.country || countryCode;
                    const newCallingCode = parsed.countryCallingCode || currentCallingCode;
                    
                    setCountryCode(newCountryCode);
                    setCallingCode(newCallingCode);
                    setPhoneRaw(parsed.nationalNumber);

                    const formatter = new AsYouType(newCountryCode);
                    formatter.input(parsed.nationalNumber);
                    setFormattedPhone(formatter.formattedOutput || parsed.nationalNumber);
                }
            } catch (error) {
                console.warn("Failed to parse initial phone number:", error);
            }
            prevValueRef.current = value;
        }
    }, [value, isPhoneInput, callingCode, countryCode]);

    // Memoized phone validation
    const validatePhone = useCallback((raw, code, calling) => {
        if (!raw) {
            return { isValid: isOptional, formatted: '', fullNumber: '' };
        }

        try {
            const formatter = new AsYouType(code);
            formatter.input(raw);
            const formatted = formatter.formattedOutput || raw;
            const currentCallingCode = calling || '91';
            const fullNumber = `+${currentCallingCode}${raw.replace(/\D/g, '')}`;
            const parsed = parsePhoneNumberFromString(fullNumber);
            const valid = parsed?.isValid() ?? false;

            return { 
                isValid: valid || isOptional, 
                formatted, 
                fullNumber: valid ? fullNumber : '' 
            };
        } catch (error) {
            console.warn('Phone number validation error:', error);
            return { isValid: isOptional, formatted: raw, fullNumber: '' };
        }
    }, [isOptional]);

    // Handle phone changes with debounced validation
    const handlePhoneChange = useCallback((text) => {
        if (!editable) return;
        
        const digitsOnly = text.replace(/\D/g, '');
        setPhoneRaw(digitsOnly);

        // Immediate formatting for UI
        const formatter = new AsYouType(countryCode);
        formatter.input(digitsOnly);
        setFormattedPhone(formatter.formattedOutput || text);

        // Debounced validation and callback
        const validation = validatePhone(digitsOnly, countryCode, callingCode);
        setIsValid(validation.isValid);
        
        if (validation.isValid && validation.fullNumber) {
            onChangeText?.(validation.fullNumber);
        } else if (!validation.fullNumber && !digitsOnly) {
            onChangeText?.('');
        }
    }, [countryCode, callingCode, editable, onChangeText, validatePhone]);

    // Handle country selection
    const handleCountrySelect = useCallback((country) => {
        const newCountryCode = country.cca2;
        const newCallingCode = country.callingCode[0];
        
        setCountryCode(newCountryCode);
        setCallingCode(newCallingCode);
        
        // Re-validate current phone number with new country
        if (phoneRaw) {
            const validation = validatePhone(phoneRaw, newCountryCode, newCallingCode);
            setIsValid(validation.isValid);
            setFormattedPhone(validation.formatted);
            
            if (validation.isValid && validation.fullNumber) {
                onChangeText?.(validation.fullNumber);
            }
        }

        if (onCountryChange) {
            onCountryChange(country);
        }
    }, [phoneRaw, validatePhone, onChangeText, onCountryChange]);

    // Memoized styles
    const containerStyle = useMemo(() => [
        styles.container,
        !isValid && error && !isOptional && styles.errorBorder,
        !editable && styles.nonEditableContainer,
    ], [isValid, error, isOptional, editable]);

    const inputWrapperStyle = useMemo(() => [
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused,
        error ? styles.errorBorder : success ? styles.successBorder : null,
        isPhoneInput && styles.phoneInputWrapper,
    ], [isFocused, error, success, isPhoneInput]);

    const messageStyle = useMemo(() => [
        styles.message,
        error ? styles.error : styles.success
    ], [error, success]);

    return (
        <View style={containerStyle}>
            <Text style={styles.label}>
                {label}
            </Text>
            <View style={inputWrapperStyle}>
                {isPhoneInput ? (
                    <>
                        <View style={styles.countrySection}>
                            <CountryPicker
                                countryCode={countryCode}
                                withFlag
                                withEmoji
                                withCallingCode={false}
                                withFilter
                                withAlphaFilter
                                withCallingCodeButton
                                onSelect={handleCountrySelect}
                                containerButtonStyle={styles.flagButton}
                                disabled={!editable}
                            />
                        </View>
                        <TextInput
                            style={[styles.input, !editable && styles.nonEditableText, styles.phoneTextInput]}
                            placeholderTextColor={colors.commonTextColor}
                            value={formattedPhone}
                            onChangeText={handlePhoneChange}
                            keyboardType="phone-pad"
                            editable={editable}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            {...rest}
                        />
                    </>
                ) : (
                    <>
                        <TextInput
                            style={styles.input}
                            value={value}
                            onChangeText={onChangeText}
                            placeholder={placeholder}
                            editable={editable}
                            placeholderTextColor={colors.commonTextColor}
                            secureTextEntry={secureTextEntry && !showPassword}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            {...rest}
                        />
                        {secureTextEntry && (
                            <TouchableOpacity
                                style={styles.iconContainer}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Icon
                                    name={showPassword ? 'visibility-off' : 'visibility'}
                                    size={20}
                                    color="#888"
                                />
                            </TouchableOpacity>
                        )}

                        {iconName && !secureTextEntry && (
                            <TouchableOpacity
                                style={styles.iconContainer}
                                onPress={onIconPress}
                            >
                                <Icon name={iconName} size={20} color={colors.primary} />
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>

            {(error || success) && (
                <Text style={messageStyle}>
                    {error || success}
                </Text>
            )}

            {isPhoneInput && !isValid && error && !isOptional && (
                <Text style={styles.errorText} accessibilityLiveRegion="polite">
                    Please enter a valid phone number
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        position: 'absolute',
        top: -10,
        left: 16,
        fontSize: 13,
        fontFamily: Poppins_Fonts.Poppins_Medium,
        zIndex: 20,
        color: colors.primary,
        paddingHorizontal: 4,
    },
    inputWrapper: {
        backgroundColor: colors.Inputfield,
        borderRadius: 10,
        borderColor: colors.borderColorSecondcolor,
        borderWidth: 1,
        paddingHorizontal: 16,
        height: 56,
        justifyContent: 'center',
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputWrapperFocused: {
        borderColor: colors.borderColorSecondcolor,
    },
    errorBorder: {
        borderColor: colors.error,
    },
    successBorder: {
        borderColor: colors.success,
    },
    input: {
        fontSize: scale(16),
        color: colors.comanTextcolor2,
        fontFamily: Poppins_Fonts.Poppins_Regular,
        paddingVertical: 8,
        flex: 1,
    },
    phoneTextInput: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    iconContainer: {
        position: 'absolute',
        right: 16,
        padding: 8,
    },
    message: {
        fontSize: scale(12),
        fontFamily: Poppins_Fonts.Poppins_Regular,
        marginTop: 4,
        marginLeft: 16,
    },
    error: {
        color: colors.error,
    },
    success: {
        color: colors.success,
    },
    countrySection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    flagButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 0,
    },
    callingCodeText: {
        marginLeft: 6,
        fontSize: 14,
        color: colors.comanTextcolor2,
        fontFamily: Poppins_Fonts.Poppins_Regular,
    },
    nonEditableContainer: {
        backgroundColor: colors.disabledBackground || '#f5f5f5',
    },
    nonEditableText: {
        color: colors.disabledText || '#888',
    },
    errorText: {
        color: colors.error,
        fontSize: scale(12),
        marginTop: scale(4),
        marginLeft: scale(16),
        fontFamily: Poppins_Fonts.Poppins_Regular,
    },
});

export default React.memo(LabeledInputPhone);