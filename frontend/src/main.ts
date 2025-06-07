import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import 'monaco-editor/min/vs/editor/editor.main.css'
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // à ajuster si besoin

const app = createApp(App)
app.provide('socket', socket)
app.use(router)
app.mount('#app')
