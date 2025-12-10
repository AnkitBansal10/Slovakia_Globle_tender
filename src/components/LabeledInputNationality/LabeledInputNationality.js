import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { scale } from '../../utils/Responsive';
import { colors } from '../../utils/colors';
import { Poppins_Fonts } from '../../utils/fonts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchNationalities } from '../../state/actions/authThunks';
import { useDispatch, useSelector } from 'react-redux';

const LabeledInput = ({
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
    isDropdown = false,
    dropdownLabel = "Passport Issue Country*",
    onDropdownValueChange,
    initialDropdownValue = null,
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);
    const [dropdownValue, setDropdownValue] = useState(initialDropdownValue);
    const dispatch = useDispatch();
    
    // Fix the selector - check your actual Redux state structure
    const { nationalities, loading, error: dropdownError } = useSelector(state => state.nationalities || state.auth);

    console.log('Nationalities data:', nationalities);

    useEffect(() => {
        if (isDropdown && !nationalities && !loading) {
            dispatch(fetchNationalities());
        }
    }, [dispatch, isDropdown, nationalities, loading]);

    useEffect(() => {
        if (dropdownError) {
            Alert.alert('Error', dropdownError.message || dropdownError);
        }
    }, [dropdownError]);

    // Fix the data mapping logic
    const [dropdownItems, countryMap] = useMemo(() => {
        if (!isDropdown) return [[], {}];

        let nationalitiesData = nationalities;
        
        // Handle different possible response structures
        if (nationalities?.data) {
            nationalitiesData = nationalities.data;
        } else if (nationalities?.nationalities) {
            nationalitiesData = nationalities.nationalities;
        }

        if (!nationalitiesData || !Array.isArray(nationalitiesData)) {
            return [[], {}];
        }

        const map = {};
        const items = nationalitiesData.map(country => {
            // Handle different country object structures
            const countryId = country.id || country.country_id || country.value;
            const countryName = country.name || country.country_name || country.label;
            
            if (countryId && countryName) {
                map[countryId] = country;
                return {
                    label: countryName,
                    value: countryId
                };
            }
            return null;
        }).filter(Boolean); // Remove null items

        return [items, map];
    }, [nationalities, isDropdown]);

    const handleDropdownValueChange = useCallback((selectedValue) => {
        setDropdownValue(selectedValue);

        if (selectedValue === null) {
            onDropdownValueChange?.(null);
            return;
        }

        const selectedCountry = countryMap[selectedValue];
        onDropdownValueChange?.(selectedCountry || null);
    }, [onDropdownValueChange, countryMap]);

    // Update dropdown value when initialDropdownValue changes
    useEffect(() => {
        if (initialDropdownValue !== dropdownValue) {
            setDropdownValue(initialDropdownValue);
        }
    }, [initialDropdownValue]);

    const ArrowDownIcon = useCallback(() => (
        <MaterialCommunityIcons name="chevron-down" size={32} color="#676767" />
    ), []);

    const ArrowUpIcon = useCallback(() => (
        <MaterialCommunityIcons name="chevron-up" size={32} color="#676767" />
    ), []);

    if (isDropdown) {
        return (
            <View style={[styles.container, { zIndex: open ? 1000 : 1 }]}>
                <Text style={styles.label}>
                    {dropdownLabel}
                </Text>
                <View style={styles.inputWrapper}>
                    <DropDownPicker
                        placeholder={loading ? "Loading countries..." : placeholder || "Select your country"}
                        open={open}
                        value={dropdownValue}
                        items={dropdownItems}
                        setOpen={setOpen}
                        setValue={setDropdownValue}
                        onChangeValue={handleDropdownValueChange}
                        style={styles.dropdownPickerStyle}
                        dropDownContainerStyle={styles.dropdownListContainer}
                        textStyle={styles.dropdownInput}
                        placeholderStyle={[styles.dropdownInput, { color: colors.commonTextColor }]}
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
                        disabled={loading || !editable}
                        loading={loading}
                        listItemLabelStyle={{ 
                            fontFamily: Poppins_Fonts.Poppins_Regular,
                            fontSize: scale(14)
                        }}
                    />
                </View>

                {(error || success) && (
                    <Text style={[
                        styles.message,
                        error ? styles.error : styles.success
                    ]}>
                        {error || success}
                    </Text>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
            </Text>

            <View style={styles.inputWrapper}>
                <TextInput
                    style={[styles.input, { paddingLeft: 20 }]}
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
            </View>

            {(error || success) && (
                <Text style={[
                    styles.message,
                    error ? styles.error : styles.success
                ]}>
                    {error || success}
                </Text>
            )}
        </View>
    );
};

export default LabeledInput;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
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
        backgroundColor: colors.Inputfield,
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
    dropdownPickerStyle: {
        backgroundColor: 'transparent',
        borderRadius: 10,
        borderColor: 'transparent',
        borderWidth: 0,
        height: 56,
        paddingHorizontal: 0,
    },
    input: {
        fontSize: scale(16),
        color: colors.comanTextcolor2,
        fontFamily: Poppins_Fonts.Poppins_Regular,
        paddingVertical: 8,
        paddingRight: 40,
    },
    dropdownInput: {
        fontSize: scale(16),
        color: colors.comanTextcolor2,
        fontFamily: Poppins_Fonts.Poppins_Regular,
        paddingVertical: 8,
        paddingRight: 40,
        marginLeft: 0,
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
    dropdownListContainer: {
        borderColor: colors.borderColorSecondcolor,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 8,
        backgroundColor: colors.Inputfield,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginTop: 40,
    },
    searchContainer: {
        borderBottomColor: colors.borderColorSecondcolor,
        paddingHorizontal: 0,
        marginTop: 10,
    },
    searchInput: {
        borderColor: colors.borderColorSecondcolor,
        borderRadius: 8,
        fontFamily: Poppins_Fonts.Poppins_Regular,
        paddingLeft: 10,
    },
});