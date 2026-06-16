# FocusForge AI 🤖⏱️

A beautiful, gamified **Neo-Brutalist 8-Bit Productivity Timer** built with React Native and Expo. FocusForge AI incorporates simulated on-board computer vision to monitor your study presence and attention vectors in real-time. If you look away, get distracted, or leave your workspace, the app instantly pauses your session and alerts you with structural haptic vibration patterns.

---

## 🚀 Key Features

* **8-Bit Pomodoro Loop:** Full cycling capabilities between Pomodoro deep-focus blocks (25 mins), Short Breaks (5 mins), and Long Breaks (15 mins).
* **On-Board Vision Simulator:** Intercepts real-time states to process focus orientation data intervals, pausing instantly if user presence drops.
* **Live Camera Viewport:** Activates the phone's front-facing camera matrix directly inside an alignment crosshair container.
* **Haptic Vibration Triggers:** Employs precise dual-buzz pattern frequencies (`[0, 400, 200, 400]`) to snap you back into focus during a distraction warning.
* **Zero Cloud Overhead:** 100% on-device architecture processing designed to protect user biometric privacy and eliminate server data streaming fees.

---

## 🛠️ Tech Stack & Dependencies

* **Framework:** React Native (Expo Workflow)
* **Camera Interface:** `expo-camera`
* **Haptics Engine:** React Native Native Core `Vibration` API
* **Layout Design:** Neo-Brutalist Custom Transformation Styles (No external UI frameworks needed)

---

## 💻 Installation & Setup

Follow these steps to get the environment configured on your local machine:

1. **Clone the Repository:**
```bash

```



cd ~/Prachi/MobileApps/CounterApp

```

2. **Install Core Dependencies:**
   Ensure you have all the necessary native bridges installed:
   ```bash
npm install
npx expo install expo-camera

```

3. **Boot the Development Server:**
Launch the Expo CLI terminal runner:
```bash

```



npx expo start

```

4. **Run on Mobile via Expo Go:**
   * Open the **Expo Go** app on your iOS or Android device.
   * Scan the terminal's generated QR code.
   * Accept the native camera authorization prompt when the interface finishes caching.

---

## 🧠 Strategic Architecture Architecture

```text
 [ Camera Viewport ] ──► [ Spatial Evaluator ] ──► [ State Mutator ] ──► [ Layout Pipeline ]
        │                       │                        │                      │
  Streams Raw             Tracks Target             FOCUSED     ──► Ticks Down/Green Layout
  Matrix Pixels          Boundary Bounds            DISTRACTED  ──► Pauses/Fires Dual-Buzz
                                                    ABSENT      ──► Pauses/Fires Single-Buzz

```

