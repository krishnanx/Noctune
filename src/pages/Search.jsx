import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, TextInput } from "react-native"
import { useTheme } from '@react-navigation/native';
import { Input } from '@ui-kitten/components';
import { Searchbar } from 'react-native-paper';
import Svg, { Path } from "react-native-svg";
import { Keyboard } from "react-native";
import { useDispatch } from 'react-redux';
import { changeState } from '../../Store/KeyboardSlice';
import { DownloadMusic } from '../../Store/MusicSlice';
const Search = () => {
    const { colors } = useTheme(); // Get theme colors
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        const keybaordDidShow = Keyboard.addListener("keyboardDidShow", () => dispatch(changeState(true)));
        const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () => dispatch(changeState(false)));
        return () => {
            keybaordDidShow.remove();
            keyboardDidHide.remove();
        }
    }, [])
    const styles = StyleSheet.create({
        Main: {
            backgroundColor: colors.background,
            width: "100%",

            alignItems: "center",
            height: "100%"
        },
        input: {
            width: "70%",
            height: 40,
            borderWidth: 1,
            borderColor: "white",
            padding: 10,
            borderRadius: 20,

        },
        InputView: {
            width: "100%",
            //backgroundColor: "pink",
            justifyContent: "center",
            alignItems: "center",
            height: "15%"
        }
    })
    const [text, setText] = useState('');

    return (
        <View
            style={styles.Main}
        >
            {/* <Input
                placeholder='Place your Text'
                value={""}
                onChangeText={nextValue => { }}
            /> */}
            <View
                style={styles.InputView}
            >
                <Searchbar
                    style={{ padding: 0, margin: 0, width: 350 }}
                    onSubmitEditing={() => dispatch(DownloadMusic({ text }))}
                    icon={() => (
                        <View
                            style={{ width: 40, height: 40, backgroundColor: 'black', borderRadius: 0, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Svg width={30} height={30} viewBox="0 -960 960 960">
                                <Path
                                    d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
                                    fill="white"
                                />
                            </Svg>
                        </View>

                    )}
                    onChangeText={setText}
                    value={text}
                />
            </View>
            <Text
                style={{ color: "white" }}
            >

            </Text>
        </View>
    )
}

export default Search