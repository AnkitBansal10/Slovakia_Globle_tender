import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Animated,
    Dimensions
} from 'react-native';
import LottieView from 'lottie-react-native';
import { OpenSans_Fonts } from '../../utils/fonts';
import { colors } from '../../utils/colors';

const { width, height } = Dimensions.get('window');

const LoginSuccessScreen = ({ navigation }) => {
    const scaleValue = new Animated.Value(0);
    const fadeValue = new Animated.Value(0);
    const lottieRef = useRef(null);

    useEffect(() => {
        // Start the checkmark animation
        setTimeout(() => {
            lottieRef.current?.play();
        }, 300);
          setTimeout(() => {
            navigation.navigate("BottomTabNavigator")
        },500,[]);

        // Animation sequence
        Animated.parallel([
            Animated.spring(scaleValue, {
                toValue: 1,
                tension: 20,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeValue, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();

        // Navigate after 3 seconds if needed
        const timer = setTimeout(() => {
            // navigation.navigate('Home'); // Uncomment if you want auto-navigation
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Animated Checkmark with Lottie */}
                <Animated.View
                    style={[
                        styles.checkmarkContainer,
                        {
                            transform: [{ scale: scaleValue }],
                            opacity: fadeValue
                        }
                    ]}
                >
                    <View style={styles.checkmarkBackground}>
                        <LottieView
                            ref={lottieRef}
                            source={require('../../assets/icons/Correct_Tick.json')} // Fixed path - removed spaces
                            autoPlay={true}
                            loop={false}
                            style={styles.lottieAnimation}
                            resizeMode="cover"
                        />
                    </View>
                </Animated.View>

                {/* Success Message */}
                <Animated.View style={[
                    styles.messageContainer,
                    { opacity: fadeValue }
                ]}>
                    <Text style={styles.successTitle}>Successfully Logged In!</Text>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    checkmarkContainer: {
        marginBottom: 30,
    },
    checkmarkBackground: {
        width: 180,
        height: 50,
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottieAnimation: {
        width: 100,
        height: 100,
    },
    messageContainer: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    successTitle: {
        fontSize: 24,
        fontFamily: OpenSans_Fonts.OpenSans_SemiBold,
        fontWeight: '800',
        color: colors.borderColor,
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    successSubtitle: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 300,
        fontWeight: '400',
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
        gap: 16,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    backButton: {
        backgroundColor: 'transparent',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E2E8F0',
    },
    backButtonText: {
        color: '#718096',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    footerText: {
        fontSize: 12,
        color: '#48BB78',
        fontWeight: '500',
        letterSpacing: 0.3,
    },
});

export default LoginSuccessScreen;