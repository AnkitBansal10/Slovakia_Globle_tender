import { StyleSheet } from "react-native";
import { Geist_Fonts, Poppins_Fonts } from '../../utils/fonts';
import { colors } from '../../utils/colors';
import { moderateScale, scale} from "../../utils/Responsive";


export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.text
    },
    gradientBackground: {
        flex: 1,
    },
    header: {
        marginTop: 40,
        paddingHorizontal: 20,
    },
    logo: {
        width: 100,
        height: 40,
        alignSelf: 'center',
    },
    title: {
        fontSize: 38,
        fontFamily: Geist_Fonts.Geist_Regular,
        marginTop: 20,
        marginBottom: 10,
        color: colors.commonTextColor,
    },
    subtitle: {
        fontSize: 38,
        fontFamily: Geist_Fonts.Geist_SemiBold,
        color: colors.commonTextColor,
        textAlign: "justify"
    },
    vector: {
        left: moderateScale(190),
        top: scale(-8)
    },
    highlight: {
        fontSize: 38,
        fontFamily: Geist_Fonts.Geist_Bold,
        color: colors.primary
    },
    subHeading: {
        fontSize: 20,
        color: colors.commonTextColor,
        marginBottom: 15,
        fontFamily: Geist_Fonts.Geist_SemiBold
    },
    form: {
        // padding: 20,
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ECECEC',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        fontSize: 16,
    },
    icon: {
        marginRight: 8,
    },
    goButton: {
        width: "40%",
        backgroundColor: '#d8a441',
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    goText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    bestDestinations: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        marginTop: 10,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        color: colors.commonTextColor,
        fontFamily: Geist_Fonts.Geist_SemiBold
    },
    viewAll: {
        color: colors.primary,
        fontFamily: Poppins_Fonts.Poppins_Regular,
        fontSize: 14,
    },
    loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
},
loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
    minHeight: scale(200),
},
loadingText: {
    marginTop: scale(10),
    fontSize: scale(14),
    color: '#666',
},

});