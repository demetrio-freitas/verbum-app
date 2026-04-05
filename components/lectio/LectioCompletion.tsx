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
