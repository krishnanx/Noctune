import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { migrate } from '../../Store/PlaylistSlice';

const MigratePlaylist = () => {
    const [playlistUrl, setPlaylistUrl] = useState('');
    const dispatch = useDispatch()
    const handleSubmit = () => {
        if (!playlistUrl.trim()) {
            Alert.alert('Error', 'Please enter a Spotify playlist URL');
            return;
        }

        // Here you would add your actual migration logic
        console.warn('Migrating playlist:', playlistUrl);
        dispatch(migrate({ Url: playlistUrl }))
        Alert.alert('Success', 'Migration process started');
    };

    return (
        <>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#141414', '#1c2c32']}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardAvoid}
                    >
                        <View style={styles.header}>
                            <Text style={styles.smallHeader}>SPOTIFY PLAYLIST</Text>
                            <Text style={styles.mainHeader}>Migrate Playlists</Text>
                            <Text style={styles.mainHeader}>Spotify to the Noctune App</Text>
                        </View>

                        <View style={styles.infoBox}>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>Spotify Playlist</Text>
                                <Text style={styles.infoUrl}>spotifys.coth.noctune.app</Text>
                            </View>
                            <View style={styles.musicIconContainer}>
                                <Text style={styles.musicIcon}>♪</Text>
                            </View>
                        </View>

                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>Migrate</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Spotify Playlist ()"
                                    placeholderTextColor="#8b9da5"
                                    value={playlistUrl}
                                    onChangeText={setPlaylistUrl}
                                />
                                <TouchableOpacity style={styles.copyButton}>
                                    <Text style={styles.copyIcon}>⟳</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.reverseText}>spotify/playlist/URL</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={() => handleSubmit()}
                        >
                            <Text style={styles.submitButtonText}>Migrate Playlist</Text>
                        </TouchableOpacity>

                        <View style={styles.optionsContainer}>
                            <TouchableOpacity style={styles.optionItem}>
                                <View style={styles.optionIconContainer}>
                                    <Image
                                        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1024px-Spotify_icon.svg.png' }}
                                        style={styles.optionIcon}
                                    />
                                </View>
                                <Text style={styles.optionText}>Spotify Playlist</Text>
                                <Text style={styles.arrowIcon}>›</Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity style={styles.optionItem}>
                                <View style={[styles.optionIconContainer, styles.noctuneBg]}>
                                    <Text style={styles.noctuneIcon}>N</Text>
                                </View>
                                <Text style={styles.optionText}>Spotify playlist URL</Text>
                                <Text style={styles.arrowIcon}>›</Text>
                            </TouchableOpacity> */}
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </LinearGradient>
        </>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    keyboardAvoid: {
        flex: 1,
    },
    header: {
        marginTop: 60,
        marginBottom: 24,
    },
    smallHeader: {
        color: '#8b9da5',
        fontSize: 14,
        letterSpacing: 1,
        marginBottom: 8,
        fontWeight: '500',
    },
    mainHeader: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 32,
    },
    infoBox: {
        backgroundColor: '#e3f0d7',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        color: '#2c3a2f',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    infoUrl: {
        color: '#5a7260',
        fontSize: 14,
    },
    musicIconContainer: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    musicIcon: {
        fontSize: 24,
        color: '#2c3a2f',
    },
    inputSection: {
        marginBottom: 24,
    },
    inputLabel: {
        color: '#8b9da5',
        fontSize: 14,
        marginBottom: 8,
    },
    inputContainer: {
        backgroundColor: '#1a2325',
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 48,
        borderWidth: 1,
        borderColor: '#2a3436',
    },
    input: {
        flex: 1,
        color: '#ffffff',
        fontSize: 16,
        height: '100%',
    },
    copyButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    copyIcon: {
        color: '#4caf78',
        fontSize: 18,
    },
    reverseText: {
        color: '#4caf78',
        marginTop: 8,
        fontSize: 14,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#1DB954',  // Spotify green
        borderRadius: 24,
        paddingVertical: 15,
        marginHorizontal: 16,
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    optionsContainer: {
        marginTop: 8,
    },
    optionItem: {
        backgroundColor: '#1a2325',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    optionIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#1db954', // Spotify green
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    noctuneBg: {
        backgroundColor: '#2c6e49', // NocTune green (slightly different)
    },
    optionIcon: {
        width: 20,
        height: 20,
        tintColor: '#ffffff',
    },
    noctuneIcon: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    optionText: {
        color: '#ffffff',
        fontSize: 16,
        flex: 1,
    },
    arrowIcon: {
        color: '#8b9da5',
        fontSize: 20,
    },
});

export default MigratePlaylist;