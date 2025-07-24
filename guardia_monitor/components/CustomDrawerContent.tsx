import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const menuItems = [   
  { 
    label: 'Privacy', 
    icon: 'shield-account',
    route: '/(privacy)/Privacy'
  },
  { 
    label: 'Termini e condizioni', 
    icon: 'book-open-page-variant',
    route: '/(termini)/Termini'
  },
  { 
    label: 'Contatti e consulenze', 
    icon: 'account',
    route: '/(contatti)/ConsulenzaIntro'
  },
];

export function CustomDrawerContent(props: any) {
  const router = useRouter();
  const appVersion = Constants.expoConfig?.version || '1.0.0';

  return (
    <DrawerContentScrollView 
      {...props} 
      style={styles.drawerContainer}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header con logo e titolo */}
      <View style={styles.header}>
        <Image 
          source={require('@/assets/images/GD.png')} 
          style={styles.logo} 
          resizeMode="cover"
        />
        <Text style={styles.headerTitle}>Guardia Monitor</Text>
        <Text style={styles.headerSubtitle}>Gestione Conformità</Text>
      </View>

      {/* Sezione menu */}
      <View style={styles.menuSection}>
        {menuItems.map((item) => (
          <TouchableOpacity
          key={item.label}
          style={[styles.menuItem, { paddingHorizontal: 16 }]}
          onPress={() => {
            router.replace(item.route);
          }}
        >
          <View style={styles.menuItemContent}>
            <MaterialCommunityIcons 
              name={item.icon as any} 
              size={24} 
              color={"#043474"} 
            />
            <Text style={[
              styles.menuItemLabel,
              { 
                marginLeft: 16,  // Spazio personalizzabile sennò non ci entrano le icone
                color:"#043474"
              }
            ]}>
              {item.label}
            </Text>
          </View>
        </TouchableOpacity>
        ))}
      </View>

      {/* Footer con versione */}
      <View style={styles.footer}>
      <Image 
    source={require('@/assets/images/GD.png')}
    style={styles.footerLogo}
  />
        <Text style={styles.versionText}>Versione {appVersion}</Text>
        <Text style={styles.copyrightText}>© 2025 Guardia Digitale</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItem: {
    marginVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
    //borderBottomWidth: 1,
    //borderBottomColor: '#f0f0f0',
    alignItems: 'center',
    //backgroundColor: '#f8f9fa',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 10,
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  menuSection: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  menuItemLabel: {
    fontSize: 16,
    marginLeft: -15,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    //borderTopWidth: 1,
    borderRadius:20,
    //borderTopColor: '#f0f0f0',
    alignItems: 'center',
    //backgroundColor: '#f8f9fa',
  },
  versionText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  footerLogo: {
    width: 140,
    height: 80,
    resizeMode: 'contain',
    opacity: 0.8, // Leggermente trasparente per non essere troppo invasivo
  },
});