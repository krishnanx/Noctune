
// import React, { useRef, useEffect, useState } from "react";
// import { Text, Animated, StatusBar } from "react-native";
// import { StyleSheet, View } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import MaskedView from "@react-native-masked-view/masked-view";
// import { connect, useSelector } from "react-redux";
// import * as Device from "expo-device";
// import { setClientID, setLoading, setWebsocket } from "../../Store/UserSlice"
// import { useDispatch } from "react-redux";
// import { initWebSocket, getWebSocket } from '../Websocket/websocketfunc';
// import { pullPlaylists } from "../../Store/PlaylistSlice";
// import { loadUser } from "../../Store/AuthThunk";
// import Constants from "expo-constants";

// const WaveformLoader = () => {

//   const NUMBER_OF_BARS = 20;
//   const animations = useRef(
//     [...Array(NUMBER_OF_BARS)].map(() => new Animated.Value(20))
//   ).current;

//   useEffect(() => {
//     animations.forEach((anim, i) => {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(anim, {
//             toValue: 60,
//             duration: 1000,
//             delay: i * 100,
//             useNativeDriver: false,
//           }),
//           Animated.timing(anim, {
//             toValue: 20,
//             duration: 400,
//             useNativeDriver: false,
//           }),
//         ])
//       ).start();
//     });
//   }, []);

//   const styles = StyleSheet.create({
//     container: {
//       flexDirection: "row",
//       alignItems: "flex-end",
//       justifyContent: "center",
//       height: 100,
//       paddingHorizontal: 10,
//     },
//     bar: {
//       width: 6,
//       marginHorizontal: 3,
//       borderRadius: 3,
//       backgroundColor: "transparent", // no solid color
//     },
//   });

//   return (
//     <View
//       style={[
//         styles.container,
//         { transform: [{ rotate: "180deg" }, { scaleX: -1 }] },
//       ]}
//     >
//       {animations.map((anim, index) => (
//         <MaskedView
//           key={index}
//           maskElement={
//             <Animated.View
//               style={[
//                 styles.bar,
//                 {
//                   height: anim,
//                   backgroundColor: "black", // mask color (any solid)
//                 },
//               ]}
//             />
//           }
//         >
//           <LinearGradient
//             colors={["purple", "beige", "wheat"]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 0, y: 1 }}
//             style={{
//               height: 100,
//               width: 6,
//               marginHorizontal: 3,
//               borderRadius: 3,
//             }}
//           />
//         </MaskedView>
//       ))}
//     </View>
//   );
// };

// const musicQuotes = [
//     "When words fail, music finds you...",
//     "Music is the soundtrack of your life.",
//     "In every note, there's a story waiting to be told.",
//     "Let the rhythm guide your soul tonight.",
//     "Music washes away from the soul the dust of everyday life.",
//     "Where words leave off, music begins.",
//     "Life is like a beautiful melody, only the lyrics are messed up.",
//     "Without music, life would be a mistake.",
//     "Music is the strongest form of magic.",
//     "Every song has a memory, every melody a moment.",
//     "Turn up the music, turn down the noise.",
//   ];


// // const TypewriterText = ({ style }) => {
// //   const [displayText, setDisplayText] = useState("");
// //   const [showCursor, setShowCursor] = useState(true);
// //   const [quoteIndex, setQuoteIndex] = useState(0);
// //   const [charIndex, setCharIndex] = useState(0);
// //   const [isDeleting, setIsDeleting] = useState(false);


// //   useEffect(() => {
// //     // Cursor blink effect
// //     const cursorInterval = setInterval(() => {
// //       setShowCursor((prev) => !prev);
// //     }, 50);                                                   
// //     return () => clearInterval(cursorInterval);
// //   }, []);

// //   useEffect(() => {
// //     const currentQuote = musicQuotes[quoteIndex];
// //     let timeout;

// //    if (!isDeleting && charIndex <= currentQuote.length) {
// //   // typing
// //   setDisplayText(currentQuote.substring(0, charIndex));
// //   timeout = setTimeout(() => setCharIndex(prev => prev + 1), 10);
// // } else {
// //   // after typing ,next quote
// //   setQuoteIndex(prev => (prev + 1) % musicQuotes.length);
// //   setCharIndex(0);
// //   timeout = setTimeout(() => {}, 200);
// // }

