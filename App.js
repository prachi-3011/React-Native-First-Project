import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  // Timer States
  const [mode, setMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Focus Status States (Mock AI status linked to layout timers)
  const [aiStatus, setAiStatus] = useState('FOCUSED'); 
  const [streak, setStreak] = useState(0);

  // Native Camera Permission Hook
  const [permission, requestPermission] = useCameraPermissions();

  // Timer Countdown Loop
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

  const changeMode = (newMode, minutes) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(minutes * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Quick helper button to manually cycle states for theme presentation testing
  const toggleMockAI = () => {
    const statuses = ['FOCUSED', 'DISTRACTED', 'ABSENT', 'UNVERIFIED'];
    const currentIndex = statuses.indexOf(aiStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setAiStatus(statuses[nextIndex]);
    if (statuses[nextIndex] !== 'FOCUSED') setStreak(0);
    else setStreak(prev => prev + 1);
  };

  // --- CAMERA PERMISSION SCREENS ---
  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.centeredContainer}><Text style={styles.appTitle}>Loading Core...</Text></View>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.centeredContainer}>
        <Text style={[styles.appTitle, { textAlign: 'center', paddingHorizontal: 20 }]}>Camera Access Required</Text>
        <Text style={styles.permissionText}>FocusForge needs the front camera to process facial verification vectors locally.</Text>
        <TouchableOpacity style={styles.startBtnShadow} onPress={requestPermission}>
          <View style={styles.startBtn}><Text style={styles.startBtnText}>GRANT PERMISSION</Text></View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.appTitle}>FocusForge AI</Text>

      {/* --- RETRO POMODORO TIMER PANEL --- */}
      <View style={styles.timerCardShadow}>
        <View style={styles.timerCard}>
          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tabButton, mode === 'pomodoro' && styles.activeTabButton]} onPress={() => changeMode('pomodoro', 25)}>
              <Text style={[styles.tabText, mode === 'pomodoro' && styles.activeTabText]}>Pomodoro</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabButton, mode === 'short' && styles.activeTabButton]} onPress={() => changeMode('short', 5)}>
              <Text style={[styles.tabText, mode === 'short' && styles.activeTabText]}>Short Break</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabButton, mode === 'long' && styles.activeTabButton]} onPress={() => changeMode('long', 15)}>
              <Text style={[styles.tabText, mode === 'long' && styles.activeTabText]}>Long Break</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.timerDigits}>{formatTime(timeLeft)}</Text>

          <TouchableOpacity style={styles.startBtnShadow} onPress={() => setIsRunning(!isRunning)}>
            <View style={[styles.startBtn, isRunning && { backgroundColor: '#7f8c8d' }]}>
              <Text style={styles.startBtnText}>{isRunning ? 'PAUSE' : 'START'}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.utilityRow}>
            <TouchableOpacity style={styles.iconSquare} onPress={() => changeMode(mode, mode === 'pomodoro' ? 25 : mode === 'short' ? 5 : 15)}>
              <Text style={styles.iconSymbol}>⟳</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconSquare} onPress={toggleMockAI}>
              <Text style={styles.iconSymbol}>🤖</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.barShadow}><View style={styles.barFill} /></View>

      {/* --- AI NOTIFICATION STATUS PANELS --- */}
      <Text style={styles.sectionHeader}>On-Board AI Diagnostics</Text>

      {aiStatus === 'FOCUSED' && (
        <View style={styles.statusCardShadow}>
          <View style={[styles.statusCard, { backgroundColor: '#f9f6e6' }]}>
            <Text style={styles.emojiIcon}>❤️</Text>
            <View style={styles.statusTextGroup}>
              <Text style={[styles.statusStatusTitle, { color: '#27ae60' }]}>Success!</Text>
              <Text style={styles.statusMessage}>User validated. Deep focus focus active.</Text>
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
              <Text style={styles.statusMessage}>No face target detected inside camera viewport.</Text>
            </View>
          </View>
        </View>
      )}

      {aiStatus === 'UNVERIFIED' && (
        <View style={styles.statusCardShadow}>
          <View style={[styles.statusCard, { backgroundColor: '#f9f6e6' }]}>
            <Text style={styles.emojiIcon}>👤</Text>
            <View style={styles.statusTextGroup}>
              <Text style={[styles.statusStatusTitle, { color: '#c0392b' }]}>Mismatch</Text>
              <Text style={styles.statusMessage}>Unknown biometric layout fingerprint active.</Text>
            </View>
          </View>
        </View>
      )}

      {/* --- LIVE AI VIEWPORT EYE TRACKER --- */}
      <Text style={styles.sectionHeader}>Live Tracking Viewport</Text>
      <View style={styles.cameraBoxShadow}>
        <CameraView style={styles.cameraFrame} facing="front">
          {/* Transparent retro alignment crosshair graphics overlay */}
          <View style={styles.crosshairContainer}>
            <View style={styles.crosshairTarget} />
          </View>
        </CameraView>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#ffb2b2', alignItems: 'center', paddingVertical: 50, paddingHorizontal: 20 },
  centeredContainer: { flex: 1, backgroundColor: '#ffb2b2', alignItems: 'center', justifyContent: 'center', padding: 20 },
  permissionText: { fontFamily: 'monospace', fontSize: 14, color: '#000', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  appTitle: { fontFamily: 'monospace', fontSize: 28, fontWeight: '900', color: '#1a1a1a', marginBottom: 25, textTransform: 'uppercase' },
  timerCardShadow: { backgroundColor: '#000', borderRadius: 4, width: '100%', maxWidth: 360, marginBottom: 20 },
  timerCard: { backgroundColor: '#ffffff', borderWidth: 3, borderColor: '#000000', borderRadius: 4, padding: 18, alignItems: 'center', transform: [{ translateX: -4 }, { translateY: -4 }] },
  tabContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 25 },
  tabButton: { borderWidth: 2, borderColor: '#000', paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#fff' },
  activeTabButton: { backgroundColor: '#ff5252' },
  tabText: { fontFamily: 'monospace', fontWeight: 'bold', fontSize: 11, color: '#000' },
  activeTabText: { color: '#fff' },
  timerDigits: { fontFamily: 'monospace', fontSize: 64, fontWeight: '900', color: '#000', marginVertical: 15 },
  startBtnShadow: { backgroundColor: '#000', width: '85%', borderRadius: 4, marginVertical: 15 },
  startBtn: { backgroundColor: '#ff5252', borderWidth: 2, borderColor: '#000', borderRadius: 4, paddingVertical: 12, alignItems: 'center', transform: [{ translateX: -3 }, { translateY: -3 }] },
  startBtnText: { fontFamily: 'monospace', color: '#fff', fontSize: 20, fontWeight: '900' },
  utilityRow: { flexDirection: 'row', marginTop: 15, gap: 12 },
  iconSquare: { borderWidth: 2, borderColor: '#000', width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  iconSymbol: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  barShadow: { backgroundColor: '#000', width: '100%', maxWidth: 360, height: 16, marginBottom: 35 },
  barFill: { backgroundColor: '#ff5252', borderWidth: 2, borderColor: '#000', width: '100%', height: '100%', transform: [{ translateX: -3 }, { translateY: -3 }] },
  sectionHeader: { fontFamily: 'monospace', alignSelf: 'flex-start', maxWidth: 360, fontSize: 14, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 12, textTransform: 'uppercase', marginTop: 10 },
  statusCardShadow: { backgroundColor: '#000', borderRadius: 14, width: '100%', maxWidth: 360, marginBottom: 16 },
  statusCard: { borderWidth: 3, borderColor: '#000', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', transform: [{ translateX: -4 }, { translateY: -4 }] },
  emojiIcon: { fontSize: 32, marginRight: 14 },
  statusTextGroup: { flex: 1 },
  statusStatusTitle: { fontFamily: 'monospace', fontSize: 18, fontWeight: '900', marginBottom: 2 },
  statusMessage: { fontFamily: 'monospace', fontSize: 12, color: '#2c3e50', lineHeight: 16 },
  badge: { borderLeftWidth: 2, borderColor: '#000', paddingLeft: 10, justifyContent: 'center' },
  badgeText: { fontFamily: 'monospace', fontWeight: 'bold', color: '#000', fontSize: 14 },
  
  // --- RETRO VIEWPORT STYLES ---
  cameraBoxShadow: { 
    backgroundColor: '#000', 
    width: '100%', 
    maxWidth: 360, 
    height: 200, 
    borderRadius: 8,
    marginBottom: 40 
  },
  cameraFrame: { 
    width: '100%', 
    height: '100%', 
    borderWidth: 3, 
    borderColor: '#000', 
    borderRadius: 8, 
    overflow: 'hidden',
    transform: [{ translateX: -4 }, { translateY: -4 }] 
  },
  crosshairContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.15)' 
  },
  crosshairTarget: { 
    width: 80, 
    height: 80, 
    borderWidth: 2, 
    borderStyle: 'dashed', 
    borderColor: '#ff5252', 
    borderRadius: 40 
  }
});