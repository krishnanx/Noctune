import { View, Text, TouchableOpacity, Linking, StyleSheet, Animated, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';

export default function UpdateBanner() {
  const { outdated, updateUrl, forceUpdate, showBanner, latest, current } = useSelector(state => state.version);
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (outdated && showBanner !== false) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }).start();
    }
  }, [outdated, showBanner]);

  if (!outdated || showBanner === false) return null;

  const isForceUpdate = forceUpdate;
  const bannerColor = isForceUpdate ? 'black' : 'black';
  const gradientEnd = isForceUpdate ? 'purple' : 'purple';

  return (
    <Modal
      visible={true}
      animationType="fade"
      transparent={true}
      statusBarTranslucent
    >
      <View style={styles.modalBackground}>
        <Animated.View
          style={[
            styles.banner,
            {
              backgroundColor: bannerColor,
              paddingTop: insets.top + 16,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={[styles.gradientOverlay, { backgroundColor: gradientEnd, opacity: 0.3 }]} />

          <View style={styles.container}>
            <View style={styles.contentWrapper}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Text style={styles.icon}>{isForceUpdate ? '⚠️' : '🚀'}</Text>
              </View>

              <View style={styles.textContent}>
                <Text style={styles.title}>
                  {isForceUpdate ? 'Critical Update Required' : 'New Update Available'}
                </Text>
                <Text style={styles.subtitle}>
                  {isForceUpdate
                    ? 'Please update to continue using the app'
                    : `Version ${latest} is now available (current: ${current})`}
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.updateButton, { backgroundColor: 'rgba(255,255,255,0.9)' }]}
                onPress={() => Linking.openURL(updateUrl)}
                activeOpacity={0.8}
              >
                <Text style={[styles.updateButtonText, { color: bannerColor }]}>
                  {isForceUpdate ? 'Update Now' : 'Update'}
                </Text>
                <Text style={styles.updateIcon}>{">"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalBackground: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.3)', // optional dim background
  justifyContent: 'flex-start',
  alignItems: 'center',
},
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  container: {
    position: 'relative',
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  textContent: {
    flex: 1,
    paddingTop: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  closeIcon: {
    color: 'black',
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  updateIcon: {
    fontSize: 16,
    fontWeight: '600',
    color: 'inherit',
  },
  laterButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  laterButtonText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
});