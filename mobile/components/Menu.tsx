import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';

export default function Menu() {
  const navigation = useNavigation();

  return (
    <Pressable onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
      <Ionicons name="menu" size={24} color="white" />
    </Pressable>
  );
}
