import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { Text, View, StatusBar, ScrollView, Alert } from "react-native";
import { styles } from "./styles";
import { BackgroundGradient } from "../../utils/SvgImage";
import ProfileMenuModal from "../../components/ProfileMenuModal/ProfileMenuModal";
import ContactCard from "../../components/ContactCard/ContactCard";
import StepIndicatorComponent from "../../components/StepIndicatorComponent/StepIndicatorComponent";
import CustomButton from "../../components/CustomButton/CustomButton";
import ApplicationCenter from '../../components/ApplicationCenter/ApplicationCenter'
import Servicetype from '../../components/Servicetype/Servicetype'
import ApplicationType from '../../components/Applicationtype/Applicationtype'
import BoxUIWithFlatList from '../../components/BoxUIWithFlatList/BoxUIWithFlatList'
import AppointmentDate from '../../components/AppointmentDate/AppointmentDate'
import AppointmentType from '../../components/AppointmentType/AppointmentType'
import LabeledInputNationality from '../../components/LabeledInputNationality/LabeledInputNationality'
import LabeledInputPhone from '../../components/LabeledInputPhone/LabeledInputPhone'
import LabeledInput from "../../components/LabeledInput/LabeledInput";
import DateofBirth from "../../components/DateBirth/DateofBirth";
import TimeSlot from '../../components/TimeSlot/TimeSlot'
import ServiceDescriptionInput from '../../components/ServiceDescriptionInput/ServiceDescriptionInput'

export default function ProcessingScreen({}) {
    const [BookanappointmentDate, setBookanappointmentDate] = useState();
    const [applicationType, setApplicationType] = useState({ label: 'Application_type', value: 'Application_type', count: 1 });
    const [dob, setDob] = useState('');
    const [selectedTime, setSelectedTime] = useState("");


      const renderApplicantForms = useCallback(() => {
        const forms = [];
        const count = typeof applicationType.count === 'number' && applicationType.count > 0 ? applicationType.count : 1;

        for (let i = 0; i < count; i++) {
            forms.push(
                <View
                    key={`applicant-${i}`}
                    style={{ marginTop: 10 }}
                >
                    <Text style={styles.Applicant}>Applicant - {i + 1} </Text>
                    <TimeSlot
                        value={selectedTime}
                         onChange={setSelectedTime}
                        // hasError={errors.timeSlot}
                        // errorMessage="Time Slot is required"
                    />
                    <LabeledInput
                        label="Applicant First Name"
                        // value={formData.first_name}
                        // onChangeText={(text) => handleInputChange("first_name", text)}
                    />
                    <LabeledInput
                        label="Applicant Last Name"
                        // value={formData.last_name}
                        // onChangeText={(text) => handleInputChange("last_name", text)}
                      
                    />
                    <DateofBirth
                        placeholder="Date of Birth*"
                        date={dob}
                        setDate={setDob}
                        // error={errors.dob}
                        // errorMessage="Date of Birth is required"
                    />
                    <LabeledInput
                        label="Passport No"
                        // value={formData.passport_no}
                        // onChangeText={(text) => handleInputChange("passport_no", text)}
                    />
                </View>
            );
        }
        return forms;
    }, []);


    return (
        <View style={styles.container}>
            <ScrollView>
                <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
                <BackgroundGradient
                    style={{ position: "absolute", width: '100%', height: '100%' }}
                />
                <View style={styles.logo}>
                    <ProfileMenuModal />
                </View>
                <ContactCard />
                <StepIndicatorComponent currentStep={2} />
                <View style={styles.proccessingText}>
                    <Text style={styles.title}>
                        Processing
                    </Text>
                    <Text style={styles.subtitle}>
                        Appointment Booking
                    </Text>
                </View>
                <View style={styles.RefreshContainer}>
                    <View style={styles.SubContainer}>
                        <Text style={styles.textstyling}>
                            Please do not refresh the page until{"\n"} the form is complete.
                        </Text>
                    </View>
                    <Text style={styles.AppoinmentText}>
                        Appointment Schedule
                    </Text>
                    <ApplicationCenter
                        // value={applicationCenter}
                        // onValueChange={handleApplicationCenterChange}
                        // hasError={errors.applicationCenter}
                        errorMessage="Application Center is required"
                    />
                    <Servicetype
                        // value={serviceType}
                        // onValueChange={handleServiceTypeChange}
                        // hasError={errors.serviceType}
                        errorMessage="Service Type is required"
                    />
                    <ApplicationType
                      value={applicationType}
                    setValue={setApplicationType}
                    />
                    <Text style={styles.AppoinmentDateText}>
                        Appointment Date:
                    </Text>
                    <BoxUIWithFlatList />
                    <AppointmentDate
                        placeholder="Click here for Appointment Date*"
                        date={BookanappointmentDate}
                        setDate={setBookanappointmentDate} // This line was commented out
                    // hasError={errors.appointmentDate}
                    // errorMessage="Appointment Date is required"
                    />
                    <AppointmentType
                   
                    />
                </View>
                <View style={{ flex: 1, padding: 20, alignItems: "center", backgroundColor: "#F0F0F0" }}>
                    <Text style={styles.PersonalInformation}>
                        Personal Information
                    </Text>
                    <View style={styles.PersonalInformationContainer}>
                        <LabeledInputNationality
                            isDropdown
                            dropdownLabel="Nationality"
                            placeholder="Select your country"
                        // onDropdownValueChange={(selected) => {
                        //     console.log(selected);
                        //     setCountry(selected?.iso);
                        //     setCallingCodeCountry(selected?.phonecode);
                        //     // Announce nationality selection for accessibility
                        // }}
                        />
                        <LabeledInputPhone
                            label="Mobile No"
                            isPhoneInput
                        // value={formData.mobile_number}
                        // onChangeText={(text) => handleInputChange("mobile_number", text)}
                        // callingCodeCountry={callingCodeCountry}
                        // selectedCountry={country}
                        // onCountryChange={(countryData) => {
                        //     // Handle country change if needed
                        // }}
                        />
                         <LabeledInput
                            label="Email address"
                            // value={formData.email}
                            // onChangeText={(text) => handleInputChange("email", text)}
                        />
                         {renderApplicantForms()}
                         <ServiceDescriptionInput />
                    </View>
                </View>
                <View style={styles.butoonConationer}>
                    <CustomButton
                        label="BOOK"
                    // onPress={handleBookAppointment}
                    // loading={loading}
                    />
                </View>
            </ScrollView>
        </View>
    );
}
