import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '@/stores/useThemeStore';

/* ═══════════════════════════════════════════
   DATA — Catecismo structure
   ═══════════════════════════════════════════ */

const PARTS = [
  {
    number: 1,
    title: 'A Profissão de Fé',
    range: '§1-1065',
    meta: '3 seções · ~370 páginas',
    desc: 'O Credo: Creio em Deus Pai, em Jesus Cristo e no Espírito Santo.',
    icon: 'verified' as const,
    colorKey: 'accent' as const,
  },
  {
    number: 2,
    title: 'A Celebração do Mistério Cristão',
    range: '§1066-1690',
    meta: '2 seções · ~220 páginas',
    desc: 'Os 7 Sacramentos: Batismo, Confirmação, Eucaristia, Penitência, Unção, Ordem e Matrimônio.',
    icon: 'water-drop' as const,
    colorKey: 'blue' as const,
  },
  {
    number: 3,
    title: 'A Vida em Cristo',
    range: '§1691-2557',
    meta: '2 seções · ~300 páginas',
    desc: 'Dignidade, vocação e os Dez Mandamentos detalhados.',
    icon: 'volunteer-activism' as const,
    colorKey: 'green' as const,
  },
  {
    number: 4,
    title: 'A Oração Cristã',
    range: '§2558-2865',
    meta: '2 seções · ~110 páginas',
    desc: 'A oração na vida cristã e o Pai Nosso explicado linha por linha.',
    icon: 'self-improvement' as const,
    colorKey: 'purple' as const,
  },
];

const SHORTCUTS = ['Sacramentos', 'Mandamentos', 'Pai Nosso', 'Eucaristia', 'Confissão', 'Matrimônio'];

const STUDY_PLANS = [
  { id: 'introducao', title: 'Introdução ao Catecismo', meta: '7 dias · ~10 min/dia', icon: 'school' as const, free: true },
  { id: '1ano', title: 'Catecismo em 1 Ano', meta: '365 dias · ~8 parágrafos/dia', icon: 'calendar-month' as const, free: false },
  { id: 'sacramentos', title: 'Os 7 Sacramentos', meta: '30 dias · 4 dias por sacramento', icon: 'water-drop' as const, free: false },
  { id: 'mandamentos', title: 'Os 10 Mandamentos', meta: '40 dias · Com exame de consciência', icon: 'balance' as const, free: false },
  { id: 'oracao', title: 'A Oração Cristã', meta: '21 dias · Pai Nosso linha por linha', icon: 'self-improvement' as const, free: false },
  { id: 'catequese', title: 'Preparação para Catequese', meta: '60 dias · Para catequistas', icon: 'group' as const, free: false },
];

// Pergunta do Dia (Compêndio mock)
const DAILY_QUESTION = {
  question: 'O que é a Eucaristia?',
  answer:
    'A Eucaristia é o próprio sacrifício do Corpo e do Sangue do Senhor Jesus, que Ele instituiu para perpetuar pelos séculos o sacrifício da Cruz, confiando assim à Igreja o memorial da sua Morte e Ressurreição.',
  ref: 'Compêndio §271 · Catecismo §1322-1332',
};

/* ═══════════════════════════════════════════
   COLOR HELPERS
   ═══════════════════════════════════════════ */

