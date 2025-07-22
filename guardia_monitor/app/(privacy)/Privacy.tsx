// app/(guida)/index.tsx

//https://guardiadigitale.it/privacy-policy/
import { Ionicons } from '@expo/vector-icons';
import * as haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const formUrl = "https://guardiadigitale.it/privacy-policy/";


  const [canGoBack, setCanGoBack] = useState(false);

  const onNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
};
  useEffect(() => {
      const backAction = () => {
          if(canGoBack) {
              webViewRef.current?.goBack();
          }else{
              router.push('/')
          }
          return true;
      };

      const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
      );

      return () => backHandler.remove();
  }, []);

  const HeaderLeft = () => (
      <TouchableOpacity 
          onPress={() => {
              haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
              if(canGoBack) {
                  webViewRef.current?.goBack();
              }else{
                  router.push('/')
              }
          }}
          style={styles.backButton}
      >
          <Ionicons name="arrow-back" size={24} color="#043474" />
      </TouchableOpacity>
  );
  const HeaderRight = () => (
      <TouchableOpacity 
          onPress={() => {
              haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
              router.back()
          }}
          style={styles.closeButton}
      >
          <Ionicons name="home" size={24} color="#043474" />
      </TouchableOpacity>
  );

  return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
          <Stack.Screen 
              options={{ 
                  title: 'Privacy',
                  headerShown: true,
                  headerLeft: () => <HeaderLeft />, // Ora è a sinistra
                  headerRight: () => <HeaderRight />,
                  headerTitleStyle: {
                      color: '#333',
                      fontWeight: '600',
                  },
                  headerShadowVisible: false,
              }} 
          />
          
          <WebView
              ref={webViewRef}
              source={{ uri: formUrl }}
              style={styles.webview}
              startInLoadingState={true}
              renderLoading={() => (
                  <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#4169E1" />
                  </View>
              )}
              onNavigationStateChange={onNavigationStateChange}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              originWhitelist={['*']}
              allowsFullscreenVideo={false}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              allowsBackForwardNavigationGestures={true}
          />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
  },
  webview: {
      flex: 1,
  },
  loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
  },
  backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 8,
      padding: 8,
  },
  backButtonText: {
      color: '#4169E1',
      fontSize: 16,
      marginLeft: 4,
      fontWeight: '500',
  },
  closeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 8,
      padding: 8,
  },
});