import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CountryFlag from "react-native-country-flag";
import { FlagIcon, Flight } from '../../utils/SvgImage';
import { scale } from '../../utils/Responsive';
import { colors } from '../../utils/colors';
import { Poppins_Fonts } from '../../utils/fonts';
import { COUNTRIES, COUNTRIE } from '../../utils/MockData'

const CountryDropdown = ({ 
    selectedFrom, 
    selectedTo, 
    onFromChange, 
    onToChange, 
    showError 
}) => {
    const [openFrom, setOpenFrom] = useState(false);
    const [openTo, setOpenTo] = useState(false);

    // Prepare items with icons
    const fromItems = useMemo(() => 
        COUNTRIE.map(country => ({
            label: country.label,
            value: country.value,
            icon: () => (
                <CountryFlag 
                    isoCode={country.iso.toLowerCase()} 
                    size={18} 
                />
            ),
        })), []
    );

    const toItems = useMemo(() => 
        COUNTRIES.map(country => ({
            label: country.label,
            value: country.value,
            icon: () => (
                <CountryFlag 
                    isoCode={country.iso.toLowerCase()} 
                    size={18} 
                />
            ),
        })), []
    );

    // Simple value change handlers
    const handleFromChange = useCallback((value) => {
        onFromChange(value);
    }, [onFromChange]);

    const handleToChange = useCallback((value) => {
        onToChange(value);
    }, [onToChange]);

    // Get selected country info
    const selectedFromCountry = useMemo(() => 
        COUNTRIE.find(c => c.value === selectedFrom),
        [selectedFrom]
    );
    
    const selectedToCountry = useMemo(() => 
        COUNTRIES.find(c => c.value === selectedTo),
        [selectedTo]
    );

    return (
        <View style={styles.container}>
            {/* From Country */}
            <View style={styles.row}>
                <View style={styles.iconContainer}>
                    <FlagIcon width={scale(16)} height={scale(18)} />
                </View>
                <View style={styles.dropdownContainer}>
                    <DropDownPicker
                        open={openFrom}
                        value={selectedFrom}
                        items={fromItems}
                        setOpen={setOpenFrom}
                        setValue={handleFromChange}
                        placeholder="I'm applying from"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownBox}
                        textStyle={styles.text}
                        placeholderStyle={styles.placeholder}
                        listMode="SCROLLVIEW"
                        onClose={() => setOpenTo(false)}
                        zIndex={openFrom ? 3000 : 1000}
                        zIndexInverse={openFrom ? 1000 : 3000}
                    />
                </View>
            </View>
            
            {showError && !selectedFrom && (
                <Text style={styles.errorText}>Please select applying from country</Text>
            )}

            {/* To Country */}
            <View style={styles.row}>
                <View style={[styles.iconContainer, openFrom && styles.hidden]}>
                    <Flight width={scale(24.21)} height={scale(18)} />
                </View>
                <View style={styles.dropdownContainer}>
                    <DropDownPicker
                        open={openTo}
                        value={selectedTo}
                        items={toItems}
                        setOpen={setOpenTo}
                        setValue={handleToChange}
                        placeholder="I'm going to"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownBox}
                        textStyle={styles.text}
                        placeholderStyle={styles.placeholder}
                        listMode="SCROLLVIEW"
                        // showTickIcon={true}
                        onClose={() => setOpenFrom(false)}
                        zIndex={openTo ? 3000 : 1000}
                        zIndexInverse={openTo ? 1000 : 3000}
                    />
                </View>
            </View>
            
            {showError && !selectedTo && (
                <Text style={styles.errorText}>Please select destination country</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        position: 'relative',
    },
    dropdownContainer: {
        flex: 1,
    },
    dropdown: {
        borderColor: '#ECECEC',
        borderWidth: 1,
        borderRadius: 12,
        height: 60,
        paddingLeft: 50,
        backgroundColor: 'white',
    },
    dropdownBox: {
        borderColor: '#ECECEC',
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: 'white',
        maxHeight: 400,
    },
    text: {
        color: colors.comanTextcolor2,
        fontFamily: Poppins_Fonts.Poppins_Regular,
        fontSize: 16,
    },
    placeholder: {
        color: colors.comanTextcolor2,
        fontFamily: Poppins_Fonts.Poppins_Regular,
        fontSize: 16,
    },
    iconContainer: {
        position: 'absolute',
        left: 15,
        zIndex: 4000,

        top: 20,
    },
    hidden: {
        opacity: 0,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginLeft: 60,
        marginBottom: 8,
        fontFamily: Poppins_Fonts.Poppins_Regular,
    },
    selectedPreview: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ECECEC',
    },
    selectedCountry: {
        marginBottom: 8,
    },
    previewLabel: {
        fontSize: 12,
        fontFamily: Poppins_Fonts.Poppins_Regular,
        color: colors.comanTextcolor2,
        marginBottom: 4,
    },
    countryWithFlag: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    previewFlag: {
        marginRight: 8,
    },
    previewText: {
        fontSize: 14,
        fontFamily: Poppins_Fonts.Poppins_SemiBold,
        color: colors.comanTextcolor2,
    },
});

export default React.memo(CountryDropdown);