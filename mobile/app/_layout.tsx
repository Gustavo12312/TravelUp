import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import CustomDrawerContent from '../components/CustomDrawer';
import { isAuth } from '../utils/auth.utils';
import { AuthProvider, useAuth } from '../utils/auth.context'; 
import Toast from 'react-native-toast-message';

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
    if (!isReady) return;

    if (!authenticated) {
      router.replace('/login');
    } else if (authenticated) {
      router.replace('/Homepage');
    }
  }, [isReady, authenticated]);

  if (!isReady) {
    return null; 
  }

  return (
    <>
      <AuthProvider>
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{          
            drawerStyle: { backgroundColor: '#1E1E2F' },
            drawerLabelStyle: { color: '#fff' },
            headerStyle: {
              backgroundColor: '#1E1E2F',
              //#EAF4FB
            },
            headerShadowVisible: false,
            headerTintColor: '#fff',
          }}
        >
          <Drawer.Screen
            name="Homepage"
            options={{ title: "Dashboard"}}
          />
          <Drawer.Screen
            name="Request/RequestList"
            options={{ title: "Requests"}}
          />
          <Drawer.Screen
            name="Request/RequestEdit"
            options={{ drawerItemStyle: { display: 'none' }, title: "Request Edit" }}
          />
           <Drawer.Screen
            name="Request/RequestAdd"
            options={{ drawerItemStyle: { display: 'none' }, title: "Request Create" }}
          />
          <Drawer.Screen
            name="login"
            options={{ drawerItemStyle: { display: 'none' }, headerShown: false }}
          />
           <Drawer.Screen
            name="register"
            options={{ drawerItemStyle: { display: 'none' }, headerShown: false  }}
          />
          <Drawer.Screen
            name="+not-found"
            options={{ drawerItemStyle: { display: 'none' } }}
          />
           <Drawer.Screen
            name="QuoteFlight/FlightAdd"
            options={{ drawerItemStyle: { display: 'none' } }}
          />
           <Drawer.Screen
            name="QuoteFlight/FlightEdit"
            options={{ drawerItemStyle: { display: 'none' } }}
          />
           <Drawer.Screen
            name="QuoteFlight/FlightList"
            options={{ drawerItemStyle: { display: 'none' } }}
          />
           <Drawer.Screen
            name="QuoteHotel/QuoteHotelAdd"
            options={{ drawerItemStyle: { display: 'none' } }}
          />
           <Drawer.Screen
            name="QuoteHotel/QuoteHotelList"
            options={{ drawerItemStyle: { display: 'none' } }}
          />
           <Drawer.Screen
            name="QuoteHotel/QuoteHotelEdit"
            options={{ drawerItemStyle: { display: 'none' } }}
          />
          <Drawer.Screen
            name="Detail/DetailEdit"
            options={{ drawerItemStyle: { display: 'none' }, title: "Personal Detail" }}
          />
          
        </Drawer>
        <Toast />     
      <StatusBar style="light" />
      </AuthProvider>
    </>
    
  );
}
