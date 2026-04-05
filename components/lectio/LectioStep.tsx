import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import { useThemeStore } from '@/stores/useThemeStore';
import type { Reading, LiturgyDay } from '@/lib/liturgy/mockData';

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
        <Text
          style={{
            fontFamily: fonts.body,
            fontSize: 13,
            color: colors.textSecondary,
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: 20,
          }}
        >
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
        <Text
          style={{
            fontFamily: fonts.body,
            fontSize: 13,
            color: colors.textSecondary,
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: 20,
          }}
        >
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
        <Text
          style={{
            fontFamily: fonts.body,
            fontSize: 13,
            color: colors.textSecondary,
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: 20,
          }}
        >
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
