const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const BRANCH = process.env.GITHUB_REF_NAME || 'main';
const REPO = process.env.GITHUB_REPOSITORY || 'DP3D3733/XCAD';
const BASE_URL = `https://github.com/${REPO}/blob/${BRANCH}`;

// Lê os caminhos dos arquivos modificados passados como argumentos
const modifiedFiles = process.argv.slice(2);

let readmeContent = fs.readFileSync('README.md', 'utf-8');
let hasChanges = false;

modifiedFiles.forEach((filePath) => {
  if (!fs.existsSync(filePath) || !filePath.endsWith('.js')) return;

  const code = fs.readFileSync(filePath, 'utf-8');

  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    const functions = [];

    traverse(ast, {
      enter(nodePath) {
        const { node } = nodePath;
        let name = null;

        // Captura declarações de função, Arrow Functions e Expressões atribuídas
        if (node.type === 'FunctionDeclaration' && node.id) {
          name = node.id.name;
        } else if (node.type === 'VariableDeclarator' && node.id.name && node.init && (node.init.type === 'FunctionExpression' || node.init.type === 'ArrowFunctionExpression')) {
          name = node.id.name;
        }

        if (name && node.loc) {
          const startLine = node.loc.start.line;
          const endLine = node.loc.end.line;
          functions.push({ name, startLine, endLine });
        }
      },
    });

    // Atualiza os links no README.md para o arquivo processado
    functions.forEach(({ name, startLine, endLine }) => {
      const targetUrl = `${BASE_URL}/${filePath}#L${startLine}-L${endLine}`;

      // RegEx para encontrar o link da função no README
      // Exemplo no README: [cad.js:minhaFuncao](https://github.com/...)
      const regex = new RegExp(
        `\\[([^\\]]*${path.basename(filePath)}[^\\]]*:${name})\\]\\([^\\)]+\\)`,
        'g'
      );

      if (regex.test(readmeContent)) {
        readmeContent = readmeContent.replace(regex, `[$1](${targetUrl})`);
        hasChanges = true;
      }
    });
  } catch (err) {
    console.error(`Erro ao analisar o arquivo ${filePath}:`, err.message);
  }
});

if (hasChanges) {
  fs.writeFileSync('README.md', readmeContent, 'utf-8');
  console.log('README.md atualizado com os novos headlinks!');
} else {
  console.log('Nenhum link precisou ser atualizado.');
}