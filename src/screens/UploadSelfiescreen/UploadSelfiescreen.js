import React, { useState } from "react";
import {
    View,
    StatusBar,
    Alert,
} from "react-native";
import { styles } from "./styles";
import { BackgroundGradient } from "../../utils/SvgImage";
import ProfileMenuModal from "../../components/ProfileMenuModal/ProfileMenuModal";
import ContactCard from "../../components/ContactCard/ContactCard";
import StepProgress from "./componets/StepIndicator";
import UploadPassportPhoto from "./componets/UploadPassportPhoto";
import CustomButton from "../../components/CustomButton/CustomButton";
import { authorize, uploadMedia } from "../../api/ozApi";

export default function UploadSelfiescreen({
    currentStep = 1,
    totalSteps = 2,
    navigation,
}) {
    const [passportImageUri, setPassportImageUri] = useState(null);
    const [token, setToken] = useState(null);
    const [folderId, setFolderId] = useState(null);
    const [imageurl,setimageurl] = useState(null)
    const [loading, setLoading] = useState(false);

    // --------------------------------------------------
    // IMAGE SELECTED
    // --------------------------------------------------
    const handleImageSelected = async (uri) => {
        console.log("Selected image:", uri);
        setPassportImageUri(uri);
        if (!uri) return;
        try {
            setLoading(true);
            const accessToken = await authorize();
            if (!accessToken) throw new Error("Authorization failed");
            setToken(accessToken);
            const uploadResponse = await uploadMedia({
                accessToken,
                videoPath: "",
                photoPath:"",
            });
            setimageurl(uri)
            console.log("url",uri)
            const folder_id = uploadResponse?.folder_id;
            if (!folder_id) throw new Error("Folder ID not returned");
            setFolderId(folder_id);
            console.log("Upload success. Folder ID:", folder_id);
        } catch (e) {
            Alert.alert("Upload Error", e?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------------------------
    // CONTINUE BUTTON
    // --------------------------------------------------
    const handleContinue = () => {
        if (!token || !folderId||!imageurl) {
            Alert.alert("Error", "Upload not completed yet");
            return;
        }
        navigation.navigate("LivenessScreen", {
            token,
            folderId,
            imageurl
        });
    };
    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />
            <BackgroundGradient
                style={{ position: "absolute", width: "100%", height: "100%" }}
            />
            <View style={styles.logo}>
                <ProfileMenuModal />
            </View>
            <View style={styles.inputview}>
                <ContactCard />
                <StepProgress currentPosition={2} />
                <View style={styles.uploadContainer}>
                    <UploadPassportPhoto onImageSelected={handleImageSelected} />
                </View>
                {passportImageUri && (
                    <CustomButton
                        label={loading ? "Uploading..." : "Continue"}
                        disabled={loading}
                        onPress={handleContinue}
                    />
                )}
            </View>
        </View>
    );
}
