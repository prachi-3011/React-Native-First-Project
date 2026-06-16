import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  // Timer States
  const [mode, setMode] = useState('pomodoro'); // pomodoro, short, long
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Focus Status States (To be linked with your On-Board AI later)
  // Options: 'FOCUSED', 'DISTRACTED', 'ABSENT', 'UNVERIFIED'
  const [aiStatus, setAiStatus] = useState('FOCUSED'); 
  const [streak, setStreak] = useState(0);

  // Timer Countdown Logic
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0 && aiStatus === 'FOCUSED') {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, aiStatus]);

  // Handle Mode Shifts
  const changeMode = (newMode, minutes) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(minutes * 60);
  };

  // Format Time Output (e.g., 25:00)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cycle through AI mock statuses manually for design testing
  const toggleMockAI = () => {
    const statuses = ['FOCUSED', 'DISTRACTED', 'ABSENT', 'UNVERIFIED'];
    const currentIndex = statuses.indexOf(aiStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setAiStatus(statuses[nextIndex]);
    
    // Add logic to break streak if distracted
    if (statuses[nextIndex] !== 'FOCUSED') {
      setStreak(0);
    } else {
      setStreak(prev => prev + 1);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.appTitle}>FocusForge AI</Text>

      {/* --- MAIN POMODORO TIMER PANEL --- */}
      <View style={styles.timerCardShadow}>
        <View style={styles.timerCard}>
          {/* Mode Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, mode === 'pomodoro' && styles.activeTabButton]} 
              onPress={() => changeMode('pomodoro', 25)}
            >
              <Text style={[styles.tabText, mode === 'pomodoro' && styles.activeTabText]}>Pomodoro</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, mode === 'short' && styles.activeTabButton]} 
              onPress={() => changeMode('short', 5)}
            >
              <Text style={[styles.tabText, mode === 'short' && styles.activeTabText]}>Short Break</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, mode === 'long' && styles.activeTabButton]} 
              onPress={() => changeMode('long', 15)}
            >
              <Text style={[styles.tabText, mode === 'long' && styles.activeTabText]}>Long Break</Text>
            </TouchableOpacity>
          </View>

          {/* Time Countdown String */}
          <Text style={styles.timerDigits}>{formatTime(timeLeft)}</Text>

          {/* Big Start / Pause Trigger */}
          <TouchableOpacity 
            style={styles.startBtnShadow}
            onPress={() => setIsRunning(!isRunning)}
          >
            <View style={[styles.startBtn, isRunning && { backgroundColor: '#7f8c8d' }]}>
              <Text style={styles.startBtnText}>{isRunning ? 'PAUSE' : 'START'}</Text>
            </View>
          </TouchableOpacity>

          {/* Bottom Utility Icons Row */}
          <View style={styles.utilityRow}>
            <TouchableOpacity style={styles.iconSquare} onPress={() => changeMode(mode, mode === 'pomodoro' ? 25 : mode === 'short' ? 5 : 15)}>
              <Text style={styles.iconSymbol}>⟳</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconSquare} onPress={toggleMockAI}>
              <Text style={styles.iconSymbol}>🤖</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconSquare}>
              <Text style={styles.iconSymbol}>⛭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Progress Decorative Solid Bar */}
      <View style={styles.barShadow}>
        <View style={styles.barFill} />
      </View>

      {/* --- AI LIVE NOTIFICATION STATUS FEED --- */}
      <Text style={styles.sectionHeader}>On-Board AI Engine Diagnostics</Text>

      {aiStatus === 'FOCUSED' && (
        <View style={styles.statusCardShadow}>
          <View style={[styles.statusCard, { backgroundColor: '#f9f6e6' }]}>
            <Text style={styles.emojiIcon}>❤️</Text>
            <View style={styles.statusTextGroup}>
              <Text style={[styles.statusStatusTitle, { color: '#27ae60' }]}>Success!</Text>
              <Text style={styles.statusMessage}>User validated. Keeping deep focus focus streak.</Text>
            </View>
            <View style={styles.badge}><Text style={styles.badgeText}>+{streak}m</Text></View>
          </View>
        </View>
      )}

      {aiStatus === 'DISTRACTED' && (
        <View style={styles.statusCardShadow}>
          <View style={[styles.statusCard, { backgroundColor: '#f9f6e6' }]}>
            <Text style={styles.emojiIcon}>⚠️</Text>
            <View style={styles.statusTextGroup}>
              <Text style={[styles.statusStatusTitle, { color: '#d35400' }]}>Warning</Text>
              <Text style={styles.statusMessage}>Gaze vector outside workspace bounds.</Text>
            </View>
          </View>
        </View>
      )}

      {aiStatus === 'ABSENT' && (
        <View style={styles.statusCardShadow}>
          <View style={[styles.statusCard, { backgroundColor: '#a5dcd6' }]}>
            <Text style={styles.emojiIcon}>📊</Text>
            <View style={styles.statusTextGroup}>
              <Text style={[styles.statusStatusTitle, { color: '#2c3e50' }]}>Session Paused</Text>
              <Text style={styles.statusMessage}>No face target detected inside camera frame viewport.</Text>
            </View>
          </View>
        </View>
      )}

      {aiStatus === 'UNVERIFIED' && (
        <View style={styles.statusCardShadow}>
          <View style={[styles.statusCard, { backgroundColor: '#f9f6e6' }]}>
            <Text style={styles.emojiIcon}>👤</Text>
            <View style={styles.statusTextGroup}>
              <Text style={[styles.statusStatusTitle, { color: '#c0392b' }]}>Security Mismatch</Text>
              <Text style={styles.statusMessage}>Unknown biometric layout fingerprint active.</Text>
            </View>
          </View>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Main Container Background Setup
  container: { 
    backgroundColor: '#ffb2b2', 
    alignItems: 'center', 
    paddingVertical: 50,
    paddingHorizontal: 20 
  },
  appTitle: {
    fontFamily: 'monospace',
    fontSize: 28,
    fontWeight: '900',
    color: '#1a1a1a',
    marginBottom: 25,
    textTransform: 'uppercase',
    letterSpacing: 1
  },

  // --- TIMER LAYOUT RETRO EFFECTS ---
  timerCardShadow: {
    backgroundColor: '#000',
    borderRadius: 4,
    width: '100%',
    maxWidth: 360,
    marginBottom: 20,
  },
  timerCard: {
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 4,
    padding: 18,
    alignItems: 'center',
    transform: [{ translateX: -4 }, { translateY: -4 }], // Creates pixel offset shadow
  },
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  tabButton: {
    borderWidth: 2,
    borderColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  activeTabButton: {
    backgroundColor: '#ff5252',
  },
  tabText: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 11,
    color: '#000',
  },
  activeTabText: {
    color: '#fff',
  },
  timerDigits: {
    fontFamily: 'monospace',
    fontSize: 64,
    fontWeight: '900',
    color: '#000',
    marginVertical: 15,
    letterSpacing: -2,
  },

  // Start Button Bold Effect
  startBtnShadow: {
    backgroundColor: '#000',
    width: '85%',
    borderRadius: 4,
    marginVertical: 15,
  },
  startBtn: {
    backgroundColor: '#ff5252',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    transform: [{ translateX: -3 }, { translateY: -3 }],
  },
  startBtnText: {
    fontFamily: 'monospace',
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },

  // Utility Square Icons Setup
  utilityRow: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 12,
  },
  iconSquare: {
    borderWidth: 2,
    borderColor: '#000',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  // Bottom Border Banner Decoration
  barShadow: {
    backgroundColor: '#000',
    width: '100%',
    maxWidth: 360,
    height: 16,
    marginBottom: 35,
  },
  barFill: {
    backgroundColor: '#ff5252',
    borderWidth: 2,
    borderColor: '#000',
    width: '100%',
    height: '100%',
    transform: [{ translateX: -3 }, { translateY: -3 }],
  },

  // --- DIAGNOSTICS CARD PIXEL LAYOUT ---
  sectionHeader: {
    fontFamily: 'monospace',
    alignSelf: 'flex-start',
    maxWidth: 360,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  statusCardShadow: {
    backgroundColor: '#000',
    borderRadius: 14,
    width: '100%',
    maxWidth: 360,
    marginBottom: 16,
  },
  statusCard: {
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  emojiIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  statusTextGroup: {
    flex: 1,
  },
  statusStatusTitle: {
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 2,
  },
  statusMessage: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#2c3e50',
    lineHeight: 16,
  },
  badge: {
    borderLeftWidth: 2,
    borderColor: '#000',
    paddingLeft: 10,
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#000',
    fontSize: 14,
  },
});