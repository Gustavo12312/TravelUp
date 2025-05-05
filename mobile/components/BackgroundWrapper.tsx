import React, { ReactNode } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

type Props = {
  children: ReactNode;
};

const BackgroundWrapper = ({ children }: Props) => {
  return (
    <ImageBackground
      source={require('../assets/images/plane12.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
    {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      },
});

export default BackgroundWrapper;
