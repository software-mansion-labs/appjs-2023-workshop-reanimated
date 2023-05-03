import type { Post } from '@lib/mock'

type LessonRoutes = {
  CircleGesturesLesson: undefined
  BaloonSliderLesson: undefined
  DynamicTabsLesson: undefined
  MarqueeLesson: undefined
  ScrollAnimationLesson: undefined
  SharedElementTransitionDnd: undefined
}
type RouteMeta = {
  name: keyof LessonRoutes
  title: string
  subtitle: string
}

export type SharedElementTransitionDndRoutes = {
  SharedElementTransitionDndHome: undefined
  SharedElementTransitionDndHomeDetail: {
    item: Post
  }
}

export const routes: RouteMeta[] = [
  {
    name: 'CircleGesturesLesson',
    title: 'Circle Gestures 👉',
    subtitle: 'Lesson 1',
  },
  {
    name: 'BaloonSliderLesson',
    title: 'Baloon Slider 👉',
    subtitle: 'Lesson 2',
  },
  {
    name: 'MarqueeLesson',
    title: 'Marquee 👉',
    subtitle: 'Lesson 3',
  },
  {
    name: 'DynamicTabsLesson',
    title: 'Dynamic Tabs 👉',
    subtitle: 'Lesson 4',
  },
  {
    name: 'ScrollAnimationLesson',
    title: 'Scroll Animation 👉',
    subtitle: 'Lesson 5 (bonus)',
  },
  {
    name: 'SharedElementTransitionDnd',
    title: 'SET dnd 👉',
    subtitle: 'Lesson 6 [test]',
  },
]
export type Routes = LessonRoutes & { Home: undefined }
