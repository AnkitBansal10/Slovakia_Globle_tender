import React, { useCallback, useState } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  View, 
  ActivityIndicator,
  Text 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../utils/colors';
import { scale } from '../../utils/Responsive';
import { Butonlogo } from '../../utils/SvgImage';

const GRADIENT_COLORS = ['#996600', '#cc9900'];
const DISABLED_GRADIENT_COLORS = ['#cccccc', '#999999'];

const GradientButton = ({ 
  title = 'GO', 
  onPress,
  width = "40%",
  height = 56,
  iconSize = 70,
  loading = false,
  disabled = false,
  showIcon = true,
  showTitle = false,
  gradientColors = GRADIENT_COLORS,
  disabledGradientColors = DISABLED_GRADIENT_COLORS
}) => {
  const [internalLoading, setInternalLoading] = useState(false);

  const handlePress = useCallback(async () => {
    console.log("GradientButton pressed");
    if (loading || disabled || internalLoading) return;
    
    try {
      setInternalLoading(true);
      await onPress?.();
    } catch (error) {
      console.error('Button press error:', error);
    } finally {
      setInternalLoading(false);
    }
  }, [onPress, loading, disabled, internalLoading]);

  const currentGradientColors = disabled ? disabledGradientColors : gradientColors;
  const isLoading = loading || internalLoading;
  const isButtonDisabled = disabled || isLoading;

  return (
    <TouchableOpacity 
      style={[styles.buttonContainer, { width, height }]} 
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={isButtonDisabled}
    >
      <LinearGradient
        colors={currentGradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.text} />
          ) : (
            <>
              {showIcon && (
                <Butonlogo
                  width={scale(iconSize)}
                  height={scale(iconSize)}
                />
              )}
              {showTitle && (
                <Text style={styles.title}>{title}</Text>
              )}
            </>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: scale(16),
    fontWeight: '600',
    marginLeft: scale(8),
  },
});

export default React.memo(GradientButton);