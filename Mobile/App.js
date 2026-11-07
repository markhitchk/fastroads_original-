import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

// Copied to the Android APK by plugins/withSlowRoadsAssets.js during prebuild.
const OFFLINE_GAME_URL = 'file:///android_asset/slowroads/index.html';

export default function App() {
  const [reloadKey, setReloadKey] = useState(0);
  const [loadError, setLoadError] = useState(null);

  const shouldStartLoad = useCallback((request) => {
    const { url } = request;
    if (
      url.startsWith('file:///android_asset/slowroads/') ||
      url.startsWith('about:') ||
      url.startsWith('blob:') ||
      url.startsWith('data:')
    ) {
      return true;
    }
    if (/^https?:\/\//i.test(url)) {
      Linking.openURL(url).catch(() => {});
    }
    return false;
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      {loadError ? (
        <View style={styles.errorPanel}>
          <Text style={styles.title}>SlowRoads</Text>
          <Text style={styles.body}>
            The bundled game could not be opened. This is an early Android
            compatibility build.
          </Text>
          <Text selectable style={styles.detail}>{loadError}</Text>
          <Pressable
            accessibilityRole="button"
            style={styles.retry}
            onPress={() => {
              setLoadError(null);
              setReloadKey((previous) => previous + 1);
            }}
          >
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <WebView
          key={reloadKey}
          source={{ uri: OFFLINE_GAME_URL }}
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          allowFileAccess
          allowFileAccessFromFileURLs
          allowUniversalAccessFromFileURLs={false}
          androidLayerType="hardware"
          mediaPlaybackRequiresUserAction={false}
          onShouldStartLoadWithRequest={shouldStartLoad}
          onError={({ nativeEvent }) =>
            setLoadError(nativeEvent.description || 'Unknown WebView load error')
          }
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#d1d9e6" />
              <Text style={styles.loadingText}>Loading SlowRoads…</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#080d14' },
  webview: { flex: 1, backgroundColor: '#080d14' },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#080d14',
  },
  loadingText: { color: '#e6eaf0', fontSize: 14, marginTop: 12 },
  errorPanel: {
    flex: 1,
    paddingHorizontal: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#f7f8fa', fontSize: 30, fontWeight: '700' },
  body: { color: '#cbd2dc', fontSize: 15, textAlign: 'center', marginTop: 12 },
  detail: { color: '#9aa6b5', fontSize: 11, marginTop: 10, textAlign: 'center' },
  retry: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#394a5c',
  },
  retryText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
