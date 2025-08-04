// In Components/SleepTimerModal.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { startTimer, stopTimer } from "../../Store/TimerSlice";
import { setIsPlaying } from "../../Store/MusicSlice";
import { useTheme } from "@react-navigation/native";


const SleepTimerModal = ({ visible, onClose, soundRef }) => {
  const colors = useTheme()
  const dispatch = useDispatch();
  const { isTimerActive, timerEndTime, timerId, timerDuration } = useSelector(
    (state) => state.sleepTimer
  );
  const { data, pos } = useSelector((state) => state.data);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const isplaying = useSelector((state) => state.data.isplaying);
 

  // Timer options in milliseconds
  const timerOptions = [
    { label: "15 sec", value: 0.25 * 60 * 1000 },
    { label: "5 minutes", value: 5 * 60 * 1000 },
    { label: "10 minutes", value: 10 * 60 * 1000 },
    { label: "15 minutes", value: 15 * 60 * 1000 },
    { label: "30 minutes", value: 30 * 60 * 1000 },
    { label: "1 hour", value: 60 * 60 * 1000 },
    { label: "End of track", value: "end_of_track" },
  ];

  
  useEffect(() => {
    let interval;

    // Start the timer only when music begins playing 
    if (isplaying && isTimerActive && !timerId && timerDuration) {

      const timeout = setTimeout(async () => {
        console.log("⏱ Timer fired after song started!");

        if (soundRef && soundRef.current) {
          await soundRef.current.pauseAsync();
          dispatch(setIsPlaying(false));
        }

        dispatch(stopTimer());
      }, timerDuration);

      // Update Redux state 
      dispatch(
        startTimer({
          duration: timerDuration,
          timerId: timeout,
          endTime: Date.now() + timerDuration,
        })
      );
    }

    
    if (isTimerActive && timerEndTime) {
      interval = setInterval(() => {
        const remaining = timerEndTime - Date.now();
        if (remaining <= 0) {
          setTimeRemaining(0);
          clearInterval(interval);
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);
    }

    // Cleanup on unmount 
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isplaying,
    isTimerActive,
    timerId,
    timerDuration,
    timerEndTime,
    dispatch,
    soundRef,
  ]);

  // Format milliseconds to MM:SS
  const formatTime = (ms) => {
    if (!ms) return "00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleTimerSelect = (timerDuration) => {
    if (timerDuration === "end_of_track") {
      if (data && data[pos]?.duration) {
        const remainingTime =
          data[pos].duration - (data[pos].currentPosition || 0);
        handleSetTimer(remainingTime);
      }
    } else {
      handleSetTimer(timerDuration);
    }
  };

  const handleSetTimer = (durationValue) => {
    // Clear any existing timer
    if (isTimerActive && timerId) {
      clearTimeout(timerId);
    }

    // Update redux to activate timer status without starting the actual timer yet
    // The actual timer will start in useEffect when the song plays
    dispatch(
      startTimer({
        duration:durationValue,
        timerId: null,
        endTime: null,
      })
    );

    onClose();
  };

  const handleCancelTimer = () => {
    if (timerId) {
      clearTimeout(timerId);
    }
    dispatch(stopTimer());
    onClose();
  };

  const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 25,
    paddingBottom: 30,
    marginHorizontal:"4%"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: colors.colors.text,
  },

  timerButton: {
    padding: 10,
    marginBottom: 10,
    alignItems: "left",
  },
  cancelButton: {
    backgroundColor: colors.colors.text,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.colors.text,
  },
  activeTimerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  timerText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    padding: 15,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#888",
  },
  line: {
    marginTop: 1,
    height: 1,
    backgroundColor: "#aaa",
    opacity: 0.4,
    marginBottom: 15,
  },
  optionText: {
    fontSize: 15,
    color:"#FF6B6B",
    textAlign: "left",
    padding: 10,
    marginBottom: 10,
  },
});

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>
              Sleep Timer{" "}
              {isTimerActive && timeRemaining != null ? `:Set for ${formatTime(timerDuration)}` : ""}
            </Text>
            <View style={styles.line}></View>

            <View style={styles.optionsContainer}>
              {timerOptions.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  style={styles.timerButton}
                  onPress={() => handleTimerSelect(option.value)}
                >
                  <Text style={styles.buttonText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
              {isTimerActive && (
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={handleCancelTimer}
                >
                  <Text style={styles.optionText}>Turn Off Timer</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};



export default SleepTimerModal;
