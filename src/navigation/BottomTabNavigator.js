import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import { scale } from '../utils/Responsive';
import { colors } from '../utils/colors';
import HomeScreen from '../screens/Homescreen/HomeScreen';
import ChatScreen from '../screens/ChatScreen/ChatScreen'
import DocumentScreen from '../screens/DocumentScreen/DocumentScreen'
import ApplicationScreen from '../screens/ApplicationScreen/ApplicationScreen'

import {
  Application,
  Chatbot,
  Menu,
  Documents,
  Home,
  WightApplication,
  HomeGray,
  WightDocuments,
  WightMenu,
  WightChat,
} from '../utils/SvgImage';
import { Poppins_Fonts } from '../utils/fonts';

const Tab = createBottomTabNavigator();

const tabIcons = {
  Home: {
    focused: Home,
    unfocused: HomeGray,
  },
  Applications: {
    focused: WightApplication,
    unfocused: Application,
  },
  Documents: {
    focused: WightDocuments,
    unfocused: Documents,
  },
  Chatbot: {
    focused: WightChat,
    unfocused: Chatbot,
  },
  Menu: {
    focused: WightMenu,
    unfocused: Menu,
  },
};

const AnimatedTabIcon = ({ focused, iconSet, routeName }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // Focused animation sequence
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.1,
            tension: 150,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: -scale(4),
            tension: 150,
            friction: 3,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Unfocused animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  const IconComponent = iconSet
    ? focused
      ? iconSet.focused
      : iconSet.unfocused
    : null;

  if (!IconComponent) {
    return (
      <View style={styles.iconWrapper}>
        <Text style={styles.label}>{routeName}</Text>
      </View>
    );
  }

  const needsWiderWidth = focused && (routeName === "Applications" || routeName === "Documents");
  const wrapperWidth = needsWiderWidth ? scale(75) : scale(54);
  const needsLeftShift = routeName === "Chatbot" || routeName === "Documents";
  const leftMargin = needsLeftShift ? scale(12) : 0;

  return (
    <Animated.View
      style={[
        styles.iconWrapper,
        focused && styles.activeTabBackground,
        {
          width: wrapperWidth,
          left: leftMargin,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
        }}
      >
        <IconComponent
          width={scale(25.56)}
          height={scale(23.82)}
        />
      </Animated.View>
      <Animated.Text
        style={[
          styles.label,
          focused && styles.activeLabel,
          { 
            width: needsWiderWidth ? scale(90) : scale(80),
            transform: [{ translateY: slideAnim }],
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {routeName}
      </Animated.Text>
    </Animated.View>
  );
};

const CustomTabBarButton = ({ children, onPress, accessibilityState }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      tension: 150,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 150,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.tabBarButton,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const screenOptions = ({ route }) => ({
  headerShown: false,
  tabBarShowLabel: false,
  tabBarIcon: ({ focused }) => {
    const iconSet = tabIcons[route.name];
    return (
      <AnimatedTabIcon 
        focused={focused} 
        iconSet={iconSet} 
        routeName={route.name} 
      />
    );
  },
  tabBarButton: (props) => <CustomTabBarButton {...props} />,
  tabBarStyle: {
    ...styles.tabBar,
  },
  tabBarItemStyle: {
    flex: 1,
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Applications" component={ApplicationScreen} />
      <Tab.Screen name="Documents" component={DocumentScreen} />
      <Tab.Screen name="Chatbot" component={ChatScreen} />
      <Tab.Screen name="Menu" component={HomeScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
   tabBar: {
    height: scale(78),
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    backgroundColor: colors.text,
    paddingBottom: 0,
    paddingTop: 0,
  },
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    marginTop: scale(24),
    height: scale(60),
    padding: 10,
    alignItems: 'center',
    marginBottom:30,
    justifyContent: 'center',
    borderRadius: 10,
  },
  activeTabBackground: {
    backgroundColor: '#B99147',
    shadowColor: '#B99147',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: scale(10),
    fontFamily: Poppins_Fonts.Poppins_Regular,
    color: colors.borderColor,
    marginTop: scale(2),
    flexShrink: 1,
    flexGrow: 0,
    textAlign: 'center',
  },
  activeLabel: {
    color: '#fff',
    fontWeight: '600',
  },
});