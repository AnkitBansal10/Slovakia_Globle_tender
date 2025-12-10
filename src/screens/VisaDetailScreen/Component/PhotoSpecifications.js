import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Geist_Fonts, Poppins_Fonts } from '../../../utils/fonts';
import { colors } from '../../../utils/colors';
import { scale } from '../../../utils/Responsive';

const PhotoSpecifications = () => {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Photo Specifications</Text>
      <Text style={styles.note}>
        Note:-We regret we cannot accept photographs that do not meet these requirements.
      </Text>
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../../assets/images/Photo_Spec.gif')} 
          style={styles.image} 
        />
      </View>
      <View style={styles.listContainer}>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>•  Piano</Text> Please provide one recent photograph (not more than 6 months old) of yourself, which should not have been used previously in the passport. The photograph should be in colour and:
        </Text>
        <View style={styles.indented}>
          <Text style={styles.listItem}>• Taken against a light background (white or off-white) so that features are distinguishable and contrast against the background.</Text>
          <Text style={styles.indentedItem}>apart from background.</Text>
          <Text style={styles.listItem}>• red color is a key point behind the face button.</Text>
          <Text style={styles.listItem}>• green texture is a key point behind the front panel.</Text>
          <Text style={styles.listItem}>• dark texture is a key point behind the top panel. A fitting or more visual coloring within the original screen</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <Text style={styles.note}>
        Note:- Please follow these instructions carefully. If photographs presented
        do not meet these requirements your application will be considered incomplete.
        A photo booth meeting these requirements is available at the centre..
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: scale(16),
    paddingBottom: scale(30),
  },
  title: {
    fontSize: scale(24),
    fontFamily: Geist_Fonts.Geist_SemiBold,
    color: colors.commonTextColor,
    marginBottom: scale(12),
  },
  note: {
    fontStyle: 'italic',
    marginBottom: scale(12),
    lineHeight: scale(20),
    fontFamily: Poppins_Fonts.Poppins_Regular,
    color: colors.comanTextcolor2,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: scale(12),
  },
  image: {
    height: scale(100), 
    width: scale(100),
  },
  listContainer: {
    marginBottom: scale(12),
  },
  listItem: {
    color: colors.comanTextcolor2,
    fontFamily: Poppins_Fonts.Poppins_Regular,
    fontSize: scale(12),
    marginBottom: scale(4),
    lineHeight: scale(20),
  },
  indented: {
    marginLeft: scale(16),
  },
  indentedItem: {
    color: colors.primary,
    fontFamily: Poppins_Fonts.Poppins_Regular,
    fontSize: scale(12),
    marginLeft: scale(16),
    marginBottom: scale(4),
    lineHeight: scale(20),
  },
  bold: {
    fontFamily: Geist_Fonts.Geist_SemiBold,
    fontSize: scale(14),
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: scale(12),
  },
});

export default PhotoSpecifications;