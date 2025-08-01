import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useSelector } from 'react-redux';
import { ImageBackground } from 'react-native';
import ChevronForward from "../Components/Icons/ChevronForward";


const Lyrics = ({ lyrics, loading, onFetchFullLyrics }) => {
  const [showFullLyrics, setShowFullLyrics] = useState(false);  //whether modal is open
  const [fullLyrics, setFullLyrics] = useState('');
  const [loadingFull, setLoadingFull] = useState(false);

  const { data, pos,canLoad} =
    useSelector((state) => state.data);
  const currentTrack = canLoad ? data && pos >= 0 && pos < data.length ? data[pos] : null : newLoad? song && position >= 0 && position < song.length ? song[position] : null :
      !canLoad? data && pos >= 0 && pos < data.length ? data[pos] : null : song && position >= 0 && position < song.length ? song[position] : null

  const handleShowFullLyrics = async () => {
    if (fullLyrics) {
      // If full lyrics already exist (from Redux), show them directly
      setShowFullLyrics(true);
    } else {
      // Make API call to fetch full lyrics
      setLoadingFull(true);
      try {
        const fetchedLyrics = await onFetchFullLyrics();
        setFullLyrics(fetchedLyrics);
        
      } catch (error) {
        console.error('Error fetching full lyrics:', error);
        setShowFullLyrics(true);
      } finally {
        setLoadingFull(false);
      }
    }
  };


  return (
    <>
      <View style={styles.box}>
        <ScrollView style={{ maxHeight: 300 }}>
          <Text style = {{fontSize: 25, paddingBottom: 10 }}>Lyrics Preview</Text>
          <Text style={styles.lyricsText}>{lyrics}</Text>
        </ScrollView>
    
         <TouchableOpacity 
          style={[styles.showMoreButton, loadingFull && styles.buttonDisabled]} 
          onPress={handleShowFullLyrics}
          disabled={loadingFull}
          activeOpacity={0.8}
        >
         
          <View style={{flexDirection: "row"}}>
            <Text style={styles.buttonText}>See Full Lyrics </Text>
            <ChevronForward width={28} height={28} />
          </View>
          
        </TouchableOpacity>
      </View>
     
      <Modal
        visible={showFullLyrics}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.modalContainer}>

          <StatusBar barStyle="dark-content" />
          <ImageBackground
                source={{uri: currentTrack?.image}}
                style={StyleSheet.absoluteFill}
                imageStyle={styles.imageStyle}
                blurRadius={50} 
              >
          </ImageBackground>
          
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={
                 [styles.button,
                  {
                    transform: [{ rotate: "90deg" }],
                    justifyContent: "center",
                    alignItems: "center",
                  }
                 ]
                }
              onPress={() => setShowFullLyrics(false)}
            >
              <ChevronForward width={28} height={28} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Lyrics</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView 
            style={styles.fullLyricsContainer}
            contentContainerStyle={styles.fullLyricsContent}
          >
            <Text style={styles.fullLyricsText}>
              {fullLyrics || lyrics}
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#f3f3f3',
    padding: 16,
    paddingTop: 25,
    borderRadius: 12,
    marginTop: 16,
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  lyricsText: {
    fontSize: 18,
    lineHeight: 25,
    color: 'black',
  },
  showMoreButton: {
    backgroundColor: 'gray',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: 'white',
  },
  headerSpacer: {
    width: 32,
  },
  fullLyricsContainer: {
    flex: 1,
  },
  fullLyricsContent: {
    padding: 20,
    paddingBottom: 40,
  },
  fullLyricsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
  },
  imageStyle: {
    resizeMode: "cover",
    transform: [{ scale: 1.5 }],
  },
});

export default Lyrics;