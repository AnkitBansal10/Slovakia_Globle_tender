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
    Dimensions,
    Text,
    Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';
import { WightLogo, Backgroundsmall, Slovakia, CellPhone, Mail, World, Location, SlovakiaBackground } from '../../utils/SvgImage';
import { scale } from '../../utils/Responsive';
import VisaInfoTabs from './Component/VisaInfoTabs';

const { height } = Dimensions.get('window');

export default function VisaDetailScreen({navigation}) {

    console.log("hi")
    return (
        <View style={styles.container}>
            <ScrollView >
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
                <SlovakiaBackground />
                <View style={styles.overlay}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
                        <Text style={styles.locationText}>Senegal</Text>
                    </View>
                    <View style={{ borderWidth: 0.50, marginTop: 20, borderColor: "#D9D9D9", marginBottom: 20 }} />
                    <Text style={styles.title}>
                        <Text style={styles.highlight}>Short term Business visa </Text>
                    </Text>
                    <View style={{ flex: 1, minHeight:height }}>
                    <VisaInfoTabs />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}


