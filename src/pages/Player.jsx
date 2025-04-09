import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SkipBack, SkipForward } from "react-native-feather";

const Player = () => {
  const { colors } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const styles = StyleSheet.create({
    Main: {
      backgroundColor: colors.background,
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 80,
      height: "100%",
    },
    text: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 50,
    },
    controlsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 30,
    },
    playPauseButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: "transparent",
      borderStyle: "solid",
      borderLeftWidth: 18,
      borderRightWidth: 0,
      borderBottomWidth: 12,
      borderTopWidth: 12,
      borderLeftColor: "black",
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
      borderRightColor: "transparent",
      marginLeft: 4,
    },
    pauseLinesContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    pauseLine: {
      width: 4,
      height: 20,
      backgroundColor: "black",
      marginHorizontal: 4,
      borderRadius: 2,
    },
    skipButton: {
      marginHorizontal: 20,
    },
  });

  return (
    <View style={styles.Main}>
      <Text style={styles.text}>This is the Player Screen</Text>

      <View style={styles.controlsContainer}>
        {/* Skip Back */}
        <TouchableOpacity style={styles.skipButton}>
          <SkipBack width={40} height={40} stroke={colors.text} />
        </TouchableOpacity>

        {/* Play/Pause Button */}
        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={togglePlayPause}
        >
          {isPlaying ? (
            <View style={styles.pauseLinesContainer}>
              <View style={styles.pauseLine} />
              <View style={styles.pauseLine} />
            </View>
          ) : (
            <View style={styles.triangle} />
          )}
        </TouchableOpacity>

        {/* Skip Forward */}
        <TouchableOpacity style={styles.skipButton}>
          <SkipForward width={40} height={40} stroke={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Player;

// import React from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { useTheme } from "@react-navigation/native";

// const Player = () => {
//     const { colors } = useTheme(); // Get theme colors
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>This is the Player Screen </Text>
//     </View>
//   );
// };

//  const styles = StyleSheet.create({
//     Main: {
//       backgroundColor: colors.background,
//       width: "100%",

//       alignItems: "center",
//       height: "100%",
//     },
//     input: {
//       width: "70%",
//       height: 40,
//       borderWidth: 1,
//       borderColor: "white",
//       padding: 10,
//       borderRadius: 20,
//     },
//     InputView: {
//       width: "100%",
//       //backgroundColor: "pink",
//       justifyContent: "center",
//       alignItems: "center",
//       height: "15%",
//     },
//   });

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#fff",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   text: {
// //     fontSize: 24,
// //     fontWeight: "bold",
// //   },
// //});

// export default Player;

// // import React from "react";
// // import { View, Text } from "react-native";

// // const Player = () => {
// //   return (
// //     <View>

// //     </View>
// //   )
// // };

// // export default Player;
