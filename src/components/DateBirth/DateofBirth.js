import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ClanderIcon } from '../../utils/SvgImage';
import { colors } from '../../utils/colors';
import { Poppins_Fonts } from '../../utils/fonts';

const generateYears = (start = 1950, end = new Date().getFullYear()) => {
  return Array.from({ length: end - start + 1 }, (_, i) => `${start + i}`).reverse();
};

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DateofBirth = forwardRef(({ 
  date, 
  setDate, 
  placeholder = "Select DOB", 
  required = false,
  showHover = true,
  error, // Add error prop for React Hook Form
  ...props
}, ref) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState('calendar');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [isHovered, setIsHovered] = useState(false);

  // Expose methods for React Hook Form
  useImperativeHandle(ref, () => ({
    focus: () => setModalVisible(true),
    blur: () => setModalVisible(false),
  }));

  const onDayPress = (day) => {
    setDate(day.dateString);
    setModalVisible(false);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(parseInt(year));
    setMode('month');
  };

  const handleMonthSelect = (index) => {
    setSelectedMonth(index);
    setMode('calendar');
  };

  const getCurrentMarked = () => {
    if (!date) return {};
    return {
      [date]: {
        selected: true,
        selectedColor: colors.primary,
      },
    };
  };

  const getCalendarDate = () => {
    return `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
  };

  const handlePressIn = () => {
    if (showHover) {
      setIsHovered(true);
    }
  };

  const handlePressOut = () => {
    if (showHover) {
      setIsHovered(false);
    }
  };

  const getInputBoxStyle = () => {
    const stylesArray = [styles.inputBox];
    
    if (isHovered && showHover) {
      stylesArray.push(styles.inputBoxHover);
    }
    
    if (error) {
      stylesArray.push(styles.inputBoxError);
    }
    
    return stylesArray;
  };

  return (
    <View>
      <TouchableOpacity 
        style={getInputBoxStyle()}
        onPress={() => setModalVisible(true)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
        {...props}
      >
        <View style={styles.textContainer}>
          <Text style={[styles.inputText, !date && styles.placeholderText]}>
            {date || placeholder}
          </Text>
        </View>
        <ClanderIcon />
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.calendarWrapper}>
            {mode === 'calendar' && (
              <>
                <View style={styles.header}>
                  <TouchableOpacity 
                    onPress={() => setMode('year')}
                    style={styles.headerButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.headerText}>{selectedYear}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setMode('month')}
                    style={styles.headerButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.headerText}>{months[selectedMonth]}</Text>
                  </TouchableOpacity>
                </View>
                <Calendar
                  current={date || getCalendarDate()}
                  onDayPress={onDayPress}
                  markedDates={getCurrentMarked()}
                  maxDate={new Date().toISOString().split('T')[0]}
                  theme={{
                    todayTextColor: colors.primary,
                    arrowColor: colors.primary,
                  }}
                />
              </>
            )}

            {mode === 'year' && (
              <FlatList
                data={generateYears(1950)}
                keyExtractor={(item) => item}
                numColumns={3}
                contentContainerStyle={styles.gridList}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    onPress={() => handleYearSelect(item)} 
                    style={styles.gridItem}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.gridText,
                      selectedYear === parseInt(item) && styles.selectedGridText
                    ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {mode === 'month' && (
              <FlatList
                data={months}
                keyExtractor={(item) => item}
                numColumns={3}
                contentContainerStyle={styles.gridList}
                renderItem={({ item, index }) => (
                  <TouchableOpacity 
                    onPress={() => handleMonthSelect(index)} 
                    style={styles.gridItem}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.gridText,
                      selectedMonth === index && styles.selectedGridText
                    ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});

export default DateofBirth;

const styles = StyleSheet.create({
  inputBox: {
    height:60,
    width: '90%',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.borderColorSecondcolor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputBoxHover: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    transform: [{ scale: 1.01 }],
  },
  inputBoxError: {
    borderColor: '#ff0000',
    borderWidth: 1,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inputText: {
    fontSize: 16,
    color: colors.comanTextcolor2,
    fontFamily: Poppins_Fonts.Poppins_Regular,
  },
  placeholderText: {
    color: '#888',
  },
  requiredAsterisk: {
    color: '#ff0000',
    fontSize: 16,
    marginLeft: 4,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginLeft: 10,
    marginTop: -4,
    marginBottom: 16,
    fontFamily: Poppins_Fonts.Poppins_Regular,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarWrapper: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 6,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.primary,
  },
  gridList: {
    padding: 12,
  },
  gridItem: {
    width: '30%',
    padding: 12,
    margin: 6,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  gridText: {
    fontFamily: Poppins_Fonts.Poppins_Regular,
    color: colors.comanTextcolor2,
  },
  selectedGridText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  modalFooter: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f2f2f2',
  },
  cancelButtonText: {
    color: colors.comanTextcolor2,
    fontFamily: Poppins_Fonts.Poppins_Regular,
  },
});