// //     return () => clearTimeout(timeout);
// //   }, [charIndex, isDeleting, quoteIndex]);

// //   return (
// //     <Text style={style}>
// //       {displayText}
// //       {showCursor && "_"}
// //     </Text>
// //   );
// // };
// // const TypewriterText = ({ quotes, style }) => {
// //   const [displayText, setDisplayText] = useState('');
// //   const [showCursor, setShowCursor] = useState(true);
// //   const quoteIndexRef = useRef(0);
// //   const charIndexRef = useRef(0);
// //   const typingRef = useRef(true); // typing or deleting
// //   const timeoutRef = useRef(null);
// //   const blinkIntervalRef = useRef(null);

// //   useEffect(() => {
// //     if (!quotes || quotes.length === 0) return;

// //     const type = () => {
// //       const currentQuote = quotes[quoteIndexRef.current];

// //       if (typingRef.current) {
// //         // Typing
// //         if (charIndexRef.current < currentQuote.length) {
// //           setDisplayText(prev => prev + currentQuote[charIndexRef.current]);
// //           charIndexRef.current += 1;
// //           timeoutRef.current = setTimeout(type, 80);
// //         } else {
// //           // Done typing, wait before deleting
// //           typingRef.current = false;
// //           timeoutRef.current = setTimeout(type, 1500);
// //         }
// //       } else {
// //         // Deleting
// //         if (charIndexRef.current > 0) {
// //           setDisplayText(prev => prev.slice(0, -1));
// //           charIndexRef.current -= 1;
// //           timeoutRef.current = setTimeout(type, 40);
// //         } else {
// //           // Move to next quote
// //           quoteIndexRef.current = Math.floor(Math.random() * quotes.length);
// //           typingRef.current = true;
// //           timeoutRef.current = setTimeout(type, 500);
// //         }
// //       }
// //     };

// //     timeoutRef.current = setTimeout(type, 1000);

// //     // Cursor blinking
// //     blinkIntervalRef.current = setInterval(() => {
// //       setShowCursor(prev => !prev);
// //     }, 500);

// //     return () => {
// //       clearTimeout(timeoutRef.current);
// //       clearInterval(blinkIntervalRef.current);
// //     };
// //   }, [quotes]);

// //   return (
// //     <Text style={style}>
// //       {displayText}
// //       <Text style={{ opacity: showCursor ? 1 : 0 }}>|</Text>
// //     </Text>
// //   );
// // };
// // ALTERNATIVE: Simplified version with better performance
// // const TypewriterText = ({ quotes = musicQuotes, style }) => {
// //   const [text, setText] = useState('');
// //   const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
// //   const [currentCharIndex, setCurrentCharIndex] = useState(0);
// //   const [isDeleting, setIsDeleting] = useState(false);
// //   const [showCursor, setShowCursor] = useState(true);

// //   useEffect(() => {
// //     const currentQuote = quotes[currentQuoteIndex];
// //     let timeout;

// //     if (!isDeleting && currentCharIndex < currentQuote.length) {
// //       // Typing
// //       timeout = setTimeout(() => {
// //         setText(currentQuote.substring(0, currentCharIndex + 1));
// //         setCurrentCharIndex(prev => prev + 1);
// //       }, 100);
// //     } else if (!isDeleting && currentCharIndex === currentQuote.length) {
// //       // Finished typing, start deleting after pause
// //       timeout = setTimeout(() => setIsDeleting(true), 2000);
// //     } else if (isDeleting && currentCharIndex > 0) {
// //       // Deleting
// //       timeout = setTimeout(() => {
// //         setText(currentQuote.substring(0, currentCharIndex - 1));
// //         setCurrentCharIndex(prev => prev - 1);
// //       }, 50);
// //     } else if (isDeleting && currentCharIndex === 0) {
// //       // Move to next quote
// //       setIsDeleting(false);
// //       setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
// //       timeout = setTimeout(() => {}, 300);
// //     }

// //     return () => clearTimeout(timeout);
// //   }, [currentCharIndex, isDeleting, currentQuoteIndex, quotes]);

// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       setShowCursor(prev => !prev);
// //     }, 500);
// //     return () => clearInterval(interval);
// //   }, []);

// //   return (
// //     <Text style={style}>
// //       {text}
// //       <Text style={{ opacity: showCursor ? 1 : 0 }}>|</Text>
// //     </Text>
// //   );
// // };


