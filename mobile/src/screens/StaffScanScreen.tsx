import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { api } from '../services/api';
import type { Ticket } from '../types';
import { Button } from '../components/ui/Button';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { PageContainer } from '../components/ui/PageContainer';
import { Toast } from '../components/ui/Toast';
import { colors, radii, spacing, typography } from '../theme';

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
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    tone: 'success' | 'error' | 'info';
  }>({ visible: false, message: '', tone: 'info' });

  const isWeb = Platform.OS === 'web';
  const scanLine = useSharedValue(0);
  const flash = useSharedValue(0);

  useEffect(() => {
    if (!scanning || isWeb) return;
    scanLine.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [scanning, isWeb, scanLine]);

  const scanLineStyle = useAnimatedStyle(() => ({
    top: `${8 + scanLine.value * 76}%`,
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flash.value,
  }));

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
      flash.value = withSequence(
        withTiming(0.55, { duration: 120 }),
        withTiming(0, { duration: 280 }),
      );
      if (result.valid) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setToast({ visible: true, message: 'Entry granted', tone: 'success' });
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setToast({
          visible: true,
          message: result.error ?? 'Entry denied',
          tone: 'error',
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Validation failed';
      setLastResult({ valid: false, message });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setToast({ visible: true, message, tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const onBarcode = (result: BarcodeScanningResult) => {
    if (!scanning || busy) return;
    if (result.data) validate(result.data);
  };

  if (!isWeb && !permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!isWeb && permission && !permission.granted) {
    return (
      <View style={styles.centered}>
        <Ionicons name="camera-outline" size={40} color={colors.primary} />
        <Text style={styles.permTitle}>Camera access needed</Text>
        <Text style={styles.permBody}>
          Staff scanning requires camera permission to read ticket QR codes.
        </Text>
        <Button label="Grant camera permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <PageContainer maxWidth={720}>
      <View style={styles.container}>
        <ScreenHeader
          title="Staff Entry Scan"
          subtitle={
            isWeb
              ? 'Paste a QR payload from the Tickets wallet'
              : 'Align the QR inside the frame to validate entry'
          }
        />

        {!isWeb && (
          <View style={styles.cameraWrap}>
            {scanning ? (
              <>
                <CameraView
                  style={styles.camera}
                  facing="back"
                  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                  onBarcodeScanned={onBarcode}
                />
                <View style={styles.reticle} pointerEvents="none">
                  <View style={[styles.corner, styles.tl]} />
                  <View style={[styles.corner, styles.tr]} />
                  <View style={[styles.corner, styles.bl]} />
                  <View style={[styles.corner, styles.br]} />
                  <Animated.View style={[styles.scanLine, scanLineStyle]} />
                </View>
              </>
            ) : (
              <View style={styles.paused}>
                <Ionicons name="checkmark-done-outline" size={36} color={colors.white} />
                <Text style={styles.pausedText}>Scanner paused</Text>
                <Button
                  label="Scan next ticket"
                  onPress={() => {
                    setLastResult(null);
                    setScanning(true);
                  }}
                  style={styles.resumeBtn}
                />
              </View>
            )}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.flash,
                flashStyle,
                {
                  backgroundColor: lastResult?.valid ? colors.success : colors.danger,
                },
              ]}
            />
            {busy && (
              <View style={styles.busyOverlay}>
                <ActivityIndicator color={colors.white} size="large" />
              </View>
            )}
          </View>
        )}

        <View style={styles.manual}>
          <Text style={styles.label}>Manual QR payload</Text>
          <TextInput
            style={styles.input}
            placeholder="ZOO-TICKET:..."
            placeholderTextColor={colors.textMuted}
            value={manualCode}
            onChangeText={setManualCode}
            autoCapitalize="none"
          />
          <Button
            label={busy ? 'Validating…' : 'Validate'}
            onPress={() => validate(manualCode)}
            loading={busy}
            disabled={busy}
          />
        </View>

        {lastResult && (
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={[styles.result, lastResult.valid ? styles.ok : styles.bad]}
          >
            <Text style={styles.resultTitle}>{lastResult.valid ? 'VALID' : 'INVALID'}</Text>
            <Text style={styles.resultMsg}>{lastResult.message}</Text>
            {lastResult.ticket && (
              <Text style={styles.resultMeta}>
                {lastResult.ticket.visitorName} · {lastResult.ticket.type} ·{' '}
                {lastResult.ticket.status}
              </Text>
            )}
          </MotiView>
        )}

        <Toast
          visible={toast.visible}
          message={toast.message}
          tone={toast.tone}
          onHide={() => setToast((t) => ({ ...t, visible: false }))}
        />
      </View>
    </PageContainer>
  );
}

const CORNER = 22;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  cameraWrap: {
    height: 300,
    marginHorizontal: spacing.lg,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: { flex: 1 },
  reticle: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: colors.accent,
  },
  tl: { top: '12%', left: '14%', borderTopWidth: 3, borderLeftWidth: 3 },
  tr: { top: '12%', right: '14%', borderTopWidth: 3, borderRightWidth: 3 },
  bl: { bottom: '12%', left: '14%', borderBottomWidth: 3, borderLeftWidth: 3 },
  br: { bottom: '12%', right: '14%', borderBottomWidth: 3, borderRightWidth: 3 },
  scanLine: {
    position: 'absolute',
    left: '16%',
    right: '16%',
    height: 2,
    backgroundColor: colors.accent,
    opacity: 0.9,
  },
  flash: {
    ...StyleSheet.absoluteFill,
  },
  paused: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#263238',
    gap: spacing.md,
    padding: spacing.lg,
  },
  pausedText: {
    color: colors.white,
    fontFamily: typography.section.fontFamily,
    fontSize: 16,
  },
  resumeBtn: { minWidth: 180 },
  busyOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  manual: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    fontFamily: typography.body.fontFamily,
    color: colors.text,
  },
  permTitle: {
    ...typography.section,
    marginTop: spacing.sm,
  },
  permBody: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  result: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  ok: { backgroundColor: colors.successSoft },
  bad: { backgroundColor: colors.dangerSoft },
  resultTitle: {
    fontFamily: typography.section.fontFamily,
    fontSize: 16,
    marginBottom: 4,
  },
  resultMsg: { ...typography.body },
  resultMeta: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
});
