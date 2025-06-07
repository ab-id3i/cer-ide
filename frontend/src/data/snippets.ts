import type { Snippet } from '../types/editor';

export const htmlSnippets: Snippet[] = [
  {
    title: 'Page Flex Layout',
    code: `\n<!DOCTYPE html>\n<html>\n  <head>\n    <style>\n      body { margin: 0; font-family: Arial, sans-serif; }\n      .container { display: flex; height: 100vh; }\n      .sidebar { width: 250px; background: #f4f4f4; padding: 1rem; }\n      .content { flex: 1; padding: 1rem; }\n    </style>\n  </head>\n  <body>\n    <div class=\"container\">\n      <div class=\"sidebar\">\n        <h2>Menu</h2>\n        <ul><li>Accueil</li><li>À propos</li><li>Contact</li></ul>\n      </div>\n      <div class=\"content\">\n        <h1>Bienvenue !</h1>\n        <p>Voici votre page en flexbox !</p>\n      </div>\n    </div>\n  </body>\n</html>`
  },
  {
    title: 'Page Grid Layout',
    code: `\n<!DOCTYPE html>\n<html>\n  <head>\n    <style>\n      body { margin: 0; font-family: Arial, sans-serif; }\n      .grid-container {\n        display: grid;\n        grid-template-columns: 1fr 3fr;\n        grid-template-rows: auto 1fr auto;\n        grid-template-areas:\n          \"header header\"\n          \"sidebar content\"\n          \"footer footer\";\n        height: 100vh;\n      }\n      header { grid-area: header; background: #007BFF; color: white; padding: 1rem; }\n      nav { grid-area: sidebar; background: #f4f4f4; padding: 1rem; }\n      main { grid-area: content; padding: 1rem; }\n      footer { grid-area: footer; background: #333; color: white; text-align: center; padding: 1rem; }\n    </style>\n  </head>\n  <body>\n    <div class=\"grid-container\">\n      <header><h1>Mon site en Grid</h1></header>\n      <nav>\n        <ul><li>Accueil</li><li>Services</li><li>Contact</li></ul>\n      </nav>\n      <main>\n        <h2>Bienvenue !</h2>\n        <p>Voici votre page en grid !</p>\n      </main>\n      <footer>&copy; 2025 Mon Site</footer>\n    </div>\n  </body>\n</html>`
  },
  {
    title: 'Bouton simple',
    code: `<button type=\"button\" class=\"bg-blue-500 text-white px-4 py-2 rounded\">Clique-moi</button>`
  },
  {
    title: 'Input texte',
    code: `<input type=\"text\" class=\"border rounded px-3 py-2 w-full\" placeholder=\"Saisir un texte\">`
  },
  {
    title: 'Formulaire basique',
    code: `\n<form class=\"space-y-4\">\n  <div>\n    <label for=\"name\" class=\"block font-semibold\">Nom :</label>\n    <input type=\"text\" id=\"name\" name=\"name\" class=\"border rounded px-3 py-2 w-full\" placeholder=\"Votre nom\">\n  </div>\n  <div>\n    <label for=\"email\" class=\"block font-semibold\">Email :</label>\n    <input type=\"email\" id=\"email\" name=\"email\" class=\"border rounded px-3 py-2 w-full\" placeholder=\"Votre email\">\n  </div>\n  <button type=\"submit\" class=\"bg-green-500 text-white px-4 py-2 rounded\">Envoyer</button>\n</form>`
  }
];

export const actionSnippets: Snippet[] = [
  {
    title: 'Console Log',
    code: `@click=\"console.log('Hello World!');\"`
  },
  {
    title: 'Alert',
    code: `@click=\"alert('Hello from the snippet!');\"`
  },
  {
    title: 'Prompt Input',
    code: `\n@click=\"const name = prompt('Quel est votre nom ?'); alert('Bonjour ' + name + ' !');\"\n`
  },
  {
    title: 'Ajouter une classe',
    code: `\n@click=\"document.querySelector('body').classList.add('bg-red-500');\"\n`
  }
]; 