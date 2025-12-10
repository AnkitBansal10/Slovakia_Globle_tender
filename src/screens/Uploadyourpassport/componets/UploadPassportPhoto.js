import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ActionSheetIOS,
  Platform,
  Alert,
  Animated,
  Easing
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { scale } from '../../../utils/Responsive';
import { Poppins_Fonts } from '../../../utils/fonts';
import { colors } from '../../../utils/colors';
import * as ImagePicker from 'react-native-image-picker';
import { DeleteIcon, Refresh } from '../../../utils/SvgImage';
import PassportConfirmationModal from './PassportConfirmationModal';
import { s3 } from '../../../api/aws-config';

const UploadPassportPhoto = React.memo(({ onImageSelected, onPassportConfirmed, onProcessingStage }) => {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [imageUriForUpload, setImageUriForUpload] = useState(null);
  const scanAnim = useRef(new Animated.Value(0)).current;
  const verifyAnim = useRef(new Animated.Value(0)).current;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [passportData, setPassportData] = useState({
    surname: '',
    firstName: '',
    dateOfBirth: '',
    sex: '',
    nationality: '',
    placeOfBirth: '',
    dateOfIssue: '',
    dateOfExpiry: ''
  });
  const [error, setError] = useState(null); // New state for error handling

  const extractPassportData = async (fileName, documentType) => {
    console.log(fileName)
    try {
      setIsLoadingData(true);
      setError(null); // Clear any previous errors
      onProcessingStage?.('Extracting data...');

      const response = await fetch(
        'https://7prnhdh8pk.execute-api.ap-south-1.amazonaws.com/Test/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: fileName,
            documentType: documentType,
          }),
        }
      );
      const data = await response.json();
      console.log('API Response:', data);

      // Check for INVALID_DOCUMENT error first
      const passportDetails = data.body?.passport_details || data.passport_details;

      if (passportDetails?.error?.value === 'INVALID_DOCUMENT') {
        const errorMessage = passportDetails.message?.value || 'The uploaded document does not appear to be a valid passport';

        setIsVerifying(false);
        setIsLoadingData(false);
        setSelectedImage(null);
        setImageUriForUpload(null);
        setError(errorMessage); // Set error state instead of showing alert

        if (onImageSelected) {
          onImageSelected(null);
        }
        return;
      }

      // Helper function to extract the actual value from nested structure
      const extractValue = (field) => {
        if (!field) return '';
        // Handle nested value structure: field.value.value or field.value
        if (field.value && typeof field.value === 'object' && field.value.value) {
          return field.value.value || '';
        }
        return field.value || '';
      };

      if (passportDetails) {
        const transformedData = {
          surname: extractValue(passportDetails.surname),
          firstName: extractValue(passportDetails.given_name),
          dateOfBirth: extractValue(passportDetails.date_of_birth),
          nationality: extractValue(passportDetails.nationality),
          placeOfBirth: extractValue(passportDetails.place_of_birth),
          dateOfIssue: extractValue(passportDetails.date_of_issue),
          dateOfExpiry: extractValue(passportDetails.date_of_expiry)
        };

        setPassportData(transformedData);
        setExtractedData(transformedData);
        setError(null); // Clear error if successful
        onProcessingStage?.('Verifying information...');

        // Show confirmation after a brief delay to show verification stage
        setTimeout(() => {
          setShowConfirmation(true);
          setIsVerifying(false);
          setIsLoadingData(false);
        }, 1000);
      } else {
        setIsVerifying(false);
        setIsLoadingData(false);
        setError('Could not read passport information. Please try with a clearer image.');
      }
    } catch (error) {
      console.error('Error calling Google Vision API:', error);
      setIsVerifying(false);
      setIsLoadingData(false);
      setError('Failed to process passport image. Please try again.');
    }
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    if (onPassportConfirmed) {
      onPassportConfirmed(passportData);
    }
  };

  const handleEditField = (field) => {
    console.log(`Editing field: ${field}`);
  };

  // Clear error when user starts new upload
  const clearError = () => {
    setError(null);
  };

  // Scanning animation
  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      scanAnim.setValue(0);
      Animated.timing(scanAnim).stop();
    }
  }, [isScanning]);

  // Verification animation
  useEffect(() => {
    if (isVerifying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(verifyAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(verifyAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      verifyAnim.setValue(0);
      Animated.timing(verifyAnim).stop();
    }
  }, [isVerifying]);

  // Animation interpolations
  const scanLineTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Dimensions.get('window').height]
  });

  const verifyLineTranslateY = verifyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Dimensions.get('window').height]
  });

  const handleImageUpload = () => {
    clearError(); // Clear error when starting new upload
    setIsScanning(true);
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            openCamera();
          } else if (buttonIndex === 2) {
            openImageLibrary();
          } else {
            setIsScanning(false);
          }
        }
      );
    } else {
      openImagePickerOptions();
    }
  };

  const openImagePickerOptions = () => {
    Alert.alert(
      'Select Option',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openImageLibrary() },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setIsScanning(false)
        },
      ]
    );
  };

  const openCamera = () => {
    const options = {
      title: 'Take Passport Photo',
      mediaType: 'photo',
      cameraType: 'back',
      quality: 0.8,
      saveToPhotos: true,
    };
    ImagePicker.launchCamera(options, (response) => {
      setIsScanning(false);
      handleImageResponse(response);
    });
  };

  const openImageLibrary = () => {
    const options = {
      title: 'Select Passport Photo',
      mediaType: 'photo',
      quality: 0.8,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      setIsScanning(false);
      handleImageResponse(response);
    });
  };

  const handleImageResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
      setError('Failed to select image. Please try again.');
    } else if (response.assets && response.assets[0]) {
      const source = { uri: response.assets[0].uri };
      console.log("source" + source)
      setSelectedImage(source);
      setImageUriForUpload(response.assets[0].uri);

      // Start verification animation first
      setIsVerifying(true);
      onProcessingStage?.('Scanning passport...');

      if (onImageSelected) {
        console.log(response.assets[0].uri + "response.assets[0].uri")
        onImageSelected(response.assets[0].uri);
      }

      // Upload image after a delay to show scanning animation
      setTimeout(() => {
        onProcessingStage?.('Uploading image...');
        uploadImage(response.assets[0].uri);
      }, 2000);
    }
  };

  // Uploading the image in s3 bucket 
  const uploadImage = async (source) => {
    console.log("imageget ", source)
    if (!source) {
      setError("No image selected!");
      setIsVerifying(false);
      return;
    }
    try {
      const response = await fetch(source);
      const blob = await response.blob();
      console.log(blob, "blob")
      const fileName = `uploads/${Date.now()}.jpg`;
      console.log("fileName", fileName)
      const params = {
        Key: fileName,
        Body: blob,
        ContentType: "image/jpeg",
      };

      s3.upload(params, async (err, data) => {
        console.log("data", data)
        if (err) {
          setError("Upload Failed: " + err.message);
          setIsVerifying(false);
        } else {
          try {
            console.log("url", fileName)
            // Now call the OCR API after successful upload
            await extractPassportData(fileName, "passport");
          } catch (apiError) {
            setError("Failed to process document");
            setIsVerifying(false);
          }
        }
      });
    } catch (error) {
      setError("Error: " + error.message);
      setIsVerifying(false);
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setImageUriForUpload(null);
    setIsVerifying(false);
    setShowConfirmation(false);
    setExtractedData(null);
    setError(null); // Clear error when deleting image
    if (onImageSelected) {
      onImageSelected(null);
    }
  };

  const handleReloadImage = () => {
    handleImageUpload();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={!selectedImage ? handleImageUpload : null}
      activeOpacity={0.8}
    >
      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={selectedImage} style={styles.image} resizeMode="contain" />

          {isVerifying && (
            <View style={styles.verifyOverlay}>
              <Animated.View
                style={[
                  styles.verifyLine,
                  { transform: [{ translateY: verifyLineTranslateY }] }
                ]}
              />
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
              <View style={styles.verificationTextContainer}>
                <Text style={styles.verificationText}>
                  {extractedData ? 'Passport Verified' : 'Verifying Passport...'}
                </Text>
              </View>
            </View>
          )}
          <PassportConfirmationModal
            visible={showConfirmation}
            data={passportData}
            onConfirm={handleConfirm}
            onEdit={handleEditField}
            isLoading={isLoadingData}
          />
          <View style={styles.topRightIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleReloadImage}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Refresh width={scale(26)} height={scale(26)} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleDeleteImage}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <DeleteIcon width={scale(26)} height={scale(26)} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.innerContent}>
          {error ? (
            // Error state UI
            <View style={styles.errorContainer}>
              <View style={styles.errorIconWrapper}>
                <Feather name="alert-triangle" size={24} color={colors.error} />
              </View>
              <Text style={styles.errorTitle}>Invalid Document</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleImageUpload}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Normal upload state
            <>
              {isScanning && (
                <View style={styles.scanOverlay}>
                  <Animated.View
                    style={[
                      styles.scanLine,
                      { transform: [{ translateY: scanLineTranslateY }] }
                    ]}
                  />
                  <View style={styles.cornerTopLeft} />
                  <View style={styles.cornerTopRight} />
                  <View style={styles.cornerBottomLeft} />
                  <View style={styles.cornerBottomRight} />
                </View>
              )}
              <View style={styles.iconWrapper}>
                <Feather name="upload" size={20} color={colors.borderColor} />
              </View>
              <Text style={styles.text}>
                Click here to upload the passport photograph
              </Text>
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  )
});

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 8,
    height: scale(450),
    width: "90%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
    position: 'relative',
  },
  innerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
    height: '100%',
  },
  iconWrapper: {
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  text: {
    color: colors.commonTextColor,
    fontSize: scale(13),
    fontFamily: Poppins_Fonts.Poppins_Medium,
    textAlign: 'center',
    lineHeight: 20,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  topRightIcons: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    borderRadius: 20,
    padding: 8,
    gap: 8,
    zIndex: 2,
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
  },
  verifyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyLine: {
    position: 'absolute',
    height: 3,
    width: '100%',
    backgroundColor: 'rgba(0, 200, 255, 0.9)',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderColor: '#00FF00',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderColor: '#00FF00',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#00FF00',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#00FF00',
  },
  verificationTextContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  verificationText: {
    color: 'white',
    fontSize: scale(14),
    fontFamily: Poppins_Fonts.Poppins_SemiBold,
  },
  scanLine: {
    position: 'absolute',
    height: 2,
    width: '100%',
    backgroundColor: colors.primary,
    top: 0,
    left: 0,
  },
  // New error styles
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIconWrapper: {
    backgroundColor: '#FFEBEE',
    borderRadius: 50,
    padding: 16,
    marginBottom: 16,
  },
  errorTitle: {
    color: colors.error,
    fontSize: scale(16),
    fontFamily: Poppins_Fonts.Poppins_SemiBold,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorText: {
    color: colors.commonTextColor,
    fontSize: scale(14),
    fontFamily: Poppins_Fonts.Poppins_Regular,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: scale(14),
    fontFamily: Poppins_Fonts.Poppins_SemiBold,
  },
});

export default UploadPassportPhoto;