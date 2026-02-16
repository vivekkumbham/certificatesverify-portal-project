Tailwind fix applied automatically.

What I changed:
- Added tailwind.config.js (content paths)
- Added postcss.config.js
- Ensured src/index.css contains Tailwind directives
- Ensured src/main.jsx imports './index.css'
- (Optionally) added devDependencies in package.json

Next steps to run locally (inside student-panel folder):
  npm install
  npm run dev

If you encounter 'npx tailwindcss init' issues on Windows/Node22, the manual config avoids needing the CLI.

