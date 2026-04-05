import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import { Reading } from '@/lib/liturgy/mockData';

interface LectioEntryProps {
  gospel: Reading;
  onStart: (durationMinutes: number) => void;
}

const DURATIONS = [
  { label: '12 min', value: 12 },
  { label: '20 min', value: 20 },
  { label: '40 min', value: 40 },
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
