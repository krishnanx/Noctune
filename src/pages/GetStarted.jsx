import React, { useContext } from 'react'
import { View, StyleSheet, Text, Image, PixelRatio, TouchableHighlight } from 'react-native'
// import Ellipse4 from "../assets/Ellipse 4.png"
// import Ellipse5 from "../assets/Ellipse 5.png"
// import Ellipse6 from "../assets/Ellipse 6.png"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import send from "../assets/send.png"
import { LinearGradient } from "expo-linear-gradient";
import vector1 from "../../assets/Vector 1.png"
import { useFonts } from 'expo-font';
// import { font } from '../Context/fontContext'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar';
const GetStarted = () => {
    // const { fontsLoaded } = useContext(font)
    const Navigation = useNavigation()
    const styles = StyleSheet.create({
        Main: {
            flex: 1,
            backgroundColor: '#141414',
            flexDirection: 'column',
            justifyContent: "center",
            alignItems: 'center'
        },
        NutrigenView: {
            width: 100,
            height: 50,
            position: 'absolute',
            top: 20,
            left: 20,
            justifyContent: "center",
            alignItems: "center"
        },
        Ellipse: {
            width: "100%",
            height: "60%",
            position: "relative"
        },
        Info: {
            width: "100%",
            position: 'relative',
            height: "40%",

        },
        circle2: {
            width: 450,
            height: 450,
            borderWidth: 1.5,
            borderColor: `rgba(202, 202, 202,1)`,
            borderRadius: 300,
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ rotate: '93.52deg' }],

        },
        circle3: {
            width: 640,
            height: 640,
            borderWidth: 1.5,
            borderColor: `rgba(202, 202, 202,0.5)`,
            position: "absolute",
            top: -170,
            left: -50,
            borderRadius: 300,
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ rotate: '158.9deg' }], // Rotates the view by 45 degrees          
            marginRight: 30,
            marginTopt: 60
        },
        circle1: {
            width: 300,
            height: 300,
            borderWidth: 1.5,
            borderRadius: 300,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: `rgba(202, 202, 202, 1)`,
        },
        text: {
            fontFamily: 'Poppins-ExtraBold',
            color: "white",
            lineHeight: 40,
            fontSize: 40,
        },
        TextView: {
            width: 400,
            height: 240,
            position: 'absolute',
            top: -50,
            marginLeft: 35,
        },
        aboutView: {
            width: 300,
            height: 200,
            position: 'absolute',
            top: 80,
            left: 150
        },
        about: {
            color: 'white',
            fontSize: 10,
            textAlign: "left",
        },
        getStarted: {
            width: 167,
            height: 50,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 260,
            right: 30,

        },
        getStartedView: {

            flexDirection: 'row',
            width: "100%",
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
            height: 50,
        },
        vector: {
            position: "absolute",
            top: 130,
            right: 200,
        },


    })
    const handleHome = () => {
        Navigation.navigate("signin")
    }
    return (
        <View
            style={styles.Main}
        >
            {/* <StatusBar style="light" backgroundColor={'transparent'} /> */}
            <View
                style={styles.Ellipse}
            >

                <View style={[styles.circle3, { opacity: 0.25 }]}>
                    <View style={[styles.circle2, { opacity: 1, position: 'absolute' }]}>
                        <View style={styles.circle1}></View>
                    </View>

                </View>

                {/* // <Image source={Ellipse4} style={{ position: "absolute", left: 110, top: 0, width: 300, height: 300 }} />
                // <Image source={Ellipse5} style={{ position: "absolute", left: 90, top: 190 }} />
                // <Image source={Ellipse6} style={{ position: "absolute", left: 200, top: 300 }} /> */}
                <View
                    style={styles.NutrigenView}
                >
                    <Text
                        style={{ color: 'white', textAlign: 'center', fontSize: 20, fontFamily: 'Poppins-ExtraBold', }}
                    >
                        Noctune
                    </Text>
                </View>
            </View>
            <View
                style={styles.Info}
            >
                <View
                    style={styles.TextView}
                >
                    <Text
                        style={styles.text}
                    >
                        UNLOCK
                    </Text>
                    <Text
                        style={styles.text}
                    >
                        THE TRUTH </Text>
                    <Text
                        style={styles.text}
                    >
                        BEHIND EVERY </Text>
                    <Text
                        style={styles.text}
                    >
                        BITE</Text>

                </View>
                <View
                    style={styles.aboutView}
                >
                    <Text
                        style={styles.about}
                    >
                        Discover what’s really inside your food. Our app
                    </Text>
                    <Text
                        style={styles.about}
                    >
                        scans barcodes, deciphers ingredients, and alerts
                    </Text>
                    <Text
                        style={styles.about}
                    >
                        you to potential health risks. Stay informed, make
                    </Text>
                    <Text
                        style={styles.about}
                    >
                        smarter choices, and take control of your well -
                    </Text>
                    <Text
                        style={styles.about}
                    >
                        being — one scan at a time.
                    </Text>

                </View>

                <TouchableHighlight
                    onPress={() => handleHome()}
                    style={styles.getStarted}
                >

                    <LinearGradient
                        colors={['#944EE0', '#CD6AAB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.getStartedView}
                    >
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 17, marginRight: 10, fontFamily: 'Poppins-Bold', paddingTop: 5 }}>Get Started</Text>
                        {/* <Image source={send} /> */}
                    </LinearGradient>
                </TouchableHighlight>

                <Image source={vector1} style={styles.vector} />
            </View>

        </View>
    )
}

export default GetStarted