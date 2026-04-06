import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '@/stores/useThemeStore';

/* ═══════════════════════════════════════════
   DATA — Parts, Sections & Chapters
   ═══════════════════════════════════════════ */

interface Chapter {
  number: number;
  title: string;
  range: string;
}

interface Section {
  title: string;
  range: string;
  subtitle: string;
}

interface PartData {
  title: string;
  subtitle: string;
  quote: string;
  quoteSource: string;
  sections: Section[];
  chapters: Chapter[];
  chaptersTitle: string;
}

const PARTS_DATA: Record<string, PartData> = {
  '1': {
    title: 'Parte 1',
    subtitle: 'A Profissão de Fé',
    quote: '"Eu creio em Deus": esta primeira afirmação da profissão de fé é também a mais fundamental.',
    quoteSource: 'Catecismo §199',
    sections: [
      { title: 'Seção 1 — "Eu creio" — "Nós cremos"', range: '§1-184', subtitle: 'O homem é capaz de Deus' },
      { title: 'Seção 2 — A Profissão da Fé Cristã', range: '§185-1065', subtitle: 'O Credo, artigo por artigo' },
    ],
    chaptersTitle: 'Capítulos — O Credo',
    chapters: [
      { number: 1, title: 'O homem é "capaz" de Deus', range: '§1-49' },
      { number: 2, title: 'Deus vem ao encontro do homem', range: '§50-141' },
      { number: 3, title: 'A resposta do homem a Deus', range: '§142-184' },
      { number: 4, title: 'Creio em Deus Pai Todo-Poderoso', range: '§198-421' },
      { number: 5, title: 'Creio em Jesus Cristo, Filho Único', range: '§422-682' },
      { number: 6, title: 'Creio no Espírito Santo', range: '§683-1065' },
    ],
  },
  '2': {
    title: 'Parte 2',
    subtitle: 'A Celebração do Mistério Cristão',
    quote: '"A liturgia é o cume para o qual tende a ação da Igreja, e ao mesmo tempo a fonte de onde promana toda a sua força."',
    quoteSource: 'Sacrosanctum Concilium, 10',
    sections: [
      { title: 'Seção 1 — A Economia Sacramental', range: '§1066-1209', subtitle: 'A liturgia, obra da Santíssima Trindade' },
      { title: 'Seção 2 — Os Sete Sacramentos da Igreja', range: '§1210-1690', subtitle: 'Os sacramentos da iniciação, cura e serviço' },
    ],
    chaptersTitle: 'Capítulos — Os 7 Sacramentos',
    chapters: [
      { number: 1, title: 'O Sacramento do Batismo', range: '§1213-1284' },
      { number: 2, title: 'O Sacramento da Confirmação', range: '§1285-1321' },
      { number: 3, title: 'A Eucaristia', range: '§1322-1419' },
      { number: 4, title: 'O Sacramento da Penitência', range: '§1422-1498' },
      { number: 5, title: 'A Unção dos Enfermos', range: '§1499-1532' },
      { number: 6, title: 'O Sacramento da Ordem', range: '§1536-1600' },
      { number: 7, title: 'O Sacramento do Matrimônio', range: '§1601-1666' },
    ],
  },
  '3': {
    title: 'Parte 3',
    subtitle: 'A Vida em Cristo',
    quote: '"Reconhece, ó cristão, a tua dignidade. Uma vez que te tornaste participante da natureza divina, não voltes à miséria de outrora."',
    quoteSource: 'São Leão Magno · Catecismo §1691',
    sections: [
      { title: 'Seção 1 — A Vocação do Homem', range: '§1691-2051', subtitle: 'Dignidade, comunidade e salvação' },
      { title: 'Seção 2 — Os Dez Mandamentos', range: '§2052-2557', subtitle: 'A lei moral detalhada' },
    ],
    chaptersTitle: 'Capítulos — Os 10 Mandamentos',
    chapters: [
      { number: 1, title: '1º — Amar a Deus sobre todas as coisas', range: '§2083-2141' },
      { number: 2, title: '2º — Não tomar o nome de Deus em vão', range: '§2142-2167' },
      { number: 3, title: '3º — Guardar domingos e festas', range: '§2168-2195' },
      { number: 4, title: '4º — Honrar pai e mãe', range: '§2196-2257' },
      { number: 5, title: '5º — Não matar', range: '§2258-2330' },
      { number: 6, title: '6º — Não pecar contra a castidade', range: '§2331-2400' },
      { number: 7, title: '7º — Não roubar', range: '§2401-2463' },
      { number: 8, title: '8º — Não levantar falso testemunho', range: '§2464-2513' },
      { number: 9, title: '9º — Não cobiçar a mulher do próximo', range: '§2514-2533' },
      { number: 10, title: '10º — Não cobiçar as coisas alheias', range: '§2534-2557' },
    ],
  },
  '4': {
    title: 'Parte 4',
    subtitle: 'A Oração Cristã',
    quote: '"Para mim, a oração é um impulso do coração, um simples olhar lançado ao Céu, um grito de reconhecimento e de amor no meio da provação e no meio da alegria."',
    quoteSource: 'Santa Teresa do Menino Jesus · Catecismo §2558',
    sections: [
      { title: 'Seção 1 — A Oração na Vida Cristã', range: '§2558-2758', subtitle: 'Fontes, caminhos e guias da oração' },
      { title: 'Seção 2 — A Oração do Senhor: Pai Nosso', range: '§2759-2865', subtitle: 'Cada petição explicada' },
    ],
    chaptersTitle: 'Capítulos — O Pai Nosso',
    chapters: [
      { number: 1, title: 'A revelação da oração', range: '§2566-2649' },
      { number: 2, title: 'A tradição da oração', range: '§2650-2696' },
      { number: 3, title: 'A vida de oração', range: '§2697-2758' },
      { number: 4, title: '"Pai Nosso que estais nos céus"', range: '§2777-2802' },
      { number: 5, title: 'As sete petições', range: '§2803-2854' },
      { number: 6, title: 'A doxologia final', range: '§2855-2865' },
    ],
  },
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function PartDetailScreen() {
  const router = useRouter();
  const { part } = useLocalSearchParams<{ part: string }>();
  const colors = useThemeStore((s) => s.colors);
  const fonts = useThemeStore((s) => s.fonts);

  const data = PARTS_DATA[part] ?? PARTS_DATA['1'];

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
            {data.title}
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textTertiary, marginTop: 1 }}>
            {data.subtitle}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quote */}
        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontFamily: fonts.display,
              fontSize: 17,
              fontStyle: 'italic',
              color: colors.textSecondary,
              lineHeight: 26,
            }}
          >
            {data.quote}
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textTertiary, marginTop: 6 }}>
            — {data.quoteSource}
          </Text>
        </View>

        {/* Sections */}
        <Text
          style={{
            paddingHorizontal: 20,
            marginBottom: 12,
            fontFamily: fonts.bodySemiBold,
            fontSize: 13,
            color: colors.textTertiary,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}
        >
          Seções
        </Text>

        {data.sections.map((section, i) => (
          <View
            key={i}
            style={{
              marginHorizontal: 20,
              marginBottom: 10,
              padding: 16,
              backgroundColor: colors.bgCard,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.displayBold,
                fontSize: 17,
                color: colors.textPrimary,
                marginBottom: 4,
              }}
            >
              {section.title}
            </Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textTertiary, lineHeight: 18 }}>
              {section.range} · {section.subtitle}
            </Text>
          </View>
        ))}

        {/* Chapters */}
        <Text
          style={{
            paddingHorizontal: 20,
            marginTop: 8,
            marginBottom: 12,
            fontFamily: fonts.bodySemiBold,
            fontSize: 13,
            color: colors.textTertiary,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}
        >
          {data.chaptersTitle}
        </Text>

        {data.chapters.map((chapter) => (
          <Pressable
            key={chapter.number}
            onPress={() =>
              router.push({
                pathname: '/catecismo/leitura',
                params: {
                  title: chapter.title,
                  range: chapter.range,
                  part: data.title,
                },
              })
            }
            style={{
              marginHorizontal: 20,
              marginBottom: 8,
              padding: 14,
              backgroundColor: colors.bgElevated,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {/* Number badge */}
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: colors.accentSoft,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.bodyBold,
                  fontSize: 12,
                  color: colors.accent,
                }}
              >
                {chapter.number}
              </Text>
            </View>

            {/* Title */}
            <Text
              style={{
                flex: 1,
                fontFamily: fonts.bodyMedium,
                fontSize: 14,
                color: colors.textPrimary,
              }}
            >
              {chapter.title}
            </Text>

            {/* Range */}
            <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textTertiary }}>
              {chapter.range}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
