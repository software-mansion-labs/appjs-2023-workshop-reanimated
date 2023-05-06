import { Container } from '@components/Container'
import { colorShades } from '@lib/theme'
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia'
import { StyleSheet } from 'react-native'

const MIN_BOUND_DIST = 30

function calculateArc(startPt, endPt) {
  'worklet'
  const path = Skia.Path.Make()
  path.moveTo(startPt.x, startPt.y)

  const midPt = { x: (startPt.x + endPt.x) / 2, y: (startPt.y + endPt.y) / 2 }

  const dx = endPt.x - startPt.x
  const dy = endPt.y - startPt.y

  let boundX = midPt.x,
    boundY = midPt.y

  const dist2 = dx * dx + dy * dy
  if (dist2 < 0.5) {
    path.moveTo(endPt.x, endPt.y)
    return path
  }

  if (Math.abs(dx) < Math.abs(dy)) {
    const yDist = Math.abs(dist2 / 2 / dy)
    boundX = endPt.x
    boundY = endPt.y < startPt.y ? endPt.y + yDist : endPt.y - yDist
  } else {
    const xDist = Math.abs(dist2 / 2 / dx)
    boundX = endPt.x < startPt.x ? endPt.x + xDist : endPt.x - xDist
    boundY = endPt.y
  }

  if (Math.abs(dx) < 0.5) {
    boundX += endPt.x < startPt.x ? MIN_BOUND_DIST : -MIN_BOUND_DIST
  } else if (Math.abs(dy) < 0.5) {
    boundY += endPt.y < startPt.y ? MIN_BOUND_DIST : -MIN_BOUND_DIST
  }

  const boundDist =
    (boundX - midPt.x) * (boundX - midPt.x) +
    (boundY - midPt.y) * (boundY - midPt.y)

  if (boundDist * boundDist < MIN_BOUND_DIST * MIN_BOUND_DIST) {
    const ratio = MIN_BOUND_DIST / Math.sqrt(boundDist)
    boundX = midPt.x + (boundX - midPt.x) * ratio
    boundY = midPt.y + (boundY - midPt.y) * ratio
  }

  const cp1x = (startPt.x + boundX) / 2
  const cp1y = (startPt.y + boundY) / 2
  const cp2x = (endPt.x + boundX) / 2
  const cp2y = (endPt.y + boundY) / 2
  path.cubicTo(cp1x, cp1y, cp2x, cp2y, endPt.x, endPt.y)

  return path
}

export function ArcLesson() {
  const start = { x: 330, y: 30 }
  const end = { x: 150, y: 400 }

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
