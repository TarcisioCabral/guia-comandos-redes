# Guia de Comandos de Redes

Site em React e Vite com comandos de redes, filtros por fabricante e categoria, dicas rápidas e guias de solução de problemas.

## Site publicado

Após ativar o GitHub Pages, o site ficará disponível em:

<https://tarcisiocabral.github.io/guia-comandos-redes/>

## Desenvolvimento local

Requisitos: Node.js 22 e pnpm 10.

```bash
pnpm install
pnpm dev
```

## Publicação pelo GitHub

O arquivo `.github/workflows/deploy-pages.yml` publica o site automaticamente a cada envio para a branch `main`.

Para fazer a primeira ativação:

1. Abra **Settings** no repositório.
2. Acesse **Pages** no menu lateral.
3. Em **Build and deployment**, selecione **GitHub Actions** como fonte.
4. Abra a aba **Actions** e acompanhe o workflow **Publicar no GitHub Pages**.

Depois disso, qualquer atualização seguirá o fluxo:

```bash
git add .
git commit -m "Atualizar site"
git push origin main
```

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS
- GitHub Actions
- GitHub Pages
