import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,Animated,Easing
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import VerticalSlider from "rn-vertical-slider-matyno";
import { Dial } from 'react-native-dial';
const { AudioEqualizer } = NativeModules;

const MIN_DB = -12;
const MAX_DB = 12;

const EQ_KEY = 'EQ_SETTINGS';
const BASS_KEY = 'BASS_LEVEL';
const TREBLE_KEY = 'TREBLE_LEVEL';
const ENABLED_KEY = 'EQ_ENABLED';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const ANDROID_MB_MIN = -1500;
const ANDROID_MB_MAX = 1500;




function dbToMillibels(db) {
    const clamped = clamp(db, MIN_DB, MAX_DB);
    return Math.round(
    ((clamped - MIN_DB) / (MAX_DB - MIN_DB)) * (ANDROID_MB_MAX - ANDROID_MB_MIN) + ANDROID_MB_MIN
    );
}
export default function EqualizerScreen() {
    const [bandCount, setBandCount] = useState(0);
    const [bands, setBands] = useState([]);
    const [enabled, setEnabled] = useState(true);
    const [bass, setBass] = useState(0);
    const [treble, setTreble] = useState(0);
    const [preamp, setPreamp] = useState(1.0);
    const [activePreset, setActivePreset] = useState('Custom');
    const [FREQUENCIES,setFrequencies] = useState([])
    const [resetCounter, setResetCounter] = useState(0);
    const minAngle = -135;
    const maxAngle = 135;

    const dialRange = maxAngle - minAngle; // 270 deg
  /* ---------------- LOAD SAVED SETTINGS ---------------- */
  useEffect(() => {
    (async () => {
        const savedEQ = await AsyncStorage.getItem(EQ_KEY);
        const savedBass = await AsyncStorage.getItem(BASS_KEY);
        const savedTreble = await AsyncStorage.getItem(TREBLE_KEY);
        const savedEnabled = await AsyncStorage.getItem(ENABLED_KEY);
        const count = await AudioEqualizer.getBandCount();
        const freqs = await AudioEqualizer.getBandFrequencies();
        setBandCount(count);
        setBands(Array(count).fill(0));
        setFrequencies(freqs); // e.g., [60, 230, 910, 3600, 14000]

        console.warn("freq: ",freqs)
        if (savedEnabled !== null) {
            const e = savedEnabled === 'true';
            setEnabled(e);
            AudioEqualizer.setEnabled(e);
        }

        if (savedEQ) {
            const parsed = JSON.parse(savedEQ);
            setBands(parsed);
            parsed.forEach((v, i) => AudioEqualizer.setBandLevel(i, v));
        }

        if (savedBass) {
            const b = Number(savedBass);
            setBass(b);
            AudioEqualizer.setBass(b * 10);
        }

        if (savedTreble) {
            const t = Number(savedTreble);
            setTreble(t);
        }
        })();
    }, []);

  /* ---------------- PERSIST ---------------- */
  const persistEQ = (updated) => AsyncStorage.setItem(EQ_KEY, JSON.stringify(updated));
  const persistBass = (v) => AsyncStorage.setItem(BASS_KEY, String(v));
  const persistTreble = (v) => AsyncStorage.setItem(TREBLE_KEY, String(v));
  const persistEnabled = (v) => AsyncStorage.setItem(ENABLED_KEY, String(v));

  /* ---------------- TOGGLE EQ ---------------- */
  const toggleEQ = () => {
    const next = !enabled;
    setEnabled(next);
    persistEnabled(next);
    AudioEqualizer.setEnabled(next);
  };

  /* ---------------- RESET ---------------- */
  const resetEQ = () => {
    const flat = Array(bandCount).fill(0);
    setBands(flat);
    setBass(0);
    setTreble(0);
    persistEQ(flat);
    persistBass(0);
    persistTreble(0);
    AudioEqualizer.reset();

    setResetCounter(prev => prev + 1); // force slider re-render
  };

  /* ---------------- UPDATE FUNCTIONS ---------------- */
  const updateBand = (index, value) => {
    if (!enabled) return;

    const db = clamp(value, MIN_DB, MAX_DB);
    const mb = dbToMillibels(db);

    setBands(prev => {
      const updated = [...prev];
      updated[index] = db;
      persistEQ(updated);
      return updated;
    });

    AudioEqualizer.setBandLevel(index, mb);
  };


  const updateBass = (value) => {
    if (!enabled) return;
    const level = clamp(value, -12, 12);
    setBass(level);
    persistBass(level);
    AudioEqualizer.setBass(level * 10);
  };

  const updateTreble = (value) => {
    if (!enabled) return;
    const level = clamp(value, -12, 12);
    setTreble(level);
    persistTreble(level);
  };

  return (
    <View style={styles.container}>
      {/* Header Icons */}
      <View style={styles.header}>
        <View
          style={styles.headerTextView}
        >
          <Text
            style={styles.headerText}
          >
            Equalizer
          </Text>
       </View>
        <View style={styles.headerIcon}>
          <View style={styles.equalizerIcon}>
            <View style={[styles.iconBar, { height: 20 }]} />
            <View style={[styles.iconBar, { height: 25 }]} />
            <View style={[styles.iconBar, { height: 15 }]} />
          </View>
        </View>
        
        {/* <TouchableOpacity style={styles.headerIcon}>
          <View style={styles.circleIcon} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.headerIcon}>
          <View style={styles.cameraIcon}>
            <View style={styles.cameraLens} />
          </View>
        </TouchableOpacity> */}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Frequency Bands */}
        <View style={styles.bandsContainer}>
          {bands.map((value, i) => (
            <FrequencyBand
              key={i}
              value={value}
              frequency={FREQUENCIES[i]}
              onChange={(val) => updateBand(i, val)}
              enabled={enabled}
              resetCounter={resetCounter}
            />
          ))}
        </View>

        {/* Preamp Section */}
        <View style={styles.preampSection}>
          {/* <Text style={styles.preampLabel}>Preamp</Text>
          <Text style={styles.preampValue}>{preamp.toFixed(1)}</Text> */}
        </View>


        {/* Presets */}
        <View style={styles.presetContainer}>
          <TouchableOpacity style={[styles.presetButton,{ backgroundColor: enabled?'#333':'#222'}]}
            onPress={()=>toggleEQ()}
          >
            <Text style={styles.presetText}>Equ</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.presetButton, styles.activePreset]} onPress={()=>{resetEQ()}}>
            <Text style={styles.presetText}>Reset</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.presetMenuButton}>
            <Text style={styles.presetText}>⋮</Text>
          </TouchableOpacity> */}
        </View>
            
        {/* Controls Section */}
        <View style={styles.controlsSection}>
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Tone</Text>
          </View>
          
          <View style={styles.knobsRow}>
          
            {/* Treble Knob */}
            <View style={styles.knobContainer}
              pointerEvents={enabled ? "auto" : "none"}
            >
              <Text style={styles.knobLabel}>Bass</Text>
              {/* {console.warn("initial angle: ",0 + (bass / 100) * 295 )}
              {console.warn("bass: ",bass)} */}
              <Dial
                d
                key={`bass-dial-${resetCounter}`}
                initialAngle={0 + (bass / 100) * 295}
                radiusMin={40}
                radiusMax={80}
                minAngle={-120}
                maxAngle={120}
                onValueChange={(angle) => {
                  console.warn("angle: ",angle)
                  const newBass = Math.round((angle / 120) * 12);
                  setBass(newBass);
                updateBass(newBass)
              }}
                >
                <View 
                    style={[styles.knob, !enabled && styles.knobDisabled]}
                >
                    <View style={styles.knobInner}>
                        <View 
                            style={[
                            styles.knobIndicator,
                            { 
                                transform: [{ 
                                rotate: `${(0 / 100) * 270 - 0}deg` 
                                }] 
                            }
                            ]} 
                        />
                    </View>
                </View>
               </Dial>
              <Text style={styles.knobValue}>{bass > 0 ? '+' : ''}{bass}</Text>
            </View>
          </View>
    
        </View>

        {/* Reset Button */}
       
      </View>
    </View>
  );
}

