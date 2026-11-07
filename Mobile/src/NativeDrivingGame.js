import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GLView } from 'expo-gl';
import { createInitialState, speedMph, stepGame } from './engine/physics.js';
import { createNativeRenderer } from './render/NativeRenderer.js';

function DriveButton({ label, onPressIn, onPressOut, accessibilityLabel, wide }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={({ pressed }) => [
        styles.control,
        wide && styles.wideControl,
        pressed && styles.controlPressed,
      ]}
    >
      <Text style={styles.controlText}>{label}</Text>
    </Pressable>
  );
}

export default function NativeDrivingGame() {
  const [error, setError] = useState(null);
  const [hud, setHud] = useState({ speed: 0, distance: 0 });
  const [paused, setPaused] = useState(false);
  const [surfaceId, setSurfaceId] = useState(0);
  const stateRef = useRef(createInitialState());
  const inputRef = useRef({ throttle: 0, brake: 0, steer: 0 });
  const rendererRef = useRef(null);
  const animationRef = useRef(null);
  const activeRef = useRef(true);
  const pausedRef = useRef(false);

  const releaseControls = useCallback(() => {
    inputRef.current = { throttle: 0, brake: 0, steer: 0 };
  }, []);

  useEffect(() => {
    activeRef.current = true;
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') {
        pausedRef.current = true;
        releaseControls();
      } else {
        pausedRef.current = false;
        setPaused(false);
      }
    });
    return () => {
      activeRef.current = false;
      releaseControls();
      subscription.remove();
      if (animationRef.current != null) cancelAnimationFrame(animationRef.current);
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
  }, [releaseControls]);

  const onContextCreate = useCallback((gl) => {
    try {
      rendererRef.current?.dispose();
      const renderer = createNativeRenderer(gl);
      rendererRef.current = renderer;
      let priorTime = 0;
      let lastHudTime = 0;
      const frame = (now) => {
        if (!activeRef.current || rendererRef.current !== renderer) return;
        const dt = priorTime > 0 ? Math.min((now - priorTime) / 1000, 0.05) : 0;
        priorTime = now;
        try {
          if (!pausedRef.current) {
            stateRef.current = stepGame(stateRef.current, inputRef.current, dt);
            renderer.render(stateRef.current);
          }
          if (now - lastHudTime > 125) {
            setHud({
              speed: Math.round(speedMph(stateRef.current.speed)),
              distance: Math.round(stateRef.current.distance),
            });
            lastHudTime = now;
          }
          animationRef.current = requestAnimationFrame(frame);
        } catch (e) {
          setError(String(e?.message || e));
          renderer.dispose();
          rendererRef.current = null;
        }
      };
      animationRef.current = requestAnimationFrame(frame);
    } catch (e) {
      setError(String(e?.message || e));
    }
  }, []);

  const reset = () => {
    releaseControls();
    stateRef.current = createInitialState();
    setHud({ speed: 0, distance: 0 });
  };

  const retry = () => {
    rendererRef.current?.dispose();
    rendererRef.current = null;
    if (animationRef.current != null) cancelAnimationFrame(animationRef.current);
    setError(null);
    setSurfaceId((id) => id + 1);
  };

  const togglePause = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (next) releaseControls();
  };

  return (
    <View style={styles.root}>
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.title}>SlowRoads</Text>
          <Text style={styles.errorText}>Native OpenGL rendering failed:</Text>
          <Text selectable style={styles.errorDetail}>{error}</Text>
          <Pressable onPress={retry} style={styles.action}>
            <Text style={styles.actionText}>Retry native renderer</Text>
          </Pressable>
        </View>
      ) : (
        <GLView
          key={surfaceId}
          style={StyleSheet.absoluteFill}
          onContextCreate={onContextCreate}
        />
      )}
      <View pointerEvents="none" style={styles.hud}>
        <Text style={styles.brand}>S L O W   R O A D S</Text>
        <Text style={styles.speed}>{hud.speed} <Text style={styles.speedUnit}>MPH</Text></Text>
        <Text style={styles.distance}>{hud.distance} m</Text>
        <Text style={styles.alpha}>NATIVE ENGINE • EARLY PORT</Text>
      </View>
      {!error && (
        <>
          <View style={styles.topActions}>
            <Pressable accessibilityRole="button" onPress={reset} style={styles.action}>
              <Text style={styles.actionText}>RESET</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={togglePause} style={styles.action}>
              <Text style={styles.actionText}>{paused ? 'RESUME' : 'PAUSE'}</Text>
            </Pressable>
          </View>
          <View style={styles.controls} pointerEvents="box-none">
            <View style={styles.controlGroup}>
              <DriveButton
                label="◀"
                accessibilityLabel="Steer left"
                onPressIn={() => { inputRef.current.steer = -1; }}
                onPressOut={() => { if (inputRef.current.steer === -1) inputRef.current.steer = 0; }}
              />
              <DriveButton
                label="▶"
                accessibilityLabel="Steer right"
                onPressIn={() => { inputRef.current.steer = 1; }}
                onPressOut={() => { if (inputRef.current.steer === 1) inputRef.current.steer = 0; }}
              />
            </View>
            <View style={styles.controlGroup}>
              <DriveButton
                label="BRAKE"
                wide
                onPressIn={() => { inputRef.current.brake = 1; }}
                onPressOut={() => { inputRef.current.brake = 0; }}
              />
              <DriveButton
                label="GO"
                wide
                onPressIn={() => { inputRef.current.throttle = 1; }}
                onPressOut={() => { inputRef.current.throttle = 0; }}
              />
            </View>
          </View>
          {paused && (
            <View pointerEvents="none" style={styles.pauseBanner}>
              <Text style={styles.pauseText}>PAUSED</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#90b5cb' },
  hud: { position: 'absolute', top: 16, left: 30, alignItems: 'flex-start' },
  brand: { color: '#f8fafb', fontWeight: '700', letterSpacing: 3, fontSize: 15, textShadowColor: '#33414f', textShadowRadius: 6 },
  speed: { color: '#f8fafb', fontWeight: '600', fontSize: 40, marginTop: 2, textShadowColor: '#33414f', textShadowRadius: 5 },
  speedUnit: { fontSize: 13, fontWeight: '400' },
  distance: { color: '#f8fafb', fontSize: 15 },
  alpha: { color: '#f9f7e8', fontSize: 10, marginTop: 6, letterSpacing: 1 },
  topActions: { position: 'absolute', right: 24, top: 16, flexDirection: 'row', gap: 10 },
  action: { backgroundColor: '#1c2632ad', borderWidth: 1, borderColor: '#d9e2e8a0', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 6 },
  actionText: { color: '#fafafa', fontSize: 12, fontWeight: '700' },
  controls: { position: 'absolute', bottom: 18, left: 26, right: 26, flexDirection: 'row', justifyContent: 'space-between' },
  controlGroup: { flexDirection: 'row', gap: 12, alignItems: 'flex-end' },
  control: { width: 76, height: 66, backgroundColor: '#1f2b3788', borderColor: '#fff7', borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  wideControl: { width: 93 },
  controlPressed: { backgroundColor: '#1f2b37d9', borderColor: '#ffffff' },
  controlText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  pauseBanner: { position: 'absolute', top: '42%', alignSelf: 'center', backgroundColor: '#243343b8', paddingVertical: 12, paddingHorizontal: 35, borderRadius: 6 },
  pauseText: { color: '#fff', letterSpacing: 3, fontWeight: '700', fontSize: 23 },
  errorBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#14202c' },
  title: { fontSize: 28, color: '#fff', fontWeight: '700', marginBottom: 15 },
  errorText: { color: '#ebecf2', marginBottom: 10 },
  errorDetail: { color: '#f2acac', fontSize: 12, textAlign: 'center' },
});
