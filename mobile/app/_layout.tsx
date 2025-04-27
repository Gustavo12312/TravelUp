import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import CustomDrawerContent from '../components/CustomDrawer';
import { isAuth } from '../utils/auth.utils'; // Your async auth check
import { AuthProvider, useAuth } from '../utils/auth.context'; 

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const result = await isAuth();
      setAuthenticated(result);
      setIsReady(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (isReady && !authenticated) {
      router.replace('/login'); // Only navigate after layout is mounted and auth checked
    }
  }, [isReady, authenticated]);

  if (!isReady) {
    return null; // Optionally render a loading spinner here
  }

  return (
    <>
      <AuthProvider>
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            drawerStyle: { backgroundColor: '#1e1e1e' },
            drawerLabelStyle: { color: '#fff' },
          }}
        >
          <Drawer.Screen
            name="(tabs)"
            options={{ drawerItemStyle: { display: 'none' } }}
          />
          <Drawer.Screen
            name="login"
            options={{ drawerItemStyle: { display: 'none' } }}
          />
          <Drawer.Screen
            name="+not-found"
            options={{ drawerItemStyle: { display: 'none' } }}
          />
        </Drawer>
      
      <StatusBar style="light" />
      </AuthProvider>
    </>
    
  );
}
