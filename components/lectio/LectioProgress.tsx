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
