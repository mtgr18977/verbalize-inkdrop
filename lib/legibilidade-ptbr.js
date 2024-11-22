// lib/legibilidade-ptbr.js

const { CompositeDisposable } = require('event-kit');

const regras = {
  palavraComplexa: {
    regex: /\b\w{13,}\b/g,
    message: 'Considere usar palavras mais curtas para melhorar a legibilidade.',
    color: '#ff6f69',
    summary: ' palavras complexas detectadas.',
    summarySingle: ' palavra complexa detectada.'
  },
  // ... outras regras com cores atualizadas
};

let markers = [];
let subscriptions = null;

function hexToRgba(hex, alpha) {
  let r = 0, g = 0, b = 0;

  if (hex.length === 4) {
    r = '0x' + hex[1] + hex[1];
    g = '0x' + hex[2] + hex[2];
    b = '0x' + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = '0x' + hex[1] + hex[2];
    g = '0x' + hex[3] + hex[4];
    b = '0x' + hex[5] + hex[6];
  }
  return `rgba(${+r}, ${+g}, ${+b}, ${alpha})`;
}

function analisarTexto(conteudo) {
  const resultados = [];

  for (const [chave, regra] of Object.entries(regras)) {
    const matches = [...conteudo.matchAll(regra.regex)];
    if (matches.length > 0) {
      resultados.push({
        regra: chave,
        matches,
        message: regra.message,
        color: regra.color,
        summary:
          matches.length > 1
            ? matches.length + regra.summary
            : matches.length + regra.summarySingle
      });
    }
  }

  return resultados;
}

function limparDestaques() {
  if (markers.length > 0) {
    markers.forEach(marker => marker.clear());
    markers = [];
  }
}

function destacarResultados(editor, resultados) {
  const doc = editor.cm.doc;

  resultados.forEach(resultado => {
    resultado.matches.forEach(match => {
      const start = doc.posFromIndex(match.index);
      const end = doc.posFromIndex(match.index + match[0].length);

      const backgroundColor = hexToRgba(resultado.color, 0.3);

      const marker = doc.markText(start, end, {
        className: 'legibilidade-ptbr-highlight',
        title: resultado.message,
        css: `
          background-color: ${backgroundColor};
          color: var(--editor-text-color);
        `
      });

      markers.push(marker);
    });
  });
}

function mostrarResumo(resultados) {
  const mensagens = resultados.map(resultado => resultado.summary).join('\n');

  inkdrop.notifications.addInfo('Assistente de Legibilidade', {
    detail: mensagens,
    dismissable: true
  });
}

function atualizarAnalise() {
  const editor = inkdrop.getActiveEditor();
  if (!editor) return;

  const conteudo = editor.cm.getValue();

  limparDestaques();

  const resultados = analisarTexto(conteudo);

  if (resultados.length > 0) {
    destacarResultados(editor, resultados);
    mostrarResumo(resultados);
  } else {
    inkdrop.notifications.addSuccess('Texto sem problemas de legibilidade!', {
      dismissable: true
    });
  }
}

module.exports = {
  activate() {
    subscriptions = new CompositeDisposable();

    const handleChange = () => {
      atualizarAnalise();
    };

    const handleEditorLoad = () => {
      const editor = inkdrop.getActiveEditor();
      if (editor) {
        const cm = editor.cm;
        cm.on('change', handleChange);

        subscriptions.add({
          dispose() {
            cm.off('change', handleChange);
          }
        });

        // Executar a análise inicial
        atualizarAnalise();
      }
    };

    // Ouve o evento de carregamento do editor
    subscriptions.add(
      inkdrop.onEditorLoad(handleEditorLoad)
    );

    // Atualiza a análise quando a nota ativa mudar
    subscriptions.add(
      inkdrop.commands.add(document.body, {
        'core:note-opened': () => {
          handleEditorLoad();
        }
      })
    );

    // Executar a análise inicial se o editor já estiver carregado
    if (inkdrop.isEditorActive()) {
      handleEditorLoad();
    }
  },

  deactivate() {
    if (subscriptions) {
      subscriptions.dispose();
    }
    limparDestaques();
  }
};
