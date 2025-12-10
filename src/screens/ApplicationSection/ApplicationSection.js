import { Background, CellPhone, Location, Mail, World, WightLogo, Slovakiaflag, Slovakia, SlovakiaBackground } from '../../utils/SvgImage';
import { View, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, RefreshControl, Text, ImageBackground, Image } from 'react-native';
import EmbassyServiceCard from '../../components/EmbassyServiceCard/EmbassyServiceCard'
import FavoritePlacesSlider from '../../components/FavoritePlacesSlider/FavoritePlacesSlider'
import TravelInsuranceCard from '../../components/TravelInsuranceCard/TravelInsuranceCard'
import InsuranceNoticeCard from '../../components/InsuranceNoticeCard/InsuranceNoticeCard'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import CustomButton from '../../components/CustomButton/CustomButton';
import ContactCards from '../../components/ContactCards/ContactCards';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale } from '../../utils/Responsive';
import { styles } from './styles'

export default function ApplicationSection({  route,navigation }) {
    const [refreshing, setRefreshing] = useState(false);

    const { item } = route.params;

    console.log(item)

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Simulate refresh action - replace with your actual refresh logic
        setTimeout(() => {
            // Add your data refresh logic here
            console.log("Refreshing data...");
            setRefreshing(false);
        }, 2000);
    }, []);

    const handleBackPress = useCallback(() => {
        navigation.goBack();
    }, [navigation]);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}

                        tintColor="#000000"
                        title="Pull to refresh"
                        titleColor="#000000"
                    />
                }>
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
                <SlovakiaBackground style={{ width: '100%', height: '20%' }} />
                <View style={styles.overlay}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                        <Ionicons name="chevron-back" size={24} color="#828181" />
                    </TouchableOpacity>
                    <WightLogo height={scale(39)} width={scale(79)} style={styles.logo} />
                </View>
                <View style={styles.subcaionter}>
                    <View style={styles.topRow}>
                        <View style={styles.flagRow}>
                            <Slovakia
                                height={scale(15)}
                                width={scale(30)}
                            />
                            <Text style={styles.country}>Slovakia</Text>
                        </View>
                        <View style={styles.iconGroup}>
                            <TouchableOpacity
                                style={styles.iconBtn}
                            // onPress={() => handleContactAction('phone')}
                            >
                                <CellPhone />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.iconBtn}
                            // onPress={() => handleContactAction('mail')}
                            >
                                <Mail />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.iconBtn}
                            // onPress={() => handleContactAction('world')}
                            >
                                <World />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Location Row */}
                    <View style={styles.locationRow}>
                        <Location /> 
                        <Text style={styles.locationText}>{item?.from||item?.name}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.heading}>
                            Welcome to BLS Slovakia {"\n"}Visa Centre
                        </Text>
                        <Text style={styles.bodyText}>
                            BLS International Services Ltd. is a trustworthy partner of the Embassy of {"\n"}Slovakia in Senegal for managing the{"\n"} administrative and non-judgmental tasks of processing visa applications.
                        </Text>
                        <Text style={styles.bodyText}>
                            Applicants are solely responsible for the application they submit. Any false information or misrepresentation of facts, incomplete or invalid supporting documents will have a direct bearing on the decision carried out by the Embassy of Slovakia in Senegal.
                        </Text>
                    </View>
                    <EmbassyServiceCard />
                    <InsuranceNoticeCard />
                    <FavoritePlacesSlider />
                    <TravelInsuranceCard />
                    <ContactCards />
                </View>
            </ScrollView>
            {/* Book Appointment Button */}
            <View style={{ marginBottom: 10 }}>
                <CustomButton label='BOOK AN APPOINTMENT' onPress={() => navigation.navigate("InformationScreen")} />
            </View>
        </SafeAreaView>
    );
}