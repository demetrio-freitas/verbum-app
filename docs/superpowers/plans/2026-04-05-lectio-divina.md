# Lectio Divina Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a guided 4-step Lectio Divina prayer experience (Lectio, Meditatio, Oratio, Contemplatio) using the daily Gospel reading, accessible from the "Mais" menu.

**Architecture:** New route `app/lectio.tsx` orchestrates a state machine (`LectioPhase`) that renders 6 screens (entry, 4 steps, completion). A Zustand store (`useLectioStore`) persists the journal. Reuses existing patterns from `foco.tsx` (wake lock, full-screen) and `useStreakStore` (streak calculation).

**Tech Stack:** React Native, Expo Router, Zustand + AsyncStorage, expo-keep-awake, expo-haptics, React Native Animated API, date-fns.

**Spec:** `docs/superpowers/specs/2026-04-05-lectio-divina-design.md`

**Codebase root:** `/Users/demetriofreitas/verbum/`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `stores/useLectioStore.ts` | Create | Journal entries + streak calculation |
| `components/lectio/LectioProgress.tsx` | Create | 4-segment progress bar |
| `components/lectio/LectioTimer.tsx` | Create | Circular countdown timer |
| `components/lectio/LectioEntry.tsx` | Create | Entry screen — duration picker |
| `components/lectio/LectioStep.tsx` | Create | Renders each of the 4 steps |
| `components/lectio/LectioCompletion.tsx` | Create | Completion screen — stats + share |
| `app/lectio.tsx` | Create | Main route — state machine orchestrator |
| `app/(tabs)/mais.tsx` | Modify | Add "Lectio Divina" menu item |

---

## Chunk 1: Store + UI Primitives

### Task 1: Create useLectioStore

**Files:**
- Create: `stores/useLectioStore.ts`

- [ ] **Step 1: Create the store file**

```typescript
// stores/useLectioStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, subDays, differenceInCalendarDays } from 'date-fns';

export interface LectioEntry {
  id: string;
  date: string;
  reference: string;
  duration: number;
  meditatio: string;
  oratio: string;
  completedAt: string;
}

interface LectioState {
  entries: LectioEntry[];
  addEntry: (entry: Omit<LectioEntry, 'id'>) => void;
  getEntriesByDate: (date: string) => LectioEntry[];
  getLectioStreak: () => number;
}

export const useLectioStore = create<LectioState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const id = `${entry.date}-${Date.now()}`;
        set((state) => ({
          entries: [...state.entries, { ...entry, id }],
        }));
      },

      getEntriesByDate: (date) => {
        return get().entries.filter((e) => e.date === date);
      },

      getLectioStreak: () => {
        const { entries } = get();
        if (entries.length === 0) return 0;

        const uniqueDates = [...new Set(entries.map((e) => e.date))].sort().reverse();
        const today = format(new Date(), 'yyyy-MM-dd');
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

        if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;

        let streak = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
          const diff = differenceInCalendarDays(
            new Date(uniqueDates[i - 1]),
            new Date(uniqueDates[i])
          );
          if (diff === 1) streak++;
          else break;
        }
        return streak;
      },
    }),
    {
      name: 'verbum-lectio',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

- [ ] **Step 2: Verify file compiles**

Run: `cd /Users/demetriofreitas/verbum && npx tsc --noEmit stores/useLectioStore.ts 2>&1 | head -20`

If TypeScript is not configured for individual file checking, just verify no red squiggles in IDE or run full `npx tsc --noEmit`.

- [ ] **Step 3: Commit**

```bash
git add stores/useLectioStore.ts
git commit -m "feat(lectio): add useLectioStore with journal and streak"
```

---

### Task 2: Create LectioProgress component

**Files:**
- Create: `components/lectio/LectioProgress.tsx`

- [ ] **Step 1: Create the progress bar component**

```typescript
// components/lectio/LectioProgress.tsx
import { View } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';

interface LectioProgressProps {
  currentStep: number; // 0-3
}

const STEPS = 4;

export function LectioProgress({ currentStep }: LectioProgressProps) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 16 }}>
      {Array.from({ length: STEPS }).map((_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 2,
            backgroundColor:
              i < currentStep
                ? colors.accentLight
                : i === currentStep
                  ? colors.accent
                  : colors.bgElevated,
          }}
        />
      ))}
    </View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
