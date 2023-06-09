import type { Post } from '@lib/mock'

type LessonRoutes = {
  CircleGesturesLesson: undefined
  BalloonSliderLesson: undefined
  DynamicTabsLesson: undefined
  MarqueeLesson: undefined
  ScrollAnimationLesson: undefined
  SharedElementTransitionDnd: undefined
  ArcLesson: undefined
}
type RouteMeta = {
  name: keyof LessonRoutes
  title: string
  subtitle: string
}

export type SharedElementTransitionDndRoutes = {
  SharedElementTransitionDndHome: undefined
  SharedElementTransitionDndDetail: {
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
    name: 'BalloonSliderLesson',
    title: 'Balloon Slider 👉',
    subtitle: 'Lesson 2',
  },
  {
    name: 'DynamicTabsLesson',
    title: 'Dynamic Tabs 👉',
    subtitle: 'Lesson 3',
  },
  {
    name: 'ScrollAnimationLesson',
    title: 'Scroll Animation 👉',
    subtitle: 'Lesson 4',
  },
  {
    name: 'SharedElementTransitionDnd',
    title: 'SET dnd 👉',
    subtitle: 'Lesson 5',
  },
  {
    name: 'ArcLesson',
    title: 'Animate along arc 👉',
    subtitle: 'Lesson 6',
  },
  {
    name: 'MarqueeLesson',
    title: 'Marquee 👉',
    subtitle: 'Lesson 7 [bonus]',
  },
]
export type Routes = LessonRoutes & { Home: undefined }
