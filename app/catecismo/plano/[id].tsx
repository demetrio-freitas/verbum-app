import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '@/stores/useThemeStore';

/* ═══════════════════════════════════════════
   DATA — Study Plans
   ═══════════════════════════════════════════ */

interface PlanDay {
  day: number;
  title: string;
  desc: string;
  range: string;
  status: 'done' | 'current' | 'upcoming';
}

interface PlanData {
  title: string;
  duration: string;
  currentDay: number;
  totalDays: number;
  days: PlanDay[];
}

const PLANS_DATA: Record<string, PlanData> = {
  introducao: {
    title: 'Introdução ao Catecismo',
    duration: '7 dias · ~10 min/dia',
    currentDay: 3,
    totalDays: 7,
    days: [
      { day: 1, title: 'O que é o Catecismo?', desc: '§1-25 · Por que a Igreja escreveu um Catecismo', range: '§1-25', status: 'done' },
      { day: 2, title: 'Deus existe?', desc: '§26-49 · O desejo de Deus inscrito no coração', range: '§26-49', status: 'done' },
      { day: 3, title: 'Deus se revela', desc: '§50-73 · Como Deus fala conosco', range: '§50-73', status: 'current' },
      { day: 4, title: 'A fé', desc: '§142-184 · O que significa crer', range: '§142-184', status: 'upcoming' },
      { day: 5, title: 'O Credo', desc: '§185-197 · O que dizemos quando rezamos o Creio', range: '§185-197', status: 'upcoming' },
      { day: 6, title: 'Jesus Cristo', desc: '§422-455 · Quem é Jesus? "Filho de Deus"', range: '§422-455', status: 'upcoming' },
      { day: 7, title: 'O Espírito Santo', desc: '§683-747 · O Espírito na vida do cristão hoje', range: '§683-747', status: 'upcoming' },
    ],
  },
  '1ano': {
    title: 'Catecismo em 1 Ano',
    duration: '365 dias · ~8 parágrafos/dia',
    currentDay: 1,
    totalDays: 365,
    days: [
      { day: 1, title: 'O desejo de Deus', desc: '§1-8 · O homem busca Deus', range: '§1-8', status: 'current' },
      { day: 2, title: 'Conhecer e amar a Deus', desc: '§9-17 · Os caminhos para Deus', range: '§9-17', status: 'upcoming' },
      { day: 3, title: 'A transmissão da fé', desc: '§18-25 · O Catecismo e a catequese', range: '§18-25', status: 'upcoming' },
      { day: 4, title: 'A Revelação divina', desc: '§26-35 · Deus se revela', range: '§26-35', status: 'upcoming' },
      { day: 5, title: 'As etapas da Revelação', desc: '§36-49 · Dos primórdios à Aliança', range: '§36-49', status: 'upcoming' },
    ],
  },
  sacramentos: {
    title: 'Os 7 Sacramentos',
    duration: '30 dias · 4 dias por sacramento',
    currentDay: 1,
    totalDays: 30,
    days: [
      { day: 1, title: 'Batismo — O que é?', desc: '§1213-1228 · Fundamento da vida cristã', range: '§1213-1228', status: 'current' },
      { day: 2, title: 'Batismo — Celebração', desc: '§1229-1245 · O rito batismal', range: '§1229-1245', status: 'upcoming' },
      { day: 3, title: 'Batismo — Quem pode?', desc: '§1246-1261 · Adultos e crianças', range: '§1246-1261', status: 'upcoming' },
      { day: 4, title: 'Batismo — Graças', desc: '§1262-1284 · Efeitos do Batismo', range: '§1262-1284', status: 'upcoming' },
      { day: 5, title: 'Confirmação — O que é?', desc: '§1285-1301 · Sacramento da plenitude', range: '§1285-1301', status: 'upcoming' },
    ],
  },
  mandamentos: {
    title: 'Os 10 Mandamentos',
    duration: '40 dias · Com exame de consciência',
    currentDay: 1,
    totalDays: 40,
    days: [
      { day: 1, title: '1º Mandamento — Texto', desc: '§2083-2109 · Amar a Deus sobre todas as coisas', range: '§2083-2109', status: 'current' },
      { day: 2, title: '1º Mandamento — Pecados', desc: '§2110-2128 · Superstição, idolatria, ateísmo', range: '§2110-2128', status: 'upcoming' },
      { day: 3, title: '1º Mandamento — Reflexão', desc: 'Reflexão prática sobre a fé', range: '§2083-2141', status: 'upcoming' },
      { day: 4, title: '1º Mandamento — Exame', desc: 'Exame de consciência: minha relação com Deus', range: '§2083-2141', status: 'upcoming' },
    ],
  },
  oracao: {
    title: 'A Oração Cristã',
    duration: '21 dias · Pai Nosso linha por linha',
    currentDay: 1,
    totalDays: 21,
    days: [
      { day: 1, title: 'O que é oração?', desc: '§2558-2567 · Um impulso do coração', range: '§2558-2567', status: 'current' },
      { day: 2, title: 'A oração de Abraão', desc: '§2568-2577 · Fontes da oração no AT', range: '§2568-2577', status: 'upcoming' },
      { day: 3, title: 'Moisés e a oração', desc: '§2574-2584 · Oração de intercessão', range: '§2574-2584', status: 'upcoming' },
    ],
  },
  catequese: {
    title: 'Preparação para Catequese',
    duration: '60 dias · Para catequistas e catequizandos',
    currentDay: 1,
    totalDays: 60,
    days: [
      { day: 1, title: 'O que é o Catecismo?', desc: '§1-25 · Introdução ao documento', range: '§1-25', status: 'current' },
      { day: 2, title: 'A Revelação', desc: '§50-73 · Como Deus se comunica', range: '§50-73', status: 'upcoming' },
      { day: 3, title: 'A Sagrada Escritura', desc: '§101-141 · A Bíblia na vida da Igreja', range: '§101-141', status: 'upcoming' },
    ],
  },
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function PlanDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeStore((s) => s.colors);
  const fonts = useThemeStore((s) => s.fonts);

  const plan = PLANS_DATA[id] ?? PLANS_DATA['introducao'];
  const progress = Math.round((plan.currentDay / plan.totalDays) * 100);

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
            {plan.title}
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textTertiary, marginTop: 1 }}>
            {plan.duration}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress bar */}
        <View
          style={{
            margin: 20,
            marginBottom: 12,
            padding: 16,
            backgroundColor: colors.bgCard,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textTertiary }}>
              Dia {plan.currentDay} de {plan.totalDays}
            </Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textTertiary }}>
              {progress}%
            </Text>
          </View>
          <View
            style={{
              height: 6,
              backgroundColor: colors.bgElevated,
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: colors.accent,
                borderRadius: 3,
              }}
            />
          </View>
        </View>

        {/* Schedule label */}
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
          Cronograma
        </Text>

        {/* Days */}
        {plan.days.map((day) => (
          <Pressable
            key={day.day}
            onPress={() => {
              if (day.status !== 'upcoming') {
                router.push({
                  pathname: '/catecismo/leitura',
                  params: {
                    title: day.title,
                    range: day.range,
                    part: plan.title,
                  },
                });
              }
            }}
            style={{
              marginHorizontal: 20,
              marginBottom: 10,
              padding: 14,
              backgroundColor: colors.bgCard,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              opacity: day.status === 'upcoming' ? 0.6 : 1,
            }}
          >
            {/* Day number / check */}
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor:
                  day.status === 'done'
                    ? 'rgba(22,163,74,0.08)'
                    : day.status === 'current'
                    ? colors.accent
                    : colors.bgElevated,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {day.status === 'done' ? (
                <MaterialIcons name="check" size={18} color="#16A34A" />
              ) : (
                <Text
                  style={{
                    fontFamily: fonts.bodyBold,
                    fontSize: 14,
                    color: day.status === 'current' ? '#FAFAF7' : colors.textSecondary,
                  }}
                >
                  {day.day}
                </Text>
              )}
            </View>

            {/* Info */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.textPrimary }}>
                Dia {day.day} — {day.title}
              </Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textTertiary, marginTop: 2 }}>
                {day.desc}
              </Text>
            </View>

            {/* Status indicator */}
            {day.status === 'done' && (
              <MaterialIcons name="check-circle" size={20} color="#16A34A" />
            )}
            {day.status === 'current' && (
              <MaterialIcons name="arrow-forward" size={18} color={colors.accent} />
            )}
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