// const TypewriterText = ({ quotes = musicQuotes, style }) => {
//   const [displayText, setDisplayText] = useState('');
//   const [showCursor, setShowCursor] = useState(true);
//   const quoteIndexRef = useRef(0);
//   const charIndexRef = useRef(0);
//   const isTypingRef = useRef(true); // true = typing, false = deleting
//   const timeoutRef = useRef(null);
//   const blinkIntervalRef = useRef(null);

//   useEffect(() => {
//     if (!quotes || quotes.length === 0) return;

//     const typeEffect = () => {
//       const currentQuote = quotes[quoteIndexRef.current];

//       if (isTypingRef.current) {
//         // TYPING PHASE
//         if (charIndexRef.current < currentQuote.length) {
//           setDisplayText(currentQuote.substring(0, charIndexRef.current + 1));
//           charIndexRef.current += 1;
//           timeoutRef.current = setTimeout(typeEffect, 100); // Consistent typing speed
//         } else {
//           // Done typing, pause before deleting
//           isTypingRef.current = false;
//           timeoutRef.current = setTimeout(typeEffect, 2000); // Pause to read
//         }
//       } else {
//         // DELETING PHASE
//         if (charIndexRef.current > 0) {
//           setDisplayText(currentQuote.substring(0, charIndexRef.current - 1));
//           charIndexRef.current -= 1;
//           timeoutRef.current = setTimeout(typeEffect, 50); // Faster deleting
//         } else {
//           // Move to next quote
//           quoteIndexRef.current = (quoteIndexRef.current + 1) % quotes.length;
//           isTypingRef.current = true;
//           timeoutRef.current = setTimeout(typeEffect, 500); // Pause before next quote
//         }
//       }
//     };

//     // Start the animation
//     timeoutRef.current = setTimeout(typeEffect, 1000);

//     // Cursor blinking
//     blinkIntervalRef.current = setInterval(() => {
//       setShowCursor(prev => !prev);
//     }, 500);

//     return () => {
//       clearTimeout(timeoutRef.current);
//       clearInterval(blinkIntervalRef.current);
//     };
//   }, [quotes]);

//   return (
//     <Text style={style}>
//       {displayText}
//       <Text style={{ opacity: showCursor ? 1 : 0 }}>|</Text>
//     </Text>
//   );
// };





//  const Waveform = () => {
//   const { Mode } = useSelector((state) => state.theme)
//   const { user } = useSelector((state) => state.user)
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const [deviceName, setDeviceName] = useState(null);
//   const hasConnected = useRef(false);
//   const dispatch = useDispatch();


//   useEffect(() => {
//     const fetchDeviceName = async () => {
//       try {
//         const name =
//           Device.getDeviceNameAsync && typeof Device.getDeviceNameAsync === "function"
//             ? await Device.getDeviceNameAsync()
//             : null;
//         setDeviceName(
//           name || `${Device.manufacturer ?? "Unknown"} ${Device.modelName ?? "Device"}`
//         );

//       } catch (err) {
//         console.error("Error fetching device name:", err);
//         setDeviceName(`${Device.manufacturer ?? "Unknown"} ${Device.modelName ?? "Device"}`);
//       }
//     };
//     fetchDeviceName();
//   }, []);
//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 3000,
//       useNativeDriver: true,
//     }).start();
//   }, []);
//   useEffect(() => {
//     if (!deviceName || hasConnected.current) return;

//     hasConnected.current = true;

//     const runAsyncLogic = async () => {
//       const id = Math.random().toString(36).slice(2, 8);

//       try {
//         const loadedUser = await dispatch(loadUser()).unwrap(); // Await loadUser thunk
//         console.warn("data:", loadedUser);

//         //await dispatch(pullPlaylists({ user: loadedUser.id })).unwrap();
//         // 192.168.85.33 K
//         // 192.168.1.44 krish
//         initWebSocket("ws://192.168.1.106:80/download-progress");
//         const ws = getWebSocket();

//         ws.onopen = () => {
//           console.error("Connected to WebSocket server");
//           dispatch(setClientID({ id }));

//           ws.send(JSON.stringify({
//             type: "register",
//             clientId: id,
//             value: "hi"
//           }));

//           dispatch(setLoading(false));

//         };
//       } catch (error) {
//         console.error("Failed to load user:", error);
//       }
//     };