mkdir -p components/lectio
git add components/lectio/LectioProgress.tsx
git commit -m "feat(lectio): add LectioProgress bar component"
```

---

### Task 3: Create LectioTimer component

**Files:**
- Create: `components/lectio/LectioTimer.tsx`

- [ ] **Step 1: Create the timer component**

```typescript
// components/lectio/LectioTimer.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '@/stores/useThemeStore';

interface LectioTimerProps {
  totalSeconds: number;
  onComplete?: () => void;
  variant?: 'inline' | 'circle';
}

export function LectioTimer({ totalSeconds, onComplete, variant = 'inline' }: LectioTimerProps) {
  const colors = useThemeStore((s) => s.colors);
  const fonts = useThemeStore((s) => s.fonts);
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    setRemaining(totalSeconds);
    completedRef.current = false;
  }, [totalSeconds]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (!completedRef.current) {
            completedRef.current = true;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onComplete?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalSeconds, onComplete]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const isComplete = remaining === 0;

  if (variant === 'circle') {
    return (
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          borderWidth: 3,
          borderColor: isComplete ? colors.accentLight : colors.accent,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: fonts.bodySemiBold,
            fontSize: 18,
            color: isComplete ? colors.accentLight : colors.accent,
          }}
        >
          {display}
        </Text>
      </View>
    );
  }

  return (
    <Text
      style={{
        fontFamily: fonts.body,
        fontSize: 12,
        color: isComplete ? colors.accentLight : colors.textTertiary,
      }}
    >
      {display}
    </Text>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/lectio/LectioTimer.tsx
git commit -m "feat(lectio): add LectioTimer with inline and circle variants"
```

---

## Chunk 2: Screen Components

### Task 4: Create LectioEntry component

**Files:**
- Create: `components/lectio/LectioEntry.tsx`

- [ ] **Step 1: Create the entry screen component**

```typescript
// components/lectio/LectioEntry.tsx
import { View, Text, Pressable } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import { Reading } from '@/lib/liturgy/mockData';

interface LectioEntryProps {
  gospel: Reading;
  onStart: (durationMinutes: number) => void;
}

const DURATIONS = [
  { label: '12 min', value: 12, sublabel: 'Rápida' },
  { label: '20 min', value: 20, sublabel: 'Padrão' },
  { label: '40 min', value: 40, sublabel: 'Profunda' },
];

export function LectioEntry({ gospel, onStart }: LectioEntryProps) {
  const colors = useThemeStore((s) => s.colors);
  const fonts = useThemeStore((s) => s.fonts);
  const [selected, setSelected] = useState(20);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
      <Text style={{ fontSize: 40, marginBottom: 16 }}>📖</Text>

      <Text
        style={{
          fontFamily: fonts.displayBold,
          fontSize: 26,
          color: colors.textPrimary,
          marginBottom: 4,
        }}
      >
        Lectio Divina
      </Text>

      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: 13,
          color: colors.textTertiary,
          marginBottom: 16,
        }}
      >
        Evangelho do dia — {gospel.reference}
      </Text>

      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: 13,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: 20,
          maxWidth: 240,
          marginBottom: 28,
        }}
      >
        Uma jornada contemplativa em 4 etapas com a Palavra de Deus
      </Text>

      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: 11,
          color: colors.textTertiary,
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 10,
        }}
      >
        Duração
      </Text>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 32 }}>
        {DURATIONS.map((d) => (
          <Pressable
            key={d.value}
            onPress={() => setSelected(d.value)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: selected === d.value ? colors.accent : colors.bgElevated,
              backgroundColor: selected === d.value ? colors.accentSoft : 'transparent',
            }}
          >
            <Text
              style={{
                fontFamily: fonts.bodySemiBold,
                fontSize: 13,
                color: selected === d.value ? colors.accent : colors.textSecondary,
              }}
            >
              {d.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => onStart(selected)}
        style={{
          backgroundColor: colors.accent,
          paddingVertical: 14,
          paddingHorizontal: 48,
          borderRadius: 28,
        }}
      >
        <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 15, color: '#FAFAF7' }}>
          Iniciar
        </Text>
      </Pressable>
    </View>
  );
}
```

**Note:** Add the missing `import { useState } from 'react';` at the top of the file.

- [ ] **Step 2: Commit**

```bash
git add components/lectio/LectioEntry.tsx
git commit -m "feat(lectio): add LectioEntry screen with duration picker"
```

---

### Task 5: Create LectioStep component

**Files:**
- Create: `components/lectio/LectioStep.tsx`

This is the core component — renders all 4 steps with different content based on the current phase.

- [ ] **Step 1: Create the step component**

```typescript
// components/lectio/LectioStep.tsx
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import { useThemeStore } from '@/stores/useThemeStore';
import { Reading, LiturgyDay } from '@/lib/liturgy/mockData';

