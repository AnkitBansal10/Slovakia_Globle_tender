import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { TextInput, View, StyleSheet, Text } from 'react-native';
import { colors } from '../../utils/colors';
import { Poppins_Fonts } from '../../utils/fonts';

const Textinput = React.memo(({
  placeholder,
  value = '',
  onChangeText,
  onBlur,
  validationType,
  isOptional = false,
  externalError,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  // Sync internal value with external value prop
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleTextChange = useCallback((newText) => {
    setInternalValue(newText);
    onChangeText?.(newText);
  }, [onChangeText]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const inputStyle = useMemo(() => [
    styles.inputWrapper,
    isFocused && styles.inputFocused,
    externalError && styles.inputError,
    isOptional && styles.optionalInput,
  ], [isFocused, externalError, isOptional]);

  return (
    <View style={styles.container}>
      <View style={inputStyle}>
        <TextInput
          style={styles.input}
          placeholder={isOptional ? `${placeholder} (optional)` : placeholder}
          value={internalValue}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholderTextColor={colors.comanTextcolor2}
          returnKeyType="done"
          {...props}
        />
      </View>
      {externalError ? <Text style={styles.errorText}>{externalError}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginBottom: 20,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.borderColorSecondcolor,
  },
  optionalInput: {
    backgroundColor: colors.optionalBackground || '#f9f9f9',
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    fontSize: 16,
    color: colors.comanTextcolor2,
    fontFamily: Poppins_Fonts.Poppins_Regular
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
});

export default Textinput;