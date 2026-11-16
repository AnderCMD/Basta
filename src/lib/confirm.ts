import { Alert, Platform } from 'react-native';

/** Confirmación nativa (Alert) con respaldo para web. */
export function confirmAction(title: string, message: string, onYes: () => void, yesLabel = 'Sí') {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${title}\n\n${message}`)) onYes();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: yesLabel, style: 'destructive', onPress: onYes },
  ]);
}
