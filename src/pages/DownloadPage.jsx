import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    Image,
    StatusBar,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackArrow from '../Components/BackArrow';
import { useDispatch, useSelector } from 'react-redux';
import { setCompleted } from '../../Store/DownloadSlice';

const DownloadPage = () => {
    // Static data for the download items
    const dispatch = useDispatch()
    const { songs, status, completed } = useSelector((state) => state.download)
    useEffect(() => {
        if (completed == songs.length) {
            dispatch(setCompleted(0))
        }
    }, [completed])


    const renderDownloadItem = (item) => {
        return (
            <View key={item.id} style={styles.downloadItem}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.albumArt}
                />
                <View style={styles.songInfo}>
                    <Text style={styles.songTitle}>{item.title}</Text>
                    <Text style={styles.artistName}>{item.uploader}</Text>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBarBackground}>
                            <View
                                style={[
                                    styles.progressBarFill,
                                    { width: `${item.progress}%` },
                                    item.completed ? styles.progressBarCompleted : null
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {item.completed ? 'Completed' : `${item.progress}%`}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                    {item.completed ? (
                        <Text style={styles.playIcon}>▶</Text>
                    ) : (
                        <Text style={styles.pauseIcon}>⏸</Text>
                    )}
                </TouchableOpacity>
            </View>
        );
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
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton}>
                            <BackArrow />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Downloads</Text>
                        <View style={styles.headerRight} />
                    </View>

                    <View style={styles.downloadStats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{songs.length}</Text>
                            <Text style={styles.statLabel}>Songs</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{completed}</Text>
                            <Text style={styles.statLabel}>Complete</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{songs.length - completed}</Text>
                            <Text style={styles.statLabel}>In Progress</Text>
                        </View>
                    </View>

                    <ScrollView style={styles.downloadsList}>
                        {songs.map(item => renderDownloadItem(item))}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.pauseAllButton}>
                            <Text style={styles.pauseAllText}>Pause All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelAllButton}>
                            <Text style={styles.cancelAllText}>Cancel All</Text>
                        </TouchableOpacity>
                    </View>
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
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        color: '#ffffff',
        fontSize: 24,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerRight: {
        width: 40,
    },
    downloadStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        color: '#1DB954',
        fontSize: 22,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#8b9da5',
        fontSize: 12,
        marginTop: 4,
    },
    downloadsList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    downloadItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    albumArt: {
        width: 56,
        height: 56,
        borderRadius: 8,
        backgroundColor: '#2a2a2a',
    },
    songInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    songTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
    },
    artistName: {
        color: '#8b9da5',
        fontSize: 14,
        marginTop: 2,
        marginBottom: 8,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBarBackground: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#1DB954',
        borderRadius: 2,
    },
    progressBarCompleted: {
        backgroundColor: '#1DB954',
    },
    progressText: {
        color: '#8b9da5',
        fontSize: 12,
        marginLeft: 8,
        width: 70,
        textAlign: 'right',
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    playIcon: {
        color: '#1DB954',
        fontSize: 14,
    },
    pauseIcon: {
        color: '#ffffff',
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    pauseAllButton: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 24,
        alignItems: 'center',
        marginRight: 8,
    },
    pauseAllText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
    },
    cancelAllButton: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 24,
        alignItems: 'center',
        marginLeft: 8,
    },
    cancelAllText: {
        color: '#ff5252',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default DownloadPage;