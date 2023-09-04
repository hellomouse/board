<div align="center">
<h1>Hellomouse Apps</h1>
<b>🚧  This is currently under construction, features may change at any time 🚧<b>
</div>
<br>

![Preview](https://i.imgur.com/imGdBuj.png)

Hellomouse Apps is an app suite for Hellomouse. Currently we have the following apps:
- **Board:** A pinterest / notes app for archiving websites, images, or just your own ideas, under `/board`.
   - Create boards and pins and share them with other users / the public
   - Create pins with text formatting, checklists, images, or link previews
   - Archive websites with a single click (save as HTML, PDF, special handling for some sites)
- **Docs:** Documentation for the app suite API under `/docs`

### Other Components
These will also need to be installed for the app to function.

- **Backend server:** https://github.com/hellomouse/hellomouse-apps-api
- **Site downloader service:** https://github.com/hellomouse/apps-site-service

### Built With
- [![https://img.shields.io/badge/nuxt.js-41b883?style=for-the-badge&logo=nuxtdotjs&logoColor=white](https://img.shields.io/badge/nuxt.js-41b883?style=for-the-badge&logo=nuxtdotjs&logoColor=white)](https://nuxt.com "Nuxt.js")
- [![https://img.shields.io/badge/vue.js-34495E?style=for-the-badge&logo=vuedotjs&logoColor=white](https://img.shields.io/badge/vue.js-34495E?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/ "Vue.js")
- ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
- ![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)
- ![actix-web](https://img.shields.io/badge/actix_web-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)

## Running

### Setup

```bash
npm install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

### Production

Build the application for production and locally preview production build

```bash
npm run build
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
