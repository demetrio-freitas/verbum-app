import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '@/stores/useThemeStore';

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

export default function MaisScreen() {
  const colors = useThemeStore((s) => s.colors);
  const fonts = useThemeStore((s) => s.fonts);
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
        <Text style={{ fontFamily: fonts.displayBold, fontSize: 22, color: colors.textPrimary }}>
          Mais
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Menu grid */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 24,
          }}
        >
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => router.push(item.route as any)}
              style={{
                width: '47%',
                backgroundColor: colors.bgCard,
                borderRadius: 12,
                padding: 20,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: 'center',
                gap: 8,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: colors.accentSoft,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialIcons name={item.icon} size={22} color={colors.accent} />
              </View>
              <Text
                style={{
                  fontFamily: fonts.bodyMedium,
                  fontSize: 13,
                  color: colors.textPrimary,
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* App info */}
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <Text style={{ fontFamily: fonts.display, fontSize: 18, color: colors.textPrimary }}>
            Verbum
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textTertiary, marginTop: 2 }}>
            Evangelho do Dia · v1.0.0
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textTertiary, marginTop: 2 }}>
            7BIS Startup Studio
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
