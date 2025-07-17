import { useTheme } from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';
import { CustomDrawerContent } from './CustomDrawerContent';

export function AppDrawer() {
  const { colors } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShown: true,
        drawerStyle: {
          width: 280,
          backgroundColor: '#043474',
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Guardia Monitor',
          headerStyle: {
            backgroundColor: '#043474',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Drawer>
  );
}