/* ---------------- FREQUENCY BAND COMPONENT ---------------- */
function FrequencyBand({ value, frequency, onChange, enabled, resetCounter }) {
  const [sliderValue, setSliderValue] = useState(value);

  function formatFreq(hz) {
    return hz >= 1000
      ? `${(hz / 1000).toFixed(1)}k`
      : `${hz}`;
  }


  useEffect(() => {
    setSliderValue(value);
  }, [value, resetCounter]); // <- include resetCounter to force re-render

  return (
    <View style={styles.bandColumn}>
        
        <View
            style={{position:"relative"}}
        >
            <VerticalSlider
            value={sliderValue}
            min={MIN_DB}
            max={MAX_DB}
            disabled={!enabled}
            width={20}
            height={180}
            step={0.1}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="#333"
            onChange={(v) => {
                setSliderValue(v);
                onChange(v);
            }}
        />
        </View>
        <View
            pointerEvents="none"

            style={{
            position: 'absolute',
            bottom: 50,
            width: 20,
            height: ((sliderValue - MIN_DB) / (MAX_DB - MIN_DB)) * 177.5, // fill height
            backgroundColor: enabled?'rgba(148, 0, 211, 1)':'rgba(148, 0, 211, 0.5)',
            borderRadius: 4,
            }}
        />
      <Text style={styles.frequencyText}>{formatFreq(frequency)}</Text>
      <Text style={styles.dbText}>{value > 0 ? '+' : ''}{value.toFixed(1)}</Text>
    </View>
  );
}


