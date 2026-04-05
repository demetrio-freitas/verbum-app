import { useState, useEffect, useRef } from 'react';
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
