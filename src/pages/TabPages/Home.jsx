import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const QuickPickCard = ({ title, imageUrl }) => (
  <TouchableOpacity style={styles.quickPickCard}>
    <ImageBackground
      source={{ uri: imageUrl }}
      style={styles.imageBackground}
      imageStyle={styles.imageStyle}
    >
      {/* Dim overlay */}
      <View style={styles.overlay} />
      <Text style={styles.quickPickTitle} numberOfLines={2}>{title}</Text>
    </ImageBackground>
  </TouchableOpacity>
);


const RecommendationCard = ({ title, subtitle, bgColor }) => (
  <TouchableOpacity style={[styles.recommendationCard, { backgroundColor: bgColor }]}>
    <View style={styles.recommendationTextContainer}>
      <Text style={styles.recommendationTitle} numberOfLines={1}>{title}</Text>
      <Text style={styles.recommendationSubtitle} numberOfLines={1}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const Home = () => {
  const {searchedMusicHistory} = useSelector((state)=>state.data)
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Good Evening</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="time-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Quick Picks Section */}
        <View style={[styles.section]}>
          <Text style={styles.sectionTitle}>Your Quick Picks</Text>
          {searchedMusicHistory.length>0 && 
          
          <FlatList
            data={searchedMusicHistory.slice().reverse()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <QuickPickCard title={item.title} imageUrl={item.image} />}
            horizontal={true} // 👈 Make it horizontal
            showsHorizontalScrollIndicator={false}
            style={{ height: 170 }} // 👈 Hide scroll bar (optional)
          /> }
          {searchedMusicHistory.length==0 &&
          <View style={{justifyContent:"center",alignItems:"center",height:"90%"}}>
            <Text style={styles.searchMusicText}>It’s quiet here... Search for something to play!</Text> 
          </View>
          
          
          }
        </View>

        {/* Recommended for You Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendationsContainer}
          >
            <RecommendationCard
              title="Daily Mix 1"
              subtitle="Arctic Monkeys, The Strokes, and more"
              bgColor="#C7493A"
            />
            <RecommendationCard
              title="Indie Hits"
              subtitle="Playlist • 50 songs"
              bgColor="#A64942"
            />
            <RecommendationCard
              title="New Release"
              subtitle="Latest tracks you might like"
              bgColor="#FF6B6B"
            />
          </ScrollView>
        </View>

        {/* Popular Playlists Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Playlists</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendationsContainer}
          >
            <RecommendationCard
              title="Top 50 Global"
              subtitle="Most played tracks worldwide"
              bgColor="#4ECDC4"
            />
            <RecommendationCard
              title="Viral Hits"
              subtitle="Today's most viral tracks"
              bgColor="#45B7D1"
            />
            <RecommendationCard
              title="Trending Now"
              subtitle="What's hot right now"
              bgColor="#FF8C42"
            />
          </ScrollView>
        </View>
      </ScrollView>

    
    </SafeAreaView>
  );
};
// const DisplaySearchedSongs=({title})=>{
//   <Cus
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    paddingHorizontal:15
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //paddingHorizontal: 15,
    paddingTop: 25,
    paddingBottom: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 15,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  section: {
    marginBottom: 20,
    height:220
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    //paddingHorizontal: 15,
    marginBottom: 10,
  },
  searchMusicText:{
    color: 'wheat',
    fontSize: 16,
    fontWeight: "300",
    //paddingHorizontal: 15,
    marginBottom: 10,
  },
  quickPicksContainer: {
    paddingHorizontal: 15,
    gap: 10,
    
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    //padding: 10,
    justifyContent:"flex-end",
    paddingVertical:5,
    paddingHorizontal:10
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // dim effect
  },
  quickPickCard: {
    width: 185,
    height: 180,
    borderRadius: 10,
    justifyContent: 'flex-end',
    //padding: 10,
    backgroundColor:"white",
    overflow: 'hidden',
    marginRight:10
  },
  quickPickTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  recommendationsContainer: {
    //paddingHorizontal: 15,
    gap: 15,

  },
  recommendationCard: {
    width: 180,
    height: 180,
    borderRadius: 10,
    justifyContent: 'flex-end',
    padding: 15,
  },
  recommendationTextContainer: {
    // Position text at the bottom
  },
  recommendationTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  recommendationSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 5,
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#1E1E1E',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navItem: {
    alignItems: 'center',
  },
  navItemText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
});

export default Home;