/* ---------------- HELPER ---------------- */
function generateWaveformPath(bands) {
  if (!bands.length) return 'M 0 30';
  
  let path = 'M 0 30';
  bands.forEach((v, i) => {
    const x = (i / (bands.length - 1)) * 350;
    const y = 30 - (v / MAX_DB) * 20;
    path += ` L ${x} ${y}`;
  });
  return path;
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  header: {
    flexDirection: 'row',
    justifyContent:"center",
    alignItems:"center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  equalizerIcon: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    // /backgroundColor:"pink",

  },
  iconBar: {
    width: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  circleIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cameraIcon: {
    width: 34,
    height: 34,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraLens: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  bandsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  bandColumn: {
    alignItems: 'center',
    flex: 1,
  },
  trackContainer: {
    paddingTop:10,
    width: 20,
    height: 180,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  trackDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#444',
  },
  activeBar: {
    position: 'absolute',
    bottom: 0,
    width: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  bandThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#aaa',
    borderWidth: 2,
    borderColor: '#666',
  },
  thumbDisabled: {
    opacity: 0.3,
  },
  frequencyText: {
    color: '#fff',
    fontSize: 10,
    marginTop: 20,
  },
  dbText: {
    color: '#888',
    fontSize: 9,
    marginTop: 2,
  },
  preampSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  preampLabel: {
    color: '#888',
    fontSize: 12,
  },
  preampValue: {
    color: '#fff',
    fontSize: 14,
  },
  waveformContainer: {
    height: 60,
    marginVertical: 16,
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    padding: 4,
  },
  disabledMessage: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  disabledText: {
    color: '#666',
    fontSize: 11,
  },
  presetContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 16,
    paddingLeft:13
  },
  presetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  activePreset: {
    backgroundColor: '#333',
  },
  presetMenuButton: {
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 20,
  },
  presetText: {
    color: '#fff',
    fontSize: 13,
  },
  controlsSection: {
    paddingVertical: 20,
    paddingHorizontal:13
  },
  controlRow: {
    paddingVertical: 8,
    paddingHorizontal:5
  },
  controlLabel: {
    color: '#fff',
    fontSize: 14,
  },
  knobsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  knobContainer: {
    alignItems: 'center',
    justifyContent:"center"
  },
  knobLabel: {
    color: '#fff',
    fontSize: 12
  },
  knob: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#333',
  },
  knobDisabled: {
    opacity: 0.3,
  },
  knobInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  knobIndicator: {
    position: 'absolute',
    top: 8,
    width: 4,
    height: 30,
    backgroundColor: '#888',
    borderRadius: 2,
  },
  knobValue: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
  },
  resetButton: {
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingVertical: 12,
    backgroundColor: '#222',
    borderRadius: 20, 
    marginBottom: 40,
  },
  resetText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTextView:{
    justifyContent:"center",
    alignItems:"center",
    // /backgroundColor:"pink",
    width:"50%"
  },
  headerText:{
    color:"white",
    fontSize:30
  }
   
});