// App.js or HomeScreen.js

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    SafeAreaView,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { scale } from '../../utils/Responsive';
import { styles } from '../Homescreen/styles'
import { BackgroundGradient, BlackLogo, ButtonImage, } from '../../utils/SvgImage';
import CountryDropdown from "../../components/CountryDropdown/CountryDropdown"
import GradienButton from '../../components/GradientButton/GradientButton'
import CardSlider from '../../components/CardSlider/CardSlider'
import CardSliderBox from '../../components/CardSliderBox/CardSliderBox'

const HomeScreen = ({ navigation }) => {
    const [selectedFrom, setSelectedFrom] = useState(null);
    const [selectedTo, setSelectedTo] = useState(null);
    const [showError, setShowError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [viewAll, setViewAll] = useState(false);
    const [loadingView, setLoadingView] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            console.log("Refreshing data...");
            setRefreshing(false);
        }, 2000);
    }, []);

    const toggleView = () => {
        setLoadingView(true);
        // Simulate fast loading (you can adjust timing based on your actual data loading)
        setTimeout(() => {
            setViewAll(prevViewAll => !prevViewAll);
            setLoadingView(false);
        }, 300); // Reduced to 300ms for faster response
    };

    const handleContinue = () => {
        if (!selectedFrom || !selectedTo) {
            setShowError(true);
            return;
        }
        setShowError(false);
        navigation.navigate("ApplicationSection", {
            item: selectedFrom,
        });
    };

    const renderCardSection = () => {
        if (loadingView) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#000" />
                    <Text style={styles.loadingText}>Loading destinations...</Text>
                </View>
            );
        }

        return !viewAll ? (
            <CardSlider navigation={navigation} viewAll={true} />
        ) : (
            <CardSliderBox />
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#000000"
                        title="Pull to refresh"
                        titleColor="#000000"/>}>
                <BackgroundGradient
                    style={{ position: "absolute", width: '100%', height: '100%' }}
                />
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />
                <View style={styles.header}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <BlackLogo
                            width={scale(85.67)}
                            height={scale(60)}
                        />
                    </View>
                    <Text style={styles.title}>Your gateway to</Text>
                    <Text style={styles.subtitle}
                        adjustsFontSizeToFit
                        minimumFontScale={0.8}
                        numberOfLines={1}
                    >
                        Global <Text style={styles.highlight}>Exploration!</Text></Text>
                    <ButtonImage
                        width={scale(146.92)}
                        height={scale(15.36)}
                        style={styles.vector}
                    />
                    <View style={{ padding: 6 }}>
                        <Text style={styles.subHeading}>Applying for a visa?</Text>
                        <CountryDropdown
                            selectedFrom={selectedFrom}
                            selectedTo={selectedTo}
                            onFromChange={setSelectedFrom}
                            onToChange={setSelectedTo}
                            showError={showError}
                        />

                        <GradienButton
                            title="Continue"
                            onPress={handleContinue}
                        />
                    </View>
                    <View style={styles.bestDestinations}>
                        <Text style={styles.sectionTitle}>Best Destination</Text>
                        <TouchableOpacity onPress={toggleView}>
                            <Text style={styles.viewAll}>
                                {viewAll ? 'View Less' : 'View All'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {renderCardSection()}
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;