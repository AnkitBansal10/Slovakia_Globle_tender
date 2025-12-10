import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CountryFlag from "react-native-country-flag";
import { colors } from '../../utils/colors';
import { Poppins_Fonts } from '../../utils/fonts';
import { Nationality } from "../../state/actions/authThunks"
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../utils/Responsive';

const PassportCountryDropdown = ({
  onValueChange,
  initialValue = null,
  label = "Passport Issue Country*",
  value, // Controlled value from parent/form
  error, // Error prop for validation
  required = false // Required prop
}) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(initialValue);
  const dispatch = useDispatch();
  const { nationalities, loading, error: apiError } = useSelector(state => state.auth);

  // Use the controlled value if provided, otherwise use internal state
  const currentValue = value !== undefined ? value : internalValue;

  // Sync internal value with external value prop
  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  useEffect(() => {
    dispatch(Nationality());
  }, [dispatch]);

  useEffect(() => {
    if (apiError) {
      Alert.alert('Error', apiError);
    }
  }, [apiError]);

  const items = useMemo(() => {
    if (!nationalities?.data) return [];

    return nationalities.data.map(country => ({
      label: country.name,
      value: country.id,
      icon: () => (
        <CountryFlag 
          isoCode={country.iso} 
          size={16} 
          style={styles.flag}
        />
      ),
    }));
  }, [nationalities]);

  const handleValueChange = useCallback((selectedValue) => {
    // Update internal state
    setInternalValue(selectedValue);

    // Always pass the selected value (ID) to the parent
    onValueChange?.(selectedValue);
  }, [onValueChange]);

  // Handle the setValue function from DropDownPicker
  const handleSetValue = useCallback((setter) => (newValue) => {
    setter(newValue);
    handleValueChange(newValue);
  }, [handleValueChange]);

  const ArrowDownIcon = useCallback(() => (
    <Icon name="chevron-down" size={24} color="#676767" />
  ), []);

  const ArrowUpIcon = useCallback(() => (
    <Icon name="chevron-up" size={24} color="#676767" />
  ), []);

  // Determine dropdown style based on error state
  const getDropdownStyle = () => {
    const style = [styles.dropdown];
    if (error) {
      style.push(styles.dropdownError);
    }
    return style;
  };

  const getDropdownContainerStyle = () => {
    const style = [styles.dropdownContainer];
    if (error) {
      style.push(styles.dropdownContainerError);
    }
    return style;
  };

  return (
    <View style={styles.container}>
      <DropDownPicker
        placeholder={loading ? "Loading countries..." : label}
        open={open}
        value={currentValue}
        items={items}
        setOpen={setOpen}
        setValue={handleSetValue(setInternalValue)}
        onChangeValue={handleValueChange}
        style={getDropdownStyle()}
        dropDownContainerStyle={getDropdownContainerStyle()}
        textStyle={styles.text}
        placeholderStyle={styles.placeholder}
        showArrowIcon={true}
        ArrowDownIconComponent={ArrowDownIcon}
        ArrowUpIconComponent={ArrowUpIcon}
        listMode="MODAL"
        modalProps={{
          animationType: 'fade',
        }}
        modalContentContainerStyle={styles.modalContent}
        searchable={true}
        searchPlaceholder="Search countries..."
        searchContainerStyle={styles.searchContainer}
        searchTextInputStyle={styles.searchInput}
        disabled={loading}
        loading={loading}
        // Flag icon styling
        iconStyle={styles.iconStyle}
        labelStyle={styles.labelStyle}
        onSelectItem={(item) => {
          // Additional safety to ensure selection is captured
          console.log('Selected item:', item);
        }}
      />
      
      {/* Error message display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {/* Required asterisk */}
      {required && !currentValue && !error && (
        <View style={styles.requiredContainer}>
          <Text style={styles.requiredAsterisk}>*</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    marginBottom: scale(20),
  },
  dropdown: {
    borderRadius: 10,
    height: 60,
    width: "90%",
    borderWidth: 1,
    borderColor: colors.borderColorSecondcolor,
    backgroundColor: '#fff',
  },
  dropdownError: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  dropdownContainer: {
    borderColor: colors.borderColorSecondcolor,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 2,
    width: "90%",
    alignSelf: 'center',
  },
  dropdownContainerError: {
    borderColor: colors.error,
  },
  text: {
    fontSize: 16,
    fontFamily: Poppins_Fonts.Poppins_Regular,
    color: colors.comanTextcolor2,
  },
  placeholder: {
    fontFamily: Poppins_Fonts.Poppins_Regular,
    color: colors.comanTextcolor2,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  searchContainer: {
    borderBottomColor: colors.borderColorSecondcolor,
    paddingHorizontal: 0,
  },
  searchInput: {
    borderColor: colors.borderColorSecondcolor,
    borderRadius: 8,
  },
  flag: {
    borderRadius: 2,
    overflow: 'hidden',
  },
  iconStyle: {
    width: 30,
    height: 20,
  },
  labelStyle: {
    marginLeft: 10,
  },
  errorContainer: {
    width: '90%',
    marginTop: 4,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    fontFamily: Poppins_Fonts.Poppins_Regular,
    marginLeft: 4,
  },
  requiredContainer: {
    position: 'absolute',
    right: '8%',
    top: 18,
  },
  requiredAsterisk: {
    color: colors.error,
    fontSize: 16,
    fontFamily: Poppins_Fonts.Poppins_Regular,
  },
});

export default PassportCountryDropdown;