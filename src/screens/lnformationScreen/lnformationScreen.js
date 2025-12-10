import React, { useCallback,useState} from "react";
import {View, Text, StatusBar, ScrollView,RefreshControl} from "react-native";
import { styles } from "./styles";
import Textinput from "../../components/TextInput/Textinput";
import { BackgroundGradient } from "../../utils/SvgImage";
import { scale } from "../../utils/Responsive";
import CustomButton from "../../components/CustomButton/CustomButton";
import ContactCard from "../../components/ContactCard/ContactCard";
import ProfileMenuModal from '../../components/ProfileMenuModal/ProfileMenuModal'
import PhoneInputField from "../../components/PhoneInputField/PhoneInputField";
import StepIndicatorComponent from '../../components/StepIndicatorComponent/StepIndicatorComponent'
import CaptchaInput from '../../components/CaptchaInput/CaptchaInput'

export default function InformationScreen({ navigation }) {
   const [refreshing, setRefreshing] = useState(false);
      const onRefresh = useCallback(() => {
          setRefreshing(true);
          setTimeout(() => {
              // Add your data refresh logic here
              console.log("Refreshing data...");
              setRefreshing(false);
          }, 2000);
      }, []);
  return (
    <View
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: scale(20) }}
                    refreshControl={
                          <RefreshControl
                              refreshing={refreshing}
                              onRefresh={onRefresh}
      
                              tintColor="#000000"
                              title="Pull to refresh"
                              titleColor="#000000"
                          />
                      }>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
        <BackgroundGradient
          style={{ position: "absolute", width: '100%', height: '100%' }}
        />
        <View style={styles.logo}>
          <ProfileMenuModal
          />
        </View>
        <ContactCard
        />
        <StepIndicatorComponent currentStep={1}/>
        <View style={{ justifyContent: "center", alignItems: "center", marginTop: scale(20) }}>
          <Text style={styles.title}>Information</Text>
          <Text
            style={styles.subtitle}>
            Appointment Booking Form
          </Text>
        </View>
        <View style={[styles.inputview, { marginTop: scale(40) }]}>
        </View>
        <View
          style={{ alignItems: "center" }}
        >
          <Textinput
            placeholder="Email Address *"
            validationType="email"
            autoCapitalize="none"
          />
          <Textinput
            placeholder="Applicant First Name*"
            validationType="email"
            autoCapitalize="none"
          />
          <Textinput
            placeholder="Applicant Last Name *"
            validationType="email"
            autoCapitalize="none"
          />
          <Textinput
            placeholder="Applicant Title*"
            validationType="email"
            autoCapitalize="none"
          />
          <PhoneInputField />
          <CaptchaInput
          />
        </View>
        <View style={{ marginBottom: scale(30), marginTop: scale(30) }}>
          <CustomButton
            label="Continue"
            onPress={()=>navigation.navigate("UploadPassportPhoto")}
          />
        </View>
      </ScrollView>
    </View>
  );
}