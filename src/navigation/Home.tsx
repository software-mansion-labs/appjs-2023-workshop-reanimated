import { NavigationProp, useNavigation } from '@react-navigation/native'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { routes, Routes } from './Routes'
import { Container } from '../components/Container'
import { layout } from '../lib/theme'

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp<Routes>>()
  return (
    <Container centered={false}>
      <ScrollView contentContainerStyle={{ padding: layout.spacing * 2 }}>
        {routes.map((route) => (
          <TouchableOpacity
            onPress={() => navigation.navigate(route.name)}
            key={route.name}
            style={styles.button}
          >
            <Text style={styles.title}>{route.title}</Text>
            <Text style={styles.subtitle}>{route.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    opacity: 0.6,
  },
  button: {
    paddingVertical: layout.spacing * 2,
    paddingHorizontal: layout.radius,
    marginBottom: layout.spacing,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
    borderRadius: layout.radius,
  },
})