type StepPhase = 'lectio' | 'meditatio' | 'oratio' | 'contemplatio';

interface LectioStepProps {
  phase: StepPhase;
  gospel: Reading;
  verse: LiturgyDay['verse'];
  meditatio: string;
  oratio: string;
  onMeditatioChange: (text: string) => void;
  onOratioChange: (text: string) => void;
}

const STEP_CONFIG: Record<StepPhase, { index: number; name: string; translation: string }> = {
  lectio: { index: 0, name: 'Lectio', translation: 'Leitura' },
  meditatio: { index: 1, name: 'Meditatio', translation: 'Meditação' },
  oratio: { index: 2, name: 'Oratio', translation: 'Oração' },
  contemplatio: { index: 3, name: 'Contemplatio', translation: 'Contemplação' },
};

export function LectioStep({
  phase,
  gospel,
  verse,
  meditatio,
  oratio,
  onMeditatioChange,
  onOratioChange,
}: LectioStepProps) {
  const colors = useThemeStore((s) => s.colors);
  const fonts = useThemeStore((s) => s.fonts);
  const config = STEP_CONFIG[phase];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step header */}
        <Text
          style={{
            fontFamily: fonts.bodySemiBold,
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 2,
            color: colors.accent,
            textAlign: 'center',
            marginBottom: 4,
          }}
        >
          Etapa {config.index + 1} de 4
        </Text>
        <Text
          style={{
            fontFamily: fonts.display,
            fontSize: 22,
            color: colors.textPrimary,
            textAlign: 'center',
            marginBottom: 2,
          }}
        >
          {config.name}
        </Text>
        <Text
          style={{
            fontFamily: fonts.body,
            fontSize: 12,
            color: colors.textTertiary,
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          {config.translation}
        </Text>

        {/* Step content */}
        {phase === 'lectio' && <LectioContent gospel={gospel} />}
        {phase === 'meditatio' && (
          <MeditatioContent verse={verse} text={meditatio} onChange={onMeditatioChange} />
        )}
        {phase === 'oratio' && <OratioContent text={oratio} onChange={onOratioChange} />}
        {phase === 'contemplatio' && <ContemplatioContent />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function LectioContent({ gospel }: { gospel: Reading }) {
  const colors = useThemeStore((s) => s.colors);
  const fonts = useThemeStore((s) => s.fonts);

  return (
    <>
      <View
        style={{
          backgroundColor: colors.accentSoft,
          borderRadius: 12,
          padding: 14,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center', lineHeight: 20 }}>
          Leia lentamente o Evangelho. Pare no trecho que tocar seu coração.
        </Text>
      </View>
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: 11,
          color: colors.textTertiary,
          textAlign: 'center',
          marginBottom: 12,
        }}
      >
        {gospel.reference}
      </Text>
      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: 20,
          lineHeight: 34,
          color: colors.textPrimary,
        }}
      >
        {gospel.text}
      </Text>
    </>
  );
}

function MeditatioContent({
  verse,
  text,
  onChange,
}: {
  verse: LiturgyDay['verse'];
  text: string;
  onChange: (t: string) => void;
}) {
  const colors = useThemeStore((s) => s.colors);
  const fonts = useThemeStore((s) => s.fonts);

  return (
    <>
      <View
        style={{
          backgroundColor: colors.accentSoft,
          borderRadius: 12,
          padding: 14,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center', lineHeight: 20 }}>
          O que Deus quer te dizer através desta passagem? Reflita em silêncio.
        </Text>
      </View>
      <View
        style={{
          backgroundColor: colors.accentGlow,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.bodySemiBold,
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: colors.accentLight,
            marginBottom: 8,
          }}
        >
          Trecho que te tocou
        </Text>
        <Text
          style={{
            fontFamily: fonts.display,
            fontSize: 17,
            color: colors.textPrimary,
            lineHeight: 26,
            fontStyle: 'italic',
          }}
        >
          {verse.text}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: 16,
          color: colors.textPrimary,
          textAlign: 'center',
          marginBottom: 12,
        }}
      >
        O que esta palavra desperta em você hoje?
      </Text>
      <TextInput
        value={text}
        onChangeText={onChange}
        placeholder="Toque para anotar sua reflexão..."
        placeholderTextColor={colors.textTertiary}
        multiline
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 12,
          fontFamily: fonts.body,
          fontSize: 14,
          color: colors.textPrimary,
          minHeight: 80,
          textAlignVertical: 'top',
          backgroundColor: colors.bgCard,
        }}
      />
    </>
  );
}

