import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const QuickPickCard = ({ title, bgColor }) => (
  <TouchableOpacity style={[styles.quickPickCard, { backgroundColor: bgColor }]}>
    <Text style={styles.quickPickTitle} numberOfLines={2}>{title}</Text>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Quick Picks</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickPicksContainer}
          >
            <QuickPickCard
              title="Chill Hits"
              bgColor="#FF6B6B"
            />
            <QuickPickCard
              title="Deep Focus"
              bgColor="#4ECDC4"
            />
            <QuickPickCard
              title="Workout Mix"
              bgColor="#45B7D1"
            />
            <QuickPickCard
              title="Summer Vibes"
              bgColor="#FF8C42"
            />
          </ScrollView>
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="white" />
          <Text style={styles.navItemText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="search" size={24} color="white" />
          <Text style={styles.navItemText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="library" size={24} color="white" />
          <Text style={styles.navItemText}>Library</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
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
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  quickPicksContainer: {
    paddingHorizontal: 15,
    gap: 10,
  },
  quickPickCard: {
    width: 150,
    height: 150,
    borderRadius: 10,
    justifyContent: 'flex-end',
    padding: 10,
  },
  quickPickTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  recommendationsContainer: {
    paddingHorizontal: 15,
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