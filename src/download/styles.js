import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import { verticalScale, moderateScale } from "../utils/Responsive";
import { Geist_Fonts, Poppins_Fonts } from "../utils/fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.text,
    // alignItems:"center"
  
  },
  background: {
    position:"absolute",
    width: '100%',
    height: '100%'
  },
  logo: {
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50
  },
  titleTextView: {
    marginBottom: moderateScale(26),
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: verticalScale(34),
    fontFamily: Geist_Fonts.Geist_Bold,
    color: colors.primary,
    margin: 10
  },
  subtitle: {
    fontSize: verticalScale(16),
    fontFamily: Poppins_Fonts.Poppins_Regular,
    color: colors.comanTextcolor2,
  },
   forgetTextView: {
        marginTop: verticalScale(10),
        width: "90%",
        marginBottom:20,
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    forgetText: {
        fontSize: verticalScale(16),
        fontFamily: Geist_Fonts.Geist_SemiBold,
        color: colors.primary
    },
     accountTextContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    accountText: {
        color: colors.comanTextcolor2,
        fontFamily: Geist_Fonts.Geist_Medium,
        fontSize: verticalScale(16),
    },
    signUpText: {
        fontFamily: Geist_Fonts.Geist_Bold,
        color: colors.primary,
        fontSize: verticalScale(16),
    },
    scrollContainer:{
       flexGrow: 1,
  paddingVertical: 1,
    }
});