import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import BackArrow from '../Components/Icons/BackArrow';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { showToast } from '../../Store/ToastSlice';
const InviteCollab = () => {
    // Sample friends data
    const [friends, setFriends] = useState([
        { id: '1', name: 'John Doe', selected: false },
        { id: '2', name: 'Jane Smith', selected: false },
        { id: '3', name: 'Mike Johnson', selected: false },
        { id: '4', name: 'Sarah Wilson', selected: false },
        { id: '5', name: 'David Brown', selected: false },
        { id: '6', name: 'Emily Davis', selected: false },
        { id: '7', name: 'Chris Miller', selected: false },
        { id: '8', name: 'Lisa Garcia', selected: false },
        { id: '9', name: 'Kevin Anderson', selected: false },
        { id: '10', name: 'Amanda Taylor', selected: false },
    ]);

    const navigation = useNavigation();
    const dispatch = useDispatch()
    const toggleFriendSelection = (id) => {
        setFriends(prevFriends =>
            prevFriends.map(friend =>
                friend.id === id ? { ...friend, selected: !friend.selected } : friend
            )
        );
    };

    const handleDone = () => {
        const selectedFriends = friends.filter(friend => friend.selected);
        dispatch(showToast('Hello from Redux toast!'))
        // Handle the done action here
    };

    const renderFriendCard = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.friendCard,
                item.selected && styles.selectedCard
            ]}
            onPress={() => toggleFriendSelection(item.id)}
        >
            <View style={styles.friendProfile}>
                <View style={styles.profileIconContainer}>
                    <Svg height="24" viewBox="0 -960 960 960" width="24" fill="#e3e3e3">
                        <Path d="M480-660q-29 0-49.5-20.5T410-730q0-29 20.5-49.5T480-800q29 0 49.5 20.5T550-730q0 29-20.5 49.5T480-660Zm-80 500v-200h-40v-180q0-33 23.5-56.5T440-620h80q33 0 56.5 23.5T600-540v180h-40v200H400Z" />
                    </Svg>
                </View>
                <Text style={styles.friendName}>{item.name}</Text>
            </View>
            <View style={[
                styles.selectionCircle,
                item.selected && styles.selectedCircle
            ]}>
                {item.selected && <View style={styles.selectedDot} />}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={styles.header}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: "10%", justifyContent: "flex-end", }}>
                    <BackArrow />
                </TouchableOpacity>

                <View
                    style={{ justifyContent: "flex-start", height: 70, alignItems: "center", justifyContent: "flex-start", flexDirection: "row", width: "70%" }}
                >
                    <Text style={styles.heading}>Invite Friends</Text>
                </View>
            </View>

            <View style={styles.friendsContainer}>
                <FlatList
                    data={friends}
                    renderItem={renderFriendCard}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.flatListContent}
                />
            </View>

            <TouchableOpacity
                style={styles.doneButton}
                onPress={handleDone}
            >
                <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141414',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    header: {
        width: "100%",
        height: 70,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        //marginTop: 20,
        //marginBottom: 30,
    },
    friendsContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    flatListContent: {
        paddingBottom: 20,
    },
    friendCard: {
        width: '100%',
        height: 70,
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    selectedCard: {
        backgroundColor: '#3A3A3A',
        borderColor: '#4A4A4A',
    },
    friendProfile: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3A3A3A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    friendName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    selectionCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#666666',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedCircle: {
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
    },
    selectedDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#141414',
    },
    doneButton: {
        backgroundColor: '#F5DEB3', // Wheat color
        marginHorizontal: 16,
        marginBottom: 20,
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    doneButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#141414',
    },
});

export default InviteCollab;