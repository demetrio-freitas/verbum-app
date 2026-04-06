import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '@/stores/useThemeStore';

/* ═══════════════════════════════════════════
   MOCK DATA — Eucaristia §1322-1325
   Será substituído por JSON do Vatican.va
   ═══════════════════════════════════════════ */

const MOCK_PARAGRAPHS = [
  {
    number: 1322,
    text: 'A santa Eucaristia conclui a iniciação cristã. Os que foram elevados à dignidade do sacerdócio régio pelo Batismo e configurados mais profundamente a Cristo pela Confirmação participam, por meio da Eucaristia, com toda a comunidade, do próprio sacrifício do Senhor.',
  },
  {
    number: 1323,
    text: '"O nosso Salvador instituiu na última Ceia, na noite em que foi entregue, o Sacrifício Eucarístico do seu Corpo e do seu Sangue para perpetuar pelos séculos, até Ele voltar, o Sacrifício da Cruz, e para confiar à Igreja, sua Esposa amada, o memorial da sua Morte e Ressurreição: sacramento de piedade, sinal de unidade, vínculo de caridade, banquete pascal em que se recebe Cristo, a alma se enche de graça e nos é dado o penhor da glória futura."',
    isCitation: true,
  },
  {
    number: 1324,
    text: 'A Eucaristia é «fonte e ápice de toda a vida cristã». Os demais sacramentos, assim como todos os ministérios eclesiásticos e obras de apostolado, estão vinculados à sagrada Eucaristia e a ela se ordenam. Pois a santíssima Eucaristia contém todo o bem espiritual da Igreja, a saber, o próprio Cristo, a nossa Páscoa.',
  },
  {
    number: 1325,
    text: 'A comunhão de vida divina e a unidade do Povo de Deus, nas quais a Igreja se sustenta, são significadas e realizadas pela Eucaristia. Nela encontra-se o ápice tanto da ação pela qual Deus santifica o mundo em Cristo quanto do culto que os homens oferecem a Cristo e, por Ele, ao Pai no Espírito Santo.',
  },
];

const BIBLE_REFS = ['Mt 26,26-28', '1Cor 11,23-25', 'Jo 6,51', 'Lc 22,19-20'];

const RELATED_THEMES = ['Missa', 'Pão e Vinho', 'Transubstanciação', 'Última Ceia', 'Comunhão'];

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function LeituraScreen() {
  const router = useRouter();
  const { title, range, part } = useLocalSearchParams<{
    title: string;
    range: string;
    part: string;
  }>();
  const colors = useThemeStore((s) => s.colors);
  const fonts = useThemeStore((s) => s.fonts);

  const displayTitle = title ?? 'A Eucaristia';
  const displayRange = range ?? '§1322-1419';
  const displayPart = part ?? 'Parte 2';

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
        <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.displayBold, fontSize: 20, color: colors.textPrimary }}>
            {displayRange}
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textTertiary, marginTop: 1 }}>
            {displayTitle}
          </Text>
        </View>
        <Pressable>
          <MaterialIcons name="bookmark-border" size={24} color={colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Breadcrumb */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 20,
            marginTop: 10,
            marginBottom: 6,
          }}
        >
          <Pressable onPress={() => router.push('/catecismo')}>
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textTertiary }}>
              Catecismo
            </Text>
          </Pressable>
          <Text style={{ fontSize: 12, color: colors.textTertiary }}>›</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textTertiary }}>
              {displayPart}
            </Text>
          </Pressable>
          <Text style={{ fontSize: 12, color: colors.textTertiary }}>›</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.accent }}>
            {displayTitle}
          </Text>
        </View>

        {/* Section title */}
        <View style={{ padding: 20, paddingBottom: 0 }}>
          <Text
            style={{
              fontFamily: fonts.displayBold,
              fontSize: 24,
              color: colors.textPrimary,
              lineHeight: 31,
            }}
          >
            {displayTitle} — Fonte e Ápice da Vida Eclesial
          </Text>
        </View>

        {/* Paragraphs */}
        <View style={{ marginTop: 20 }}>
          {MOCK_PARAGRAPHS.map((p) => (
            <View key={p.number} style={{ paddingHorizontal: 20, marginBottom: 24 }}>
              <Text
                style={{
                  fontFamily: fonts.bodySemiBold,
                  fontSize: 13,
                  color: colors.accent,
                  marginBottom: 6,
                }}
              >
                §{p.number}
              </Text>
              {p.isCitation ? (
                <View
                  style={{
                    paddingLeft: 16,
                    borderLeftWidth: 2,
                    borderLeftColor: colors.accentSoft,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 17,
                      fontStyle: 'italic',
                      lineHeight: 28,
                      color: colors.textSecondary,
                    }}
                  >
                    {p.text}
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 19,
                    lineHeight: 33,
                    color: colors.textPrimary,
                  }}
                >
                  {p.text}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Paragraph navigation */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginTop: 4,
            marginBottom: 20,
          }}
        >
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingVertical: 10,
              paddingHorizontal: 16,
              backgroundColor: colors.bgElevated,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <MaterialIcons name="chevron-left" size={16} color={colors.textSecondary} />
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textSecondary }}>
              §1321
            </Text>
          </Pressable>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingVertical: 10,
              paddingHorizontal: 16,
              backgroundColor: colors.bgElevated,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textSecondary }}>
              §1326
            </Text>
            <MaterialIcons name="chevron-right" size={16} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Bible references */}
        <View
          style={{
            marginHorizontal: 20,
            padding: 16,
            backgroundColor: colors.bgElevated,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.bodySemiBold,
              fontSize: 11,
              color: colors.textTertiary,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            Referências bíblicas
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {BIBLE_REFS.map((ref) => (
              <View
                key={ref}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  backgroundColor: 'rgba(37,99,235,0.08)',
                  borderRadius: 16,
                }}
              >
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, color: '#2563EB' }}>
                  {ref}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Related themes */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 10,
            padding: 16,
            backgroundColor: colors.bgElevated,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.bodySemiBold,
              fontSize: 11,
              color: colors.textTertiary,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            Temas relacionados
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {RELATED_THEMES.map((theme) => (
              <View
                key={theme}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  backgroundColor: 'rgba(124,58,237,0.08)',
                  borderRadius: 16,
                }}
              >
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, color: '#7C3AED' }}>
                  {theme}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Compendium cross-reference */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 10,
            padding: 16,
            backgroundColor: colors.bgElevated,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.bodySemiBold,
              fontSize: 11,
              color: colors.textTertiary,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            No Compêndio
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>
            <Text style={{ fontFamily: fonts.bodySemiBold, color: colors.accent }}>Pergunta §271: </Text>
            "O que é a Eucaristia?" — A Eucaristia é o próprio sacrifício do Corpo e do Sangue do Senhor Jesus...
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
