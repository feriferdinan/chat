import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '../utils/theme';

const Button = ({ mode, style, children, labelStyle, ...props }) => (
  <PaperButton
    style={[
      styles.button,
      { backgroundColor: theme.colors.primary },
      mode === 'outlined' && { backgroundColor: theme.colors.surface },
      style,
    ]}
    labelStyle={[styles.text, !props.disabled && mode === 'outlined' && { color: theme.colors.primary }]}
    mode={mode}
    {...props}
  >
    {children}
  </PaperButton>
);

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
});

export default memo(Button);