//     runAsyncLogic();
//   }, [deviceName]);



//   return (
//     <Animated.View style={{ opacity: fadeAnim }}>
//       <StatusBar
//         barStyle={Mode === "light" ? "dark-content" : "light-content"}
//         backgroundColor={Mode === "light" ? "#ffffff" : "#141414"}
//         translucent={false}
//       />
//       <MaskedView
//         maskElement={
//           <Text
//             style={{
//               fontSize: 50,
//               fontWeight: "bold",
//               textAlign: "center",
//               color: "black", // This color won't show; it's just for masking
//             }}
//           >
//             𝙉𝙤𝙘𝙩𝙪𝙣𝙚
//           </Text>
//         }
//       >
//         <LinearGradient
//           colors={["wheat", "white", "purple"]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={{
//             height: 60, // make sure it's tall enough to fully cover the text
//             alignItems: "center",
//             marginBottom: 30,
//           }}
//         />
//       </MaskedView>
//       <Text
//         style={{
//           color: "wheat",
//           paddingHorizontal: 20,
//           fontSize: 28,
//           textAlign: "center",
//         }}
//       >
//         𝙂𝙚𝙩𝙩𝙞𝙣𝙜 𝙇𝙤𝙨𝙩 𝙞𝙣 𝙀𝙫𝙚𝙧𝙮 𝙉𝙤𝙩𝙚
//       </Text>
//       <Text
//         style={{ textAlign: "center", alignItems: "center", paddingTop: 160 }}
//       >
//         <WaveformLoader />
//       </Text>
//       {/* <Text
//         style={{
//           color: "beige",
//           padding: 20,
//           fontSize: 18,
//           textAlign: "center",
//         }}
//       >
//         "𝚆𝚑𝚎𝚗 𝚠𝚘𝚛𝚍𝚜 𝚏𝚊𝚒𝚕, 𝚖𝚞𝚜𝚒𝚌 𝚏𝚒𝚗𝚍𝚜 𝚢𝚘𝚞... "
//       </Text> */}

//       {/* Typewriter Quote Component */}
//       <TypewriterText 
//         quotes={musicQuotes}
//         style={{
//           color: "wheat",
//           padding: 20,
//           fontSize: 10,
//           textAlign: "center",
//           fontFamily: "monospace", // Optional: gives it a typewriter feel
//           minHeight: 60, // Prevents layout shifting
//         }}
//       />
//     </Animated.View>
//   );
// };

// export default Waveform;

//-----------------------------------------------------------------------------------------------------------------
// import React, { useRef, useEffect, useState } from "react";

import React, { useRef, useEffect, useState, use } from "react";

import { Text, Animated, StatusBar } from "react-native";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { connect, useSelector } from "react-redux";
import * as Device from "expo-device";
import { setClientID, setLoading, setWebsocket, setwaveLoad } from "../../Store/UserSlice"
import { useDispatch } from "react-redux";
import { initWebSocket, getWebSocket } from '../Websocket/websocketfunc';
import { pullPlaylists } from "../../Store/PlaylistSlice";
import { loadUser } from "../../Store/AuthThunk";
import Constants from "expo-constants";
import NetInfo, { addEventListener } from "@react-native-community/netinfo";
import { connection, checked, type } from "../../Store/NetworkSlice";