const PART_COLORS: Record<string, { bg: string; fg: string }> = {
  accent: { bg: 'rgba(120,53,15,0.06)', fg: '#78350F' },
  blue: { bg: 'rgba(37,99,235,0.08)', fg: '#2563EB' },
  green: { bg: 'rgba(22,163,74,0.08)', fg: '#16A34A' },
  purple: { bg: 'rgba(124,58,237,0.08)', fg: '#7C3AED' },
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function CatecismoScreen() {
  const router = useRouter();
  const colors = useThemeStore((s) => s.colors);
  const fonts = useThemeStore((s) => s.fonts);

  const [searchQuery, setSearchQuery] = useState('');
  const [answerVisible, setAnswerVisible] = useState(false);

  const isSearching = searchQuery.length > 2;

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Pressable onPress={handleBack} style={{ marginRight: 12 }}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.displayBold, fontSize: 22, color: colors.textPrimary }}>
            Catecismo
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textTertiary, marginTop: 1 }}>
            Igreja Católica · 2.865 parágrafos
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search */}
        <View style={{ paddingHorizontal: 20, marginTop: 12, marginBottom: 8 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.bgElevated,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              paddingHorizontal: 14,
            }}
          >
            <MaterialIcons name="search" size={20} color={colors.textTertiary} />
            <TextInput
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 10,
                fontFamily: fonts.body,
                fontSize: 14,
                color: colors.textPrimary,
              }}
              placeholder="Buscar tema, palavra ou §parágrafo..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={18} color={colors.textTertiary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Search Results (placeholder) */}
        {isSearching && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <MaterialIcons name="search" size={40} color={colors.textTertiary} />
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: 14,
                color: colors.textTertiary,
                marginTop: 8,
                textAlign: 'center',
              }}
            >
              Busca disponível com o Catecismo completo
            </Text>
          </View>
        )}

        {/* Main content (hidden while searching) */}
        {!isSearching && (
          <>
            {/* ── Pergunta do Dia ── */}
            <Pressable
              onPress={() => setAnswerVisible(!answerVisible)}
              style={{
                margin: 20,
                marginBottom: 12,
                padding: 20,
                backgroundColor: colors.bgCard,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {/* Badge */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: colors.accentSoft,
                  alignSelf: 'flex-start',
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 20,
                  marginBottom: 12,
                }}
              >
                <MaterialIcons name="lightbulb" size={14} color={colors.accent} />
                <Text
                  style={{
                    fontFamily: fonts.bodySemiBold,
                    fontSize: 11,
                    color: colors.accent,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Pergunta do dia
                </Text>
              </View>

              {/* Question */}
              <Text
                style={{
                  fontFamily: fonts.display,
                  fontSize: 22,
                  fontStyle: 'italic',
                  color: colors.textPrimary,
                  lineHeight: 30,
                  marginBottom: 12,
                }}
              >
                "{DAILY_QUESTION.question}"
              </Text>

              {/* Toggle */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.accent }}>
                  {answerVisible ? 'Ocultar resposta' : 'Ver resposta'}
                </Text>
                <MaterialIcons
                  name={answerVisible ? 'expand-less' : 'expand-more'}
                  size={16}
                  color={colors.accent}
                />
              </View>

              {/* Answer */}
              {answerVisible && (
                <View
                  style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 17,
                      lineHeight: 28,
                      color: colors.textPrimary,
                      marginBottom: 12,
                    }}
                  >
                    {DAILY_QUESTION.answer}
                  </Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textTertiary }}>
                    {DAILY_QUESTION.ref}
                  </Text>
                </View>
              )}
            </Pressable>

            {/* ── Deep link litúrgico ── */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/catecismo/leitura',
                  params: { title: 'A Ressurreição de Cristo', range: '§638-658', part: 'Parte 1' },
                } as any)
              }
              style={{
                marginHorizontal: 20,
                marginBottom: 20,
                padding: 14,
                backgroundColor: colors.accentSoft,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.accentGlow,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.accentGlow,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialIcons name="auto-stories" size={18} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.textPrimary }}>
                  O que a Igreja ensina sobre a Ressurreição?
                </Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                  Evangelho de hoje → CIC §638-658
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={18} color={colors.accent} />
            </Pressable>

            {/* ── As 4 Partes ── */}
            <SectionTitle fonts={fonts} colors={colors} text="As 4 Partes" />

            {PARTS.map((part) => {
              const partColor = PART_COLORS[part.colorKey];
              return (
                <Pressable
                  key={part.number}
                  onPress={() => router.push(`/catecismo/${part.number}` as any)}
                  style={{
                    marginHorizontal: 20,
                    marginBottom: 12,
                    padding: 18,
                    backgroundColor: colors.bgCard,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                    {/* Icon */}
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: partColor.bg,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <MaterialIcons name={part.icon} size={22} color={partColor.fg} />
                    </View>

                    {/* Info */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: fonts.bodySemiBold,
                          fontSize: 11,
                          color: colors.textTertiary,
                          textTransform: 'uppercase',
                          letterSpacing: 0.8,
                          marginBottom: 3,
                        }}
                      >
                        Parte {part.number}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.displayBold,
                          fontSize: 19,
                          color: colors.textPrimary,
                          lineHeight: 24,
                          marginBottom: 4,
                        }}
                      >
                        {part.title}
                      </Text>
                      <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textTertiary }}>
                        {part.range} · {part.meta}
                      </Text>
                    </View>

                    {/* Arrow */}
                    <MaterialIcons name="chevron-right" size={20} color={colors.textTertiary} style={{ marginTop: 4 }} />
                  </View>

                  {/* Description */}
                  <Text
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 13,
                      lineHeight: 20,
                      color: colors.textSecondary,
                      marginTop: 10,
                    }}
                  >
                    {part.desc}
                  </Text>
                </Pressable>
              );
            })}

            {/* ── Atalhos Populares ── */}
            <SectionTitle fonts={fonts} colors={colors} text="Atalhos populares" style={{ marginTop: 12 }} />

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, marginBottom: 20 }}>
              {SHORTCUTS.map((label) => (
                <Pressable
                  key={label}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    backgroundColor: colors.bgElevated,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textSecondary }}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* ── Planos de Estudo ── */}
            <SectionTitle fonts={fonts} colors={colors} text="Planos de estudo" />

            {STUDY_PLANS.map((plan) => (
              <Pressable
                key={plan.id}
                onPress={() => router.push(`/catecismo/plano/${plan.id}` as any)}
                style={{
                  marginHorizontal: 20,
                  marginBottom: 10,
                  padding: 16,
                  backgroundColor: colors.bgCard,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                {/* Icon */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: colors.accentSoft,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <MaterialIcons name={plan.icon} size={20} color={colors.accent} />
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.textPrimary }}>
                    {plan.title}
                  </Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textTertiary, marginTop: 2 }}>
                    {plan.meta}
                  </Text>
                </View>

                {/* Badge */}
                {plan.free ? (
                  <View
                    style={{
                      paddingVertical: 3,
                      paddingHorizontal: 8,
                      backgroundColor: 'rgba(22,163,74,0.08)',
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 10, color: '#16A34A', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Grátis
                    </Text>
                  </View>
                ) : (
                  <MaterialIcons name="lock" size={16} color={colors.textTertiary} />
                )}
              </Pressable>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ═══════════════════════════════════════════
   SECTION TITLE — small reusable piece
   ═══════════════════════════════════════════ */

function SectionTitle({
  text,
  fonts,
  colors,
  style,
}: {
  text: string;
  fonts: ReturnType<typeof useThemeStore>['fonts'];
  colors: ReturnType<typeof useThemeStore>['colors'];
  style?: object;
}) {
  return (
    <Text
      style={[
        {
          paddingHorizontal: 20,
          marginTop: 8,
          marginBottom: 12,
          fontFamily: fonts.bodySemiBold,
          fontSize: 13,
          color: colors.textTertiary,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
        },
        style,
      ]}
    >
      {text}
    </Text>
  );
}