function OratioContent({
  text,
  onChange,
}: {
  text: string;
  onChange: (t: string) => void;
}) {
  const colors = useThemeStore((s) => s.colors);
  const fonts = useThemeStore((s) => s.fonts);

  return (
    <>
      <View
        style={{
          backgroundColor: colors.accentSoft,
          borderRadius: 12,
          padding: 14,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center', lineHeight: 20 }}>
          Fale com Deus sobre o que meditou. Entregue seus pensamentos e sentimentos.
        </Text>
      </View>
      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: 18,
          color: colors.textPrimary,
          textAlign: 'center',
          lineHeight: 28,
          marginBottom: 20,
        }}
      >
        Senhor, o que queres de mim{'\n'}através desta Palavra?
      </Text>
      <TextInput
        value={text}
        onChangeText={onChange}
        placeholder="Sua oração pessoal..."
        placeholderTextColor={colors.textTertiary}
        multiline
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 12,
          fontFamily: fonts.body,
          fontSize: 14,
          color: colors.textPrimary,
          minHeight: 80,
          textAlignVertical: 'top',
          backgroundColor: colors.bgCard,
        }}
      />
    </>
  );
}

function ContemplatioContent() {
  const colors = useThemeStore((s) => s.colors);
  const fonts = useThemeStore((s) => s.fonts);
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
      <Animated.View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: colors.accentLight,
          opacity: pulseAnim,
          marginBottom: 32,
        }}
      />
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: 16,
          color: colors.textTertiary,
          textAlign: 'center',
          lineHeight: 26,
        }}
      >
        Descanse na presença de Deus.{'\n'}
        Não é preciso pensar nem falar.{'\n'}
        Apenas esteja.
      </Text>
      <Animated.View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: colors.accentLight,
          opacity: pulseAnim,
          marginTop: 32,
        }}
      />
    </View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/lectio/LectioStep.tsx
git commit -m "feat(lectio): add LectioStep with all 4 phase renderers"
```

---

### Task 6: Create LectioCompletion component

**Files:**
- Create: `components/lectio/LectioCompletion.tsx`

- [ ] **Step 1: Create the completion screen**

```typescript
// components/lectio/LectioCompletion.tsx
import { View, Text, Pressable, Share } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';

interface LectioCompletionProps {
  durationMinutes: number;
  lectioStreak: number;
  reference: string;
  onClose: () => void;
}

export function LectioCompletion({
  durationMinutes,
  lectioStreak,
  reference,
  onClose,
}: LectioCompletionProps) {
  const colors = useThemeStore((s) => s.colors);
  const fonts = useThemeStore((s) => s.fonts);

  const handleShare = async () => {
    await Share.share({
      message: `Hoje fiz Lectio Divina com ${reference} no Verbum. ${durationMinutes} minutos com a Palavra de Deus.`,
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
      <Text style={{ fontSize: 48, marginBottom: 20 }}>🕊️</Text>

      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: 24,
          color: colors.textPrimary,
          marginBottom: 8,
        }}
      >
        Lectio Completa
      </Text>

      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: 13,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: 20,
          marginBottom: 24,
        }}
      >
        Que a Palavra de hoje{'\n'}permaneça no seu coração.
      </Text>

      <View style={{ flexDirection: 'row', gap: 32, marginBottom: 32 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 22, color: colors.accent }}>
            {durationMinutes}
          </Text>
          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: 10,
              color: colors.textTertiary,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            minutos
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 22, color: colors.accent }}>
            {lectioStreak}
          </Text>
          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: 10,
              color: colors.textTertiary,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            dias seguidos
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Pressable
          onPress={onClose}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 20,
            borderWidth: 1.5,
            borderColor: colors.bgElevated,
          }}
        >
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textSecondary }}>
            Voltar
          </Text>
        </Pressable>
        <Pressable
          onPress={handleShare}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 20,
            backgroundColor: colors.accent,
          }}
        >
          <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 13, color: '#FAFAF7' }}>
            Compartilhar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/lectio/LectioCompletion.tsx