const WaveformLoader = () => {

  const NUMBER_OF_BARS = 20;
  const animations = useRef(
    [...Array(NUMBER_OF_BARS)].map(() => new Animated.Value(20))
  ).current;

  useEffect(() => {
    animations.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 60,
            duration: 1000,
            delay: i * 100,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 20,
            duration: 400,
            useNativeDriver: false,
          }),
        ])
      ).start();
    });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "center",
      height: 100,
      paddingHorizontal: 10,
    },
    bar: {
      width: 6,
      marginHorizontal: 3,
      borderRadius: 3,
      backgroundColor: "transparent", // no solid color
    },
  });

  return (
    <View
      style={[
        styles.container,
        { transform: [{ rotate: "180deg" }, { scaleX: -1 }] },
      ]}
    >
      {animations.map((anim, index) => (
        <MaskedView
          key={index}
          maskElement={
            <Animated.View
              style={[
                styles.bar,
                {
                  height: anim,
                  backgroundColor: "black", // mask color (any solid)
                },
              ]}
            />
          }
        >
          <LinearGradient
            colors={["purple", "beige", "wheat"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              height: 100,
              width: 6,
              marginHorizontal: 3,
              borderRadius: 3,
            }}
          />
        </MaskedView>
      ))}
    </View>
  );
};
const Waveform = () => {
  const { Mode } = useSelector((state) => state.theme)

  //const { user } = useSelector((state) => state.user)



  const { user } = useSelector((state) => state.user)
  const { isConnected, nettype, hasChecked } = useDispatch((state) => state.network)

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [deviceName, setDeviceName] = useState(null);
  const hasConnected = useRef(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchDeviceName = async () => {
      try {
        const name =
          Device.getDeviceNameAsync && typeof Device.getDeviceNameAsync === "function"
            ? await Device.getDeviceNameAsync()
            : null;
        setDeviceName(
          name || `${Device.manufacturer ?? "Unknown"} ${Device.modelName ?? "Device"}`
        );

      } catch (err) {
        console.error("Error fetching device name:", err);
        setDeviceName(`${Device.manufacturer ?? "Unknown"} ${Device.modelName ?? "Device"}`);
      }
    };
    fetchDeviceName();
  }, []);
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (!deviceName || hasConnected.current) return;
    console.warn("hey")
    hasConnected.current = true;

    NetInfo.fetch().then(state => {
      console.log("Is connected?", state.isConnected);
      console.log("Connection type:", state.type);
      if (state.isConnected) {
        const runAsyncLogic = async () => {
          const id = Math.random().toString(36).slice(2, 8);
          console.error("HI")
          try {
            const loadedUser = await dispatch(loadUser()).unwrap(); // Await loadUser thunk
            console.warn("data:", loadedUser === null);
            let ws;
            loadedUser === null ? null : await dispatch(pullPlaylists({ user: loadedUser.id })).unwrap()
            // 192.168.85.33 K
            // 192.168.1.44 krish
            console.error("loader user over")
            console.error(isConnected)

            console.error("reached websocket connection")
            initWebSocket(`${Constants.expoConfig.extra.WEBSOC}/download-progress`)
            ws = getWebSocket();

            ws.onopen = () => {
              console.error("Connected to WebSocket server");
              dispatch(setClientID({ id }));


              ws.send(JSON.stringify({
                type: "register",
                clientId: id,
                value: "hi"

              }));
              dispatch(setwaveLoad(false));
            };
          } catch (error) {
            console.error("Failed to load user:", error);
          }

        }
        runAsyncLogic();
      } else {
        // Show no internet UI or alert
        dispatch(setwaveLoad(false));

      }
    });
  }, [deviceName]);



  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <StatusBar
        barStyle={Mode === "light" ? "dark-content" : "light-content"}
        backgroundColor={Mode === "light" ? "#ffffff" : "#141414"}
        translucent={false}
      />
      <MaskedView
        maskElement={
          <Text
            style={{
              fontSize: 50,
              fontWeight: "bold",
              textAlign: "center",
              color: "black", // This color won't show; it's just for masking
            }}
          >
            𝙉𝙤𝙘𝙩𝙪𝙣𝙚
          </Text>
        }
      >
        <LinearGradient
          colors={["wheat", "white", "purple"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: 60, // make sure it's tall enough to fully cover the text
            alignItems: "center",
            marginBottom: 30,
          }}
        />
      </MaskedView>
      <Text
        style={{
          color: "wheat",
          paddingHorizontal: 20,
          fontSize: 28,
          textAlign: "center",
        }}
      >
        𝙂𝙚𝙩𝙩𝙞𝙣𝙜 𝙇𝙤𝙨𝙩 𝙞𝙣 𝙀𝙫𝙚𝙧𝙮 𝙉𝙤𝙩𝙚
      </Text>
      <Text
        style={{ textAlign: "center", alignItems: "center", paddingTop: 160 }}
      >
        <WaveformLoader />
      </Text>
      <Text
        style={{
          color: "beige",
          padding: 20,
          fontSize: 18,
          textAlign: "center",
        }}
      >
        "𝚆𝚑𝚎𝚗 𝚠𝚘𝚛𝚍𝚜 𝚏𝚊𝚒𝚕, 𝚖𝚞𝚜𝚒𝚌 𝚏𝚒𝚗𝚍𝚜 𝚢𝚘𝚞... "
      </Text>
    </Animated.View>
  );
};

export default Waveform;
