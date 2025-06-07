import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MonacoEditor from '../components/MonacoEditor.vue'
import CodeMirrorEditor from '../components/CodeMirrorEditor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/monaco',
      name: 'monaco',
      component: MonacoEditor
    },
    {
      path: '/codemirror',
      name: 'codemirror',
      component: CodeMirrorEditor
    }
  ]
})

export default router 