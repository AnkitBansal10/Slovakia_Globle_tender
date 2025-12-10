import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { destinationData } from '../../utils/MockData';
import { moderateScale, scale } from '../../utils/Responsive';
import { colors } from '../../utils/colors';
import { Geist_Fonts, Poppins_Fonts } from '../../utils/fonts';
import { Avtar, BookMark, Location } from '../../utils/SvgImage';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.58;
const CARD_MARGIN = 8;
const SNAP_INTERVAL = CARD_WIDTH + (CARD_MARGIN * 2); // Fixed: Correct snap interval calculation

// Memoized card item component
const CardItem = React.memo(({ item, navigation }) => {
  const locationIconDimensions = useMemo(() => ({
    width: scale(16),
    height: scale(16)
  }), []);

  const avatarDimensions = useMemo(() => ({
    width: scale(54),
    height: scale(24)
  }), []);

  const bottomRowStyle = useMemo(() => ({
    flexDirection: "row",
    width: "100%",
    alignItems: "center"
  }), []);

  const handlePress = useCallback(() => {
    if (navigation) {
      navigation.navigate("ApplicationSection", { 
        item: item
      });
    }
  }, [navigation, item]);

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8} 
      onPress={handlePress}
    >
      <Image
        source={item.image}
        style={styles.image}
        resizeMode="cover"
        fadeDuration={200}
      />
      <TouchableOpacity style={styles.bookmarkIconContainer} activeOpacity={0.7}>
        <BookMark width={34} height={34} />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
          <View style={styles.ratingRow}>
            <Icon name="star" size={16} color="#F7B801" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>
        <View style={bottomRowStyle}>
          <View style={styles.containerLocation}>
            <Location
              width={locationIconDimensions.width}
              height={locationIconDimensions.height}
            />
            <Text style={styles.location} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
          <View style={styles.avatars}>
            <Avtar
              width={avatarDimensions.width}
              height={avatarDimensions.height}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

CardItem.displayName = 'CardItem';

const CardSlider = React.memo(({ navigation }) => {
  // Memoized render function
  const renderItem = useCallback(({ item }) => (
    <CardItem item={item} navigation={navigation} />
  ), [navigation]);

  // Memoized key extractor
  const keyExtractor = useCallback((item) => item.id, []);

  // Fixed: Improved getItemLayout for better performance
  const getItemLayout = useCallback((data, index) => ({
    length: CARD_WIDTH + (CARD_MARGIN * 2),
    offset: (CARD_WIDTH + (CARD_MARGIN * 2)) * index,
    index,
  }), []);

  // Fixed: Better FlatList configuration for smooth scrolling
  return (
    <FlatList
      data={destinationData}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.list}
      snapToInterval={SNAP_INTERVAL}
      snapToAlignment="center" // Added: Better snapping behavior
      decelerationRate="normal" // Changed: Better for smooth scrolling
      getItemLayout={getItemLayout}
      removeClippedSubviews={false} // Changed: Can cause stuttering on some devices
      maxToRenderPerBatch={5} // Increased: Render more items per batch
      windowSize={7} // Increased: Larger window for smoother scrolling
      initialNumToRender={3} // Increased: Render more initial items
      scrollEventThrottle={32} // Increased: Smoother scrolling
      bounces={false}
      disableIntervalMomentum={false} // Added: Allow momentum scrolling
      pagingEnabled={false} // Ensure this is false when using snapToInterval
    />
  );
});

CardSlider.displayName = 'CardSlider';

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 6, // Reduced: Less padding for better edge behavior
  },
  card: {
    width: CARD_WIDTH,
    marginTop: 10,
    backgroundColor: colors.text,
    borderRadius: 16,
    marginBottom: 30,
    marginHorizontal: CARD_MARGIN, // Use consistent margin
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  bookmarkIconContainer: {
    position: 'absolute',
    top: moderateScale(20),
    right: moderateScale(20),
    borderRadius: moderateScale(20),
    width: moderateScale(36),
    height: moderateScale(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginTop: moderateScale(10),
    borderRadius: 16,
    height: scale(240),
    width: '90%',
  },
  content: {
    padding: 12,
    width: "100%"
  },
  header: {
    width: "94%",
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: Geist_Fonts.Geist_SemiBold,
    fontSize: 18,
    lineHeight: 20,
    marginBottom: 6,
    color: colors.commonTextColor
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 15,
    color: colors.commonTextColor,
    fontFamily: Poppins_Fonts.Poppins_Regular
  },
  containerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "70%"
  },
  location: {
    fontSize: scale(13),
    color: colors.comanTextcolor2,
    marginLeft: scale(2),
  },
  avatars: {
    flexDirection: 'row',
    alignItems: "center"
  },
});

export default CardSlider;