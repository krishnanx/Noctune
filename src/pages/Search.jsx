import React from 'react'
import { View, StyleSheet } from "react-native"
import { useTheme } from '@react-navigation/native';

const Search = () => {
    const { colors } = useTheme(); // Get theme colors
    const styles = StyleSheet.create({
        Main: {
            backgroundColor: colors.background,
            width: "100%",
            height: 100
        }
    })
    return (
        <View
            style={styles.Main}
        >

        </View>
    )
}

export default Search