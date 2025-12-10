import React, { useState, useMemo, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { colors } from '../../utils/colors';
import { Eye, CloseEye } from '../../utils/SvgImage';

const PasswordInput = ({ 
  value = '', 
  onChangeText, 
  onBlur,
  placeholder = "Password",
  error,
  validationRules = {
    minLength: 8,
    requireUppercase: true,
    requireNumber: true,
    requireSpecialChar: true
  }
}) => {
  const [secure, setSecure] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = useMemo(() => [
    styles.container, 
    isFocused && styles.focusedContainer,
    error && styles.errorContainer
  ], [error, isFocused]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const toggleSecure = useCallback(() => {
    setSecure(prev => !prev);
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={containerStyle}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          secureTextEntry={secure}
          style={styles.input}
          placeholderTextColor={colors.placeholderText}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          accessibilityLabel="Password input field"
          accessibilityHint={error ? error : "Enter your password"}
        />
        <TouchableOpacity 
          onPress={toggleSecure}
          accessibilityLabel={secure ? "Show password" : "Hide password"}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {secure ? <CloseEye /> : <Eye />}
        </TouchableOpacity>
      </View>
      {error && (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '90%',
    marginBottom: 16,
    backgroundColor: "#ffffff"
  },
  container: {
    height:60,
    backgroundColor: colors.backgroundLight,
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.borderColorSecondcolor,
  },
  focusedContainer: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  errorContainer: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.comanTextcolor2,
    paddingVertical: 0,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontFamily: 'Regular',
  },
});

export default React.memo(PasswordInput);