import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { api } from '../services/api';
import type { Ticket } from '../types';

/**
 * F013 — Simulated staff-facing QR ticket scanning / validation at entry.
 */
export function StaffScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [lastResult, setLastResult] = useState<{
    valid: boolean;
    message: string;
    ticket?: Ticket;
  } | null>(null);

  const isWeb = Platform.OS === 'web';

  const validate = async (qrPayload: string) => {
    if (!qrPayload.trim() || busy) return;
    setBusy(true);
    setScanning(false);
    try {
      const result = await api.validateTicket(qrPayload.trim());
      setLastResult({
        valid: result.valid,
        message: result.message ?? result.error ?? (result.valid ? 'Valid' : 'Invalid'),
        ticket: result.ticket,
      });
      Alert.alert(
        result.valid ? 'Entry granted' : 'Entry denied',
        result.message ?? result.error ?? '',
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Validation failed';
      setLastResult({ valid: false, message });
      Alert.alert('Entry denied', message);
    } finally {
      setBusy(false);
    }
  };

  const onBarcode = (result: BarcodeScanningResult) => {
    if (!scanning || busy) return;
    if (result.data) {
      validate(result.data);
    }
  };

  if (!isWeb && !permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#1B5E20" />
      </View>
    );
  }

  if (!isWeb && permission && !permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permTitle}>Camera access needed</Text>
        <Text style={styles.permBody}>
          Staff scanning requires camera permission to read ticket QR codes.
        </Text>
        <Pressable style={styles.primaryBtn} onPress={requestPermission}>
          <Text style={styles.primaryText}>Grant camera permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Staff Entry Scan</Text>
      <Text style={styles.subtitle}>
        {isWeb
          ? 'Web preview — paste a QR payload from the Tickets wallet'
          : 'Scan a wallet QR or enter the payload manually'}
      </Text>

      {!isWeb && (
        <View style={styles.cameraWrap}>
          {scanning ? (
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={onBarcode}
            />
          ) : (
            <View style={styles.paused}>
              <Text style={styles.pausedText}>Scanner paused</Text>
              <Pressable
                style={styles.primaryBtn}
                onPress={() => {
                  setLastResult(null);
                  setScanning(true);
                }}
              >
                <Text style={styles.primaryText}>Scan next ticket</Text>
              </Pressable>
            </View>
          )}
          {busy && (
            <View style={styles.busyOverlay}>
              <ActivityIndicator color="#fff" size="large" />
            </View>
          )}
        </View>
      )}

      <View style={styles.manual}>
        <Text style={styles.label}>Manual QR payload</Text>
        <TextInput
          style={styles.input}
          placeholder="ZOO-TICKET:..."
          value={manualCode}
          onChangeText={setManualCode}
          autoCapitalize="none"
        />
        <Pressable
          style={styles.primaryBtn}
          onPress={() => validate(manualCode)}
          disabled={busy}
        >
          <Text style={styles.primaryText}>{busy ? 'Validating…' : 'Validate'}</Text>
        </Pressable>
      </View>

      {lastResult && (
        <View style={[styles.result, lastResult.valid ? styles.ok : styles.bad]}>
          <Text style={styles.resultTitle}>
            {lastResult.valid ? 'VALID' : 'INVALID'}
          </Text>
          <Text style={styles.resultMsg}>{lastResult.message}</Text>
          {lastResult.ticket && (
            <Text style={styles.resultMeta}>
              {lastResult.ticket.visitorName} · {lastResult.ticket.type} ·{' '}
              {lastResult.ticket.status}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', padding: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '800', color: '#1B5E20' },
  subtitle: { fontSize: 13, color: '#666', marginBottom: 12, marginTop: 2 },
  cameraWrap: {
    height: 280,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: { flex: 1 },
  paused: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#263238',
    gap: 12,
  },
  pausedText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  busyOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  manual: { marginTop: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  primaryBtn: {
    backgroundColor: '#1B5E20',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  permTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  permBody: { textAlign: 'center', color: '#666', marginBottom: 16 },
  result: {
    marginTop: 16,
    borderRadius: 10,
    padding: 14,
  },
  ok: { backgroundColor: '#E8F5E9' },
  bad: { backgroundColor: '#FFEBEE' },
  resultTitle: { fontWeight: '800', fontSize: 16, marginBottom: 4 },
  resultMsg: { fontSize: 14, color: '#333' },
  resultMeta: { fontSize: 12, color: '#666', marginTop: 6 },
});
