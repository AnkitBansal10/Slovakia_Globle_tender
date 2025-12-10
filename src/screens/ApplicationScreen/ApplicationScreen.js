import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackgroundGradient, BlackLogo } from '../../utils/SvgImage';
import { scale } from '../../utils/Responsive';
import { colors } from '../../utils/colors';
import { Geist_Fonts } from '../../utils/fonts';

const ApplicationScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const appointmentData = {
    all: 1,
    confirmed: 0,
    cancelled: 0,
    completed: 1
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      console.log("Refreshing data...");
      setRefreshing(false);
    }, 2000);
  }, []);

  const StatusCard = ({ title, count, type }) => {
    const getCardStyle = () => {
      switch (type) {
        case 'all':
          return styles.allCard;
        case 'confirmed':
          return styles.confirmedCard;
        case 'cancelled':
          return styles.cancelledCard;
        case 'completed':
          return styles.completedCard;
        default:
          return styles.allCard;
      }
    };
    const getCountStyle = () => {
      switch (type) {
        case 'all':
          return styles.allCount;
        case 'confirmed':
          return styles.confirmedCount;
        case 'cancelled':
          return styles.cancelledCount;
        case 'completed':
          return styles.completedCount;
        default:
          return styles.allCount;
      }
    };

    const getIconConfig = () => {
      switch (type) {
        case 'all':
          return { name: 'event', color: colors.primaryBlue || '#1976d2' };
        case 'confirmed':
          return { name: 'check-circle', color: colors.successGreen || '#2e7d32' };
        case 'cancelled':
          return { name: 'cancel', color: colors.errorRed || '#d32f2f' };
        case 'completed':
          return { name: 'done-all', color: colors.purple || '#7b1fa2' };
        default:
          return { name: 'event', color: colors.primaryBlue || '#1976d2' };
      }
    };

    const iconConfig = getIconConfig();

    return (
      <View style={[styles.card, getCardStyle()]}>
        <View style={styles.iconContainer}>
          <Icon
            name={iconConfig.name}
            size={scale(28)}
            color={iconConfig.color}
          />
        </View>
        <Text style={[styles.cardCount, getCountStyle()]}>{count}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundGradient
        style={styles.backgroundGradient}
      />
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000000"
            title="Pull to refresh"
            titleColor="#000000" />}>
        <View style={styles.header}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <BlackLogo
              width={scale(85.67)}
              height={scale(60)}
            />
          </View>
          <Text style={styles.headerTitle}>Appointment Status</Text>
        </View>
        <View style={styles.statsContainer}>
          <StatusCard
            title="All Appointments"
            count={appointmentData.all}
            type="all"
          />
          <StatusCard
            title="Confirmed Appointments"
            count={appointmentData.confirmed}
            type="confirmed"
          />
          <StatusCard
            title="Cancelled Appointments"
            count={appointmentData.cancelled}
            type="cancelled"
          />
          <StatusCard
            title="Completed Appointments"
            count={appointmentData.completed}
            type="completed"
          />
        </View>
        <View style={styles.additionalInfo}>
          <Text style={styles.infoText}>
            Manage and track your appointments efficiently
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
// Use the same styles as above
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#f8f9fa',
  },
  backgroundGradient: {
    position: "absolute",
    width: '100%',
    height: '100%'
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    marginTop: scale(60),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(20),
    marginBottom: scale(40)
  },
  headerTitle: {
    fontSize: scale(30),
    marginTop:scale(40),
    fontFamily: Geist_Fonts.Geist_Regular,
    color: colors.commonTextColor || '#333333',
    textAlign: 'center',
  },
  statsContainer: {
    padding: scale(16),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: scale(20),
    borderRadius: scale(16),
    marginBottom: scale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: scale(140),
  },
  allCard: {
    backgroundColor: colors.allCardBg || '#e3f2fd',
  },
  confirmedCard: {
    backgroundColor: colors.confirmedCardBg || '#e8f5e8',
  },
  cancelledCard: {
    backgroundColor: colors.cancelledCardBg || '#ffebee',
  },
  completedCard: {
    backgroundColor: colors.completedCardBg || '#f3e5f5',
  },
  iconContainer: {
    marginBottom: scale(12),
  },
  cardTitle: {
    fontSize: scale(14),
    fontFamily: Geist_Fonts.Geist_Regular,
    color: colors.cardText || '#555555',
    textAlign: 'center',
    marginTop: scale(4),
  },
  cardCount: {
    fontSize: scale(32),
    fontFamily: Geist_Fonts.Geist_Bold,
    marginBottom: scale(4),
  },
  allCount: {
    color: colors.primaryBlue || '#1976d2',
  },
  confirmedCount: {
    color: colors.successGreen || '#2e7d32',
  },
  cancelledCount: {
    color: colors.errorRed || '#d32f2f',
  },
  completedCount: {
    color: colors.purple || '#7b1fa2',
  },
  additionalInfo: {
    padding: scale(20),
    alignItems: 'center',
    marginTop: scale(20),
  },
  infoText: {
    fontSize: scale(16),
    fontFamily: Geist_Fonts.Geist_Regular,
    color: colors.secondaryText || '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ApplicationScreen;