git commit -m "feat(lectio): add LectioCompletion screen with stats and share"
```

---

## Chunk 3: Main Route + Menu Integration

### Task 7: Create app/lectio.tsx — main orchestrator

**Files:**
- Create: `app/lectio.tsx`

This is the central file that wires everything together. It manages the session state machine and renders the appropriate component for each phase.

- [ ] **Step 1: Create the main route**

```typescript
// app/lectio.tsx
import { useState, useCallback, useMemo } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useEffect } from 'react';
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

  // Wake lock
  useEffect(() => {
    if (phase !== 'entry' && phase !== 'completion') {
      activateKeepAwakeAsync();
      return () => { deactivateKeepAwake(); };
    }
  }, [phase]);

  const hasNotes = meditatio.trim().length > 0 || oratio.trim().length > 0;

  const handleClose = useCallback(() => {
    if (hasNotes && phase !== 'entry' && phase !== 'completion') {
      Alert.alert(
        'Deseja sair?',
        'Suas anotações serão perdidas.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sair', style: 'destructive', onPress: () => router.back() },
        ]
      );
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
    const currentIdx = STEP_PHASES.indexOf(phase as any);
    if (currentIdx < STEP_PHASES.length - 1) {
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
```

- [ ] **Step 2: Commit**

```bash
git add app/lectio.tsx
git commit -m "feat(lectio): add main Lectio Divina route with state machine"
```

---

### Task 8: Add Lectio Divina to "Mais" menu

**Files:**
- Modify: `app/(tabs)/mais.tsx:13` — insert new menu item after Novenas

- [ ] **Step 1: Add menu item**

In `app/(tabs)/mais.tsx`, insert a new item in the `MENU_ITEMS` array after the Novenas entry (line 14) and before Paróquia (line 15):

```typescript
// Add after { icon: 'hourglass-top', label: 'Novenas', route: '/novena/espirito-santo' },
{ icon: 'menu-book', label: 'Lectio Divina', route: '/lectio' },
```

The full `MENU_ITEMS` array should become:

```typescript
const MENU_ITEMS: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  route: string;
}[] = [
  { icon: 'edit-note', label: 'Notas', route: '/notes' },
  { icon: 'bookmark', label: 'Salvos', route: '/saved' },
  { icon: 'hourglass-top', label: 'Novenas', route: '/novena/espirito-santo' },
  { icon: 'menu-book', label: 'Lectio Divina', route: '/lectio' },
  { icon: 'church', label: 'Paróquia', route: '/paroquia' },
  { icon: 'calendar-month', label: 'Calendário', route: '/calendario' },
  { icon: 'settings', label: 'Configurações', route: '/settings' },
];
```

- [ ] **Step 2: Test navigation**

Run the app: `cd /Users/demetriofreitas/verbum && npx expo start`

Verify:
1. "Lectio Divina" appears in the Mais menu grid between Novenas and Paróquia
2. Tapping it navigates to the entry screen
3. Selecting a duration and tapping "Iniciar" starts the Lectio flow
4. All 4 steps render correctly with timer
5. Completion screen shows stats
6. Share button opens native share sheet
7. Close (X) button with notes shows confirmation alert
8. Close (X) button without notes goes back directly

- [ ] **Step 3: Commit**

```bash
git add app/(tabs)/mais.tsx
git commit -m "feat(lectio): add Lectio Divina to Mais menu"
```

---

## Summary

| Task | Files | Description |
|---|---|---|
| 1 | `stores/useLectioStore.ts` | Zustand store with journal + streak |
| 2 | `components/lectio/LectioProgress.tsx` | 4-segment progress bar |
| 3 | `components/lectio/LectioTimer.tsx` | Countdown timer (inline + circle) |
| 4 | `components/lectio/LectioEntry.tsx` | Entry screen with duration picker |
| 5 | `components/lectio/LectioStep.tsx` | All 4 step renderers |
| 6 | `components/lectio/LectioCompletion.tsx` | Completion with stats + share |
| 7 | `app/lectio.tsx` | Main orchestrator route |
| 8 | `app/(tabs)/mais.tsx` | Menu integration |

**Total: 7 new files, 1 modified file, 0 new dependencies.**
