import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Text, TouchableHighlight, Animated, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { LinearGradient } from "expo-linear-gradient"
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'

const { width, height } = Dimensions.get('window')

const GetStarted = () => {
    const navigation = useNavigation()
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(50)).current
    const pulseAnim = useRef(new Animated.Value(1)).current
    const rotateAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start()

        // Slide up animation
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }).start()

        // Pulse animation for music waves
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start()

        // Rotation animation for vinyl record
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 10000,
                useNativeDriver: true,
            })
        ).start()
    }, [])

    const handleGetStarted = () => {
        navigation.navigate("signin")
    }

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    return (
        <View style={styles.main}>
            <StatusBar style="light" backgroundColor="transparent" />
            
            {/* Background Elements */}
            <View style={styles.backgroundElements}>
                {/* Animated Vinyl Record */}
                <Animated.View style={[styles.vinylRecord, { 
                    transform: [{ rotate: spin }],
                    opacity: fadeAnim 
                }]}>
                    <View style={styles.vinylOuter}>
                        <View style={styles.vinylInner}>
                            <View style={styles.vinylCenter}>
                                <Icon name="music" opacity={0.4} size={30} color="#CD6AAB" />
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Music Wave Circles */}
                <Animated.View style={[styles.waveCircle1, { 
                    transform: [{ scale: pulseAnim }],
                    opacity: fadeAnim 
                }]} />
                <Animated.View style={[styles.waveCircle2, { 
                    transform: [{ scale: pulseAnim }],
                    opacity: fadeAnim 
                }]} />
                <Animated.View style={[styles.waveCircle3, { 
                    transform: [{ scale: pulseAnim }],
                    opacity: fadeAnim 
                }]} />

                {/* Floating Music Notes */}
                <View style={styles.musicNote1}>
                    <Icon name="music-note" size={24} color="#944EE0" />
                </View>
                <View style={styles.musicNote2}>
                    <Icon name="music-note-eighth" size={20} color="#CD6AAB" />
                </View>
                <View style={styles.musicNote3}>
                    <Icon name="music-note-quarter" size={18} color="#944EE0" />
                </View>
            </View>

            {/* App Logo */}
            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
                <View style={styles.logoBackground}>
                    <Icon name="music-box" size={40} color="rgba(234, 141, 247, 0.3)" />
                </View>
                <Text style={styles.logoText}>Noctune</Text>
            </Animated.View>

            {/* Content Section */}
            <Animated.View style={[styles.contentContainer, { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
            }]}>
                <View style={styles.textContainer}>
                    <Text style={styles.mainText}>WHEN WORDS</Text>
                    <Text style={styles.mainText}>FAIL</Text>
                    <Text style={styles.mainText}> {'\n'}MUSIC FINDS</Text>
                    <Text style={styles.mainText}>YOU</Text>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>
                        Immerse yourself in a world of endless music.
                    </Text>
                    <Text style={styles.description}>
                        Discover new friends, create perfect playlists,
                    </Text>
                    <Text style={styles.description}>
                        and let every beat sync with your heartbeat.
                    </Text>
                </View>

                <TouchableHighlight
                    onPress={handleGetStarted}
                    style={styles.getStartedButton}
                    underlayColor="rgba(148, 78, 224, 0.8)"
                >
                    <LinearGradient
                        colors={['rgba(160, 39, 216, 0.3)', 'rgba(35, 124, 32, 0.3)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                        <Icon name="arrow-right" size={20} color="white" />
                    </LinearGradient>
                </TouchableHighlight>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#141414',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundElements: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    vinylRecord: {
        position: 'absolute',
        top: '25%',
        right: '10%',
    },
    vinylOuter: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#1c2c32',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(62, 194, 57, 0.3)',
    },
    vinylInner: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#141414',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1c2c32',
    },
    vinylCenter: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1c2c32',
        justifyContent: 'center',
        alignItems: 'center',
    },
    waveCircle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        borderWidth: 2,
        borderColor: 'rgba(57, 185, 194, 0.3)',
        top: '20%',
        left: '20%',
    },
    waveCircle2: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        borderWidth: 1,
        borderColor: 'rgba(205, 106, 171, 0.2)',
        top: '10%',
        left: '10%',
    },
    waveCircle3: {
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: 250,
        borderWidth: 1,
        borderColor: 'rgba(148, 78, 224, 0.1)',
        top: '5%',
        left: '5%',
    },
    musicNote1: {
        position: 'absolute',
        top: '25%',
        left: '15%',
        opacity: 0.7,
    },
    musicNote2: {
        position: 'absolute',
        top: '35%',
        right: '25%',
        opacity: 0.6,
    },
    musicNote3: {
        position: 'absolute',
        top: '45%',
        left: '25%',
        opacity: 0.5,
    },
    logoContainer: {
        position: 'absolute',
        top: 60,
        left: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoBackground: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 0, 234, 0.1)',
    },
    logoText: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginTop: 100,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    mainText: {
        fontFamily: 'Poppins-ExtraBold',
        color: 'beige',
        fontSize: 42,
        fontWeight: '800',
        lineHeight: 45,
        textAlign: 'center',
        textShadowColor: 'rgba(148, 78, 224, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    descriptionContainer: {
        alignItems: 'center',
        marginBottom: 50,
        paddingHorizontal: 20,
    },
    description: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: 'Poppins-Regular',
    },
    getStartedButton: {
        width: 200,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#944EE0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    gradientButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        fontWeight: '600',
        marginRight: 10,
    },
})

export default GetStarted