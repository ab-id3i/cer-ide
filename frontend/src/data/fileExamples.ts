export const fileExamples = {
  '/src/components/Header.vue': `<template>
  <header class="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 shadow-lg">
    <nav class="container mx-auto flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <img src="/logo.svg" alt="Logo" class="h-10 w-10" />
        <h1 class="text-2xl font-bold text-white">Mon Application</h1>
      </div>
      <div class="flex space-x-4">
        <button class="px-4 py-2 bg-white text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors">
          Connexion
        </button>
        <button class="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
          Inscription
        </button>
      </div>
    </nav>
  </header>
</template>`,
  
  '/src/components/Footer.vue': `<template>
  <footer class="bg-gray-900 text-white py-8">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-4">À propos</h3>
          <p class="text-gray-400">
            Une application moderne construite avec Vue.js et Tailwind CSS.
          </p>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-4">Liens rapides</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-400 hover:text-white">Accueil</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">Services</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-4">Contact</h3>
          <p class="text-gray-400">
            Email: contact@example.com<br>
            Tél: +33 1 23 45 67 89
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>`,
  
  '/src/views/Home.vue': `<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-6 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Bienvenue sur notre plateforme
        </h1>
        <p class="text-xl text-gray-600">
          Découvrez nos fonctionnalités innovantes
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="text-cyan-500 text-4xl mb-4">🚀</div>
          <h3 class="text-xl font-bold mb-2">Performance</h3>
          <p class="text-gray-600">
            Une expérience utilisateur fluide et rapide.
          </p>
        </div>
        
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="text-cyan-500 text-4xl mb-4">🎨</div>
          <h3 class="text-xl font-bold mb-2">Design</h3>
          <p class="text-gray-600">
            Une interface moderne et élégante.
          </p>
        </div>
        
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="text-cyan-500 text-4xl mb-4">🔒</div>
          <h3 class="text-xl font-bold mb-2">Sécurité</h3>
          <p class="text-gray-600">
            Protection de vos données garantie.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>`,
  
  '/src/views/About.vue': `<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-6 py-12">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">
          À propos de nous
        </h1>
        
        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="prose prose-lg">
            <p class="text-gray-600 mb-6">
              Nous sommes une équipe passionnée de développeurs et de designers
              dédiés à créer des expériences web exceptionnelles.
            </p>
            
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Notre mission</h2>
            <p class="text-gray-600 mb-6">
              Notre mission est de simplifier le développement web tout en
              maintenant les plus hauts standards de qualité et de performance.
            </p>
            
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Notre équipe</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-bold text-gray-900">Jean Dupont</h3>
                <p class="text-gray-600">Lead Developer</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-bold text-gray-900">Marie Martin</h3>
                <p class="text-gray-600">UI/UX Designer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>`,
  
  '/src/App.vue': `<template>
  <div class="min-h-screen bg-gray-100">
    <Header />
    <main>
      <router-view></router-view>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>`,
  
  '/src/main.ts': `import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import About from './views/About.vue'
import './index.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')`,
  
  '/index.html': `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Application Vue.js</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`,
  
  '/package.json': `{
  "name": "mon-application",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "@iconify/vue": "^4.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.0",
    "vite": "^4.3.0",
    "vue-tsc": "^1.6.0"
  }
}`,
  
  '/tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}`
}; 