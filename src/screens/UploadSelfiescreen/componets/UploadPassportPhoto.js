import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ActionSheetIOS, Platform, Alert, PermissionsAndroid } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { scale } from '../../../utils/Responsive';
import { Poppins_Fonts } from '../../../utils/fonts';
import { colors } from '../../../utils/colors';
import * as ImagePicker from 'react-native-image-picker';
import { DeleteIcon, Refresh } from '../../../utils/SvgImage';

const screenWidth = Dimensions.get('window').width;

const UploadPassportPhoto = ({ onImageSelected }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Request camera permission for Android
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Request photo library permission for Android
  const requestStoragePermission = async () => {
    try {
      // For Android 13+ (API level 33+), we need READ_MEDIA_IMAGES instead of READ_EXTERNAL_STORAGE
      const androidVersion = Platform.Version;
      let storagePermission;

      if (androidVersion >= 33) {
        // Android 13+ uses READ_MEDIA_IMAGES
        storagePermission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
      } else {
        // Android 12 and below uses READ_EXTERNAL_STORAGE
        storagePermission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      }

      const granted = await PermissionsAndroid.request(
        storagePermission,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your photos to select images.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleImageUpload = () => {
    // Show options first without requesting permissions
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Selfie'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            await openCamera();
          } else if (buttonIndex === 2) {
            await openImageLibrary();
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
        { text: 'Take Selfie', onPress: () => openCamera() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = async () => {
    // Check and request camera permission only when user chooses camera
    if (Platform.OS === 'android') {
      const hasCameraPermission = await requestCameraPermission();
      if (!hasCameraPermission) {
        Alert.alert(
          'Camera Permission Required',
          'Camera permission is required to take photos.',
          [
            {
              text: 'OK',
              onPress: () => console.log('Camera permission denied')
            }
          ]
        );
        return;
      }
    }

    const options = {
      title: 'Take Selfie',
      mediaType: 'photo',
      cameraType: 'front', // Force front camera
      quality: 0.8,
      saveToPhotos: true,
      includeBase64: false,
    };

    ImagePicker.launchCamera(options, (response) => {
      handleImageResponse(response);
    });
  };

  const openImageLibrary = async () => {
    // Check and request storage permission only when user chooses gallery
    if (Platform.OS === 'android') {
      const hasStoragePermission = await requestStoragePermission();
      if (!hasStoragePermission) {
        Alert.alert(
          'Storage Permission Required',
          'Storage permission is required to access your photos.',
          [
            {
              text: 'OK',
              onPress: () => console.log('Storage permission denied')
            }
          ]
        );
        return;
      }
    }

    const options = {
      title: 'Select Photo',
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      handleImageResponse(response);
    });
  };

  const handleImageResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);

      // Handle specific error cases
      if (response.error.includes('permission') || response.errorCode === 'permission') {
        Alert.alert(
          'Permission Denied',
          'Please grant the required permissions in your device settings to continue.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to process image. Please try again.');
      }
    } else if (response.errorCode) {
      switch (response.errorCode) {
        case 'camera_unavailable':
          Alert.alert('Error', 'Camera is not available on this device.');
          break;
        case 'permission':
          Alert.alert(
            'Permission Denied',
            'Please grant camera and storage permissions in your device settings.',
            [{ text: 'OK' }]
          );
          break;
        case 'others':
          Alert.alert('Error', response.errorMessage || 'An error occurred while accessing the camera.');
          break;
        default:
          Alert.alert('Error', 'An error occurred while accessing the camera.');
      }
    } else if (response.assets && response.assets[0]) {
      const source = { uri: response.assets[0].uri };
      setSelectedImage(source);
      if (onImageSelected) {
        onImageSelected(response.assets[0].uri);
      }
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
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
          <View style={styles.iconWrapper}>
            <Feather name="upload" size={20} color={colors.borderColor} />
          </View>
          <Text style={styles.text}>
            Click here to take your selfie (front camera will be used)
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

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
  },
  innerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  },
  iconButton: {
    // Styles for your icon buttons
  },
});

export default UploadPassportPhoto;