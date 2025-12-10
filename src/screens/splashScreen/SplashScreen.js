import React, { useEffect } from "react";
import { View, StyleSheet, StatusBar } from 'react-native';
import { colors } from '../../utils/colors';
import { LogoWight } from '../../utils/SvgImage';

export default function SplashScreen({navigation}) {

useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("GetStartedScreen");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={colors.primary} />
            <LogoWight width="30%" height="30%" />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center"
    }
});