const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const BRANCH = process.env.GITHUB_REF_NAME || 'main';
const REPO = process.env.GITHUB_REPOSITORY || 'DP3D3733/XCAD';
const BASE_URL = `https://github.com/${REPO}/blob/${BRANCH}`;

// Pega a lista de arquivos alterados passados pelo workflow
const modifiedFiles = process.argv.slice(2);

if (modifiedFiles.length === 0) {
  console.log('Nenhum arquivo .js modificado.');
  process.exit(0);
}

let readmeContent = fs.readFileSync('README.md', 'utf-8');
let hasChanges = false;

modifiedFiles.forEach((filePath) => {
  // Ignora se o arquivo foi excluído ou não é JS
  if (!fs.existsSync(filePath) || !filePath.endsWith('.js')) return;

  const code = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);

  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    const functions = [];

    traverse(ast, {
      Function(nodePath) {
        const { node } = nodePath;
        let name = null;

        if (node.id && node.id.name) {
          name = node.id.name;
        } else if (
          nodePath.parent.type === 'VariableDeclarator' &&
          nodePath.parent.id.name
        ) {
          name = nodePath.parent.id.name;
        }

        if (name && node.loc) {
          functions.push({
            name,
            startLine: node.loc.start.line,
            endLine: node.loc.end.line,
          });
        }
      },
    });

    functions.forEach(({ name, startLine, endLine }) => {
      const targetUrl = `${BASE_URL}/${filePath}#L${startLine}-L${endLine}`;

      // Escape de caracteres especiais para Regex
      const escapedFileName = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Suporta variações como:
      // - [`sentry.js:atualizarEfetivo()`](https://...)
      // - [sentry.js:atualizarEfetivo](https://...)
      const regex = new RegExp(
        `\\[\`?${escapedFileName}:${escapedName}(?:\\(\\))?\`?\\]\\((https:\\/\\/github\\.com\\/[^\\)]+)\\)`,
        'g'
      );

      readmeContent = readmeContent.replace(regex, (match, oldUrl) => {
        if (oldUrl !== targetUrl) {
          hasChanges = true;
          // Preserva os backticks e o () se existirem no texto original
          return match.replace(oldUrl, targetUrl);
        }
        return match;
      });
    });
  } catch (err) {
    console.error(`Erro ao analisar ${filePath}:`, err.message);
  }
});

if (hasChanges) {
  fs.writeFileSync('README.md', readmeContent, 'utf-8');
  console.log('README.md atualizado com os novos headlinks!');
} else {
  console.log('Nenhum link precisou ser alterado no README.md.');
}