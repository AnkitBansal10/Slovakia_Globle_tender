import React from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For CLI
import { styles } from './styles';
import VisaTypeGrid from './componets/VisaTypeGrid';
import LogntermvisaGrid from './componets/LogntermvisaGrid';
import { SlovakiaBackground, Slovakia, CellPhone, Location, Mail, World, } from '../../utils/SvgImage';
import { scale } from '../../utils/Responsive';

export default function VisaTypescreen({navigation}) {
    return (
        <View style={styles.container}>
            <ScrollView >
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
                <SlovakiaBackground />
                <View style={styles.overlay}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="#828181" />
                    </TouchableOpacity>
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
                            <TouchableOpacity style={styles.iconBtn}>
                                <CellPhone />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn}>
                                <Mail />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn}>
                                <World />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.locationRow}>
                        <Location />
                        <Text style={styles.locationText}>Slovakia</Text>
                    </View>
                    <View style={styles.ContainerVisa} />
                    <Text style={styles.title}>
                        <Text style={styles.highlight}>Visa</Text>
                        <Text style={styles.highlight}> Types</Text>
                    </Text>
                    <Text style={styles.subtitle}>Short term visa</Text>
                    <VisaTypeGrid />
                    <Text style={styles.subtitle}>Long term visa</Text>
                    <LogntermvisaGrid />
                </View>
            </ScrollView>
        </View>
    );
}


