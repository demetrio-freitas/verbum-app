import { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Pressable, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/stores/useThemeStore';
import { useStreakStore } from '@/stores/useStreakStore';
import { useLectioStore } from '@/stores/useLectioStore';
import { mockLiturgyDay } from '@/lib/liturgy/mockData';
import { LectioEntry } from '@/components/lectio/LectioEntry';
import { LectioStep } from '@/components/lectio/LectioStep';
import { LectioCompletion } from '@/components/lectio/LectioCompletion';
import { LectioProgress } from '@/components/lectio/LectioProgress';
import { LectioTimer } from '@/components/lectio/LectioTimer';

type LectioPhase = 'entry' | 'lectio' | 'meditatio' | 'oratio' | 'contemplatio' | 'completion';

const STEP_PHASES: LectioPhase[] = ['lectio', 'meditatio', 'oratio', 'contemplatio'];

function getStepIndex(phase: LectioPhase): number {
  const idx = STEP_PHASES.indexOf(phase);
  return idx >= 0 ? idx : 0;
}

export default function LectioScreen() {
  const router = useRouter();
  const colors = useThemeStore((s) => s.colors);
  const fonts = useThemeStore((s) => s.fonts);
  const addEntry = useLectioStore((s) => s.addEntry);
  const getLectioStreak = useLectioStore((s) => s.getLectioStreak);
  const recordToday = useStreakStore((s) => s.recordToday);

  const [phase, setPhase] = useState<LectioPhase>('entry');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [meditatio, setMeditatio] = useState('');
  const [oratio, setOratio] = useState('');
  const [timerKey, setTimerKey] = useState(0);

  const gospel = useMemo(
    () =>
      mockLiturgyDay.readings.find((r) => r.isGospel) ??
      mockLiturgyDay.readings[mockLiturgyDay.readings.length - 1],
    []
  );

  const secondsPerStep = useMemo(() => (durationMinutes * 60) / 4, [durationMinutes]);

  // Wake lock during active steps
  useEffect(() => {
    if (phase !== 'entry' && phase !== 'completion') {
      activateKeepAwakeAsync();
      return () => {
        deactivateKeepAwake();
      };
    }
  }, [phase]);

  const hasNotes = meditatio.trim().length > 0 || oratio.trim().length > 0;

  const handleClose = useCallback(() => {
    if (hasNotes && phase !== 'entry' && phase !== 'completion') {
      Alert.alert('Deseja sair?', 'Suas anotações serão perdidas.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  }, [hasNotes, phase, router]);

  const handleStart = useCallback((minutes: number) => {
    setDurationMinutes(minutes);
    setPhase('lectio');
    setTimerKey((k) => k + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handleNextStep = useCallback(() => {
    const currentIdx = STEP_PHASES.indexOf(phase);
    if (currentIdx >= 0 && currentIdx < STEP_PHASES.length - 1) {
      setPhase(STEP_PHASES[currentIdx + 1]);
      setTimerKey((k) => k + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [phase]);

  const handleComplete = useCallback(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    addEntry({
      date: today,
      reference: gospel.reference,
      duration: durationMinutes,
      meditatio,
      oratio,
      completedAt: new Date().toISOString(),
    });
    recordToday();
    setPhase('completion');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [addEntry, gospel.reference, durationMinutes, meditatio, oratio, recordToday]);

  // Entry screen
  if (phase === 'entry') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 60, paddingBottom: 8 }}>
          <Pressable onPress={handleClose}>
            <MaterialIcons name="close" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>
        <LectioEntry gospel={gospel} onStart={handleStart} />
      </View>
    );
  }

  // Completion screen
  if (phase === 'completion') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <LectioCompletion
          durationMinutes={durationMinutes}
          lectioStreak={getLectioStreak()}
          reference={gospel.reference}
          onClose={() => router.back()}
        />
      </View>
    );
  }

  // Step screens (lectio, meditatio, oratio, contemplatio)
  const stepIndex = getStepIndex(phase);
  const isLastStep = phase === 'contemplatio';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: 60,
          paddingBottom: 8,
        }}
      >
        <Pressable onPress={handleClose}>
          <MaterialIcons name="close" size={24} color={colors.textPrimary} />
        </Pressable>
        <LectioTimer key={timerKey} totalSeconds={secondsPerStep} />
      </View>

      {/* Progress */}
      <View style={{ marginBottom: 16 }}>
        <LectioProgress currentStep={stepIndex} />
      </View>

      {/* Step content */}
      <LectioStep
        phase={phase as 'lectio' | 'meditatio' | 'oratio' | 'contemplatio'}
        gospel={gospel}
        verse={mockLiturgyDay.verse}
        meditatio={meditatio}
        oratio={oratio}
        onMeditatioChange={setMeditatio}
        onOratioChange={setOratio}
      />

      {/* Bottom action */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 40, alignItems: 'center' }}>
        <Pressable
          onPress={isLastStep ? handleComplete : handleNextStep}
          style={{
            backgroundColor: isLastStep ? colors.accentLight : colors.accent,
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 24,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 14, color: '#FAFAF7' }}>
            {isLastStep ? 'Concluir ✓' : 'Próxima etapa →'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
