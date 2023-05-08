import { Container } from '@components/Container'
import { colorShades } from '@lib/theme'
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia'
import { StyleSheet } from 'react-native'

function calculateArc(startPt, endPt) {
  const path = Skia.Path.Make()
  path.moveTo(startPt.x, startPt.y)

  // TODO: find proper location of the cubic bezier control points
  const q1 = { x: (startPt.x + endPt.x) / 2, y: startPt.y }
  const q2 = { x: endPt.x, y: (startPt.y + endPt.y) / 2 }

  path.cubicTo(q1.x, q1.y, q2.x, q2.y, endPt.x, endPt.y)

  return path
}

export function ArcLesson() {
  const start = { x: 100, y: 140 }
  const end = { x: 200, y: 460 }

  return (
    <Container>
      <Canvas style={styles.canvas}>
        <Circle c={start} r={5} color={colorShades.purple.base} />
        <Circle c={end} r={5} color={colorShades.purple.base} />
        <Path
          color={colorShades.purple.base}
          style="stroke"
          strokeWidth={5}
          path={calculateArc(start, end)}
        />
      </Canvas>
    </Container>
  )
}

const styles = StyleSheet.create({
  canvas: {
    width: '100%',
    height: '100%',
  },
})
