<script setup lang="ts">
const htmlSnippets = [
    {
        title: 'Page Flex Layout',
        code: `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { margin: 0; font-family: Arial, sans-serif; }
      .container { display: flex; height: 100vh; }
      .sidebar { width: 250px; background: #f4f4f4; padding: 1rem; }
      .content { flex: 1; padding: 1rem; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="sidebar">
        <h2>Menu</h2>
        <ul><li>Accueil</li><li>À propos</li><li>Contact</li></ul>
      </div>
      <div class="content">
        <h1>Bienvenue !</h1>
        <p>Voici votre page en flexbox !</p>
      </div>
    </div>
  </body>
</html>`
    },
    {
        title: 'Page Grid Layout',
        code: `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { margin: 0; font-family: Arial, sans-serif; }
      .grid-container {
        display: grid;
        grid-template-columns: 1fr 3fr;
        grid-template-rows: auto 1fr auto;
        grid-template-areas:
          "header header"
          "sidebar content"
          "footer footer";
        height: 100vh;
      }
      header { grid-area: header; background: #007BFF; color: white; padding: 1rem; }
      nav { grid-area: sidebar; background: #f4f4f4; padding: 1rem; }
      main { grid-area: content; padding: 1rem; }
      footer { grid-area: footer; background: #333; color: white; text-align: center; padding: 1rem; }
    </style>
  </head>
  <body>
    <div class="grid-container">
      <header><h1>Mon site en Grid</h1></header>
      <nav>
        <ul><li>Accueil</li><li>Services</li><li>Contact</li></ul>
      </nav>
      <main>
        <h2>Bienvenue !</h2>
        <p>Voici votre page en grid !</p>
      </main>
      <footer>&copy; 2025 Mon Site</footer>
    </div>
  </body>
</html>`
    },
    {
        title: 'Bouton simple',
        code: `<button type="button" class="bg-blue-500 text-white px-4 py-2 rounded">Clique-moi</button>`
    },
    {
        title: 'Input texte',
        code: `<input type="text" class="border rounded px-3 py-2 w-full" placeholder="Saisir un texte">`
    },
    {
        title: 'Formulaire basique',
        code: `
<form class="space-y-4">
  <div>
    <label for="name" class="block font-semibold">Nom :</label>
    <input type="text" id="name" name="name" class="border rounded px-3 py-2 w-full" placeholder="Votre nom">
  </div>
  <div>
    <label for="email" class="block font-semibold">Email :</label>
    <input type="email" id="email" name="email" class="border rounded px-3 py-2 w-full" placeholder="Votre email">
  </div>
  <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Envoyer</button>
</form>`
    }
];


const actionSnippets = [
    {
        title: 'Console Log',
        code: `@click="console.log('Hello World!');"`
    },
    {
        title: 'Alert',
        code: `@click="alert('Hello from the snippet!');"`
    },
    {
        title: 'Prompt Input',
        code: `
@click="const name = prompt('Quel est votre nom ?'); alert('Bonjour ' + name + ' !');"
`
    },
    {
        title: 'Ajouter une classe',
        code: `
@click="document.querySelector('body').classList.add('bg-red-500');"
`
    }
];

function handleDragStart(code: string, event: DragEvent) {
    event.dataTransfer?.setData('text/plain', code);
}
</script>


<template>
    <div class="p-4 bg-white rounded-lg shadow-md h-full overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">Snippets</h3>
        <div class="grid grid-cols-2 gap-4">
            <!-- Colonne Structure -->
            <div>
                <h4 class="text-md font-semibold mb-2">Structures</h4>
                <ul class="space-y-2">
                    <li v-for="(snippet, index) in htmlSnippets" :key="'html-' + index" draggable="true"
                        @dragstart="(e) => handleDragStart(snippet.code, e)"
                        class="bg-gray-100 hover:bg-gray-200 transition cursor-grab px-4 py-3 rounded-lg shadow-sm">
                        {{ snippet.title }}
                    </li>
                </ul>
            </div>

            <!-- Colonne Actions -->
            <div>
                <h4 class="text-md font-semibold mb-2">Actions</h4>
                <ul class="space-y-2">
                    <li v-for="(action, index) in actionSnippets" :key="'action-' + index" draggable="true"
                        @dragstart="(e) => handleDragStart(action.code, e)"
                        class="bg-gray-100 hover:bg-gray-200 transition cursor-grab px-4 py-3 rounded-lg shadow-sm">
                        {{ action.title }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
