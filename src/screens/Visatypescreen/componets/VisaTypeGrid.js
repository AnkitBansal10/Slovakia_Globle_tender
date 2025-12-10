import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

import { Geist_Fonts } from '../../../utils/fonts';
import { colors } from '../../../utils/colors';
import { data } from '../../../utils/MockData';
import { scale, verticalScale, moderateScale } from '../../../utils/Responsive';
import { Arrow, Vistypeimage } from '../../../utils/SvgImage';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - scale(64)) / 2;

const VisaTypeGrid = () => {
  return (
    <FlatList
      data={data}
      numColumns={2}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card}>
        <Arrow 
        style={styles.arrowIcon}
        />
          <View style={styles.box}>
           <Vistypeimage
            width={scale(50)}
            height={scale(50)}
           />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default VisaTypeGrid;

const styles = StyleSheet.create({
  container: {
        marginTop:20,
  },
  card: {
    width: CARD_SIZE,
    height: verticalScale(140),
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    margin: scale(6),
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  box: {
    top: verticalScale(20),
    right: scale(30),
    alignItems: 'center',
  },
  icon: {
    marginBottom: verticalScale(10),
    width: scale(50),
    height: verticalScale(50),
  },
  title: {
    fontSize: moderateScale(16),
    color: colors.primary,
    fontFamily: Geist_Fonts.Geist_Medium,
    textAlign: 'center',
  },
  arrowIcon: {
    position: 'absolute',
    top: verticalScale(10),
    right: scale(14),
  },
});
