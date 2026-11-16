import React, { useEffect, useState } from "react";

const perguntas = [
  {
    pergunta: "Para que serve o comando let no JavaScript?",
    opcoes: [
      "Para declarar uma variável que pode mudar de valor",
      "Para criar uma página HTML",
      "Para repetir um código automaticamente",
      "Para apagar uma função"
    ],
    correta: 0,
    explicacao: "let declara uma variável cujo valor pode ser alterado durante a execução."
  },
  {
    pergunta: "Qual estrutura usamos para tomar decisões no código?",
    opcoes: ["for", "if e else", "console.log", "import"],
    correta: 1,
    explicacao: "if e else permitem executar trechos diferentes dependendo de uma condição."
  },
  {
    pergunta: "Qual comando mostra uma mensagem no console?",
    opcoes: ["print()", "write()", "console.log()", "message()"],
    correta: 2,
    explicacao: "console.log() é usado para exibir informações no console do navegador."
  },
  {
    pergunta: "Qual estrutura pode repetir um bloco de código várias vezes?",
    opcoes: ["const", "if", "return", "for"],
    correta: 3,
    explicacao: "O for é uma estrutura de repetição, usada quando queremos executar um bloco várias vezes."
  },
  {
    pergunta: "O que acontece quando usamos const para declarar uma variável?",
    opcoes: [
      "A variável sempre vira um texto",
      "Não podemos atribuir outro valor à variável",
      "O código é repetido cinco vezes",
      "A página é atualizada"
    ],
    correta: 1,
    explicacao: "const cria uma referência que não pode receber uma nova atribuição."
  }
];

function Inicio({ aoComecar }) {
  return (
    <section className="painel inicio">
      <div className="icone">{"</>"}</div>
      <p className="etiqueta">DSA • DESENVOLVIMENTO WEB</p>
      <h2>Teste seus conhecimentos em JavaScript</h2>
      <p className="descricao">
        Responda 5 perguntas rápidas e veja como está seu conhecimento.
      </p>
      <div className="detalhes">
        <span>📝 5 perguntas</span>
        <span>⏱️ Sem limite de tempo</span>
        <span>🎯 Resultado na hora</span>
      </div>
      <button className="botao principal" onClick={aoComecar}>Começar quiz</button>
    </section>
  );
}

function Pergunta({ indice, resposta, aoResponder, aoAvancar }) {
  const atual = perguntas[indice];
  const [mostrarExplicacao, setMostrarExplicacao] = useState(false);

  function confirmar() {
    if (resposta === null) return;
    setMostrarExplicacao(true);
  }

  function proxima() {
    setMostrarExplicacao(false);
    aoAvancar();
  }

  return (
    <section className="painel">
      <div className="linha-info">
        <span className="etiqueta">PERGUNTA {indice + 1} DE {perguntas.length}</span>
        <span className="contador">{indice + 1}/{perguntas.length}</span>
      </div>
      <div className="barra"><div style={{ width: `${((indice + 1) / perguntas.length) * 100}%` }} /></div>
      <h2 className="titulo-pergunta">{atual.pergunta}</h2>
      <div className="opcoes">
        {atual.opcoes.map((opcao, i) => (
          <button
            key={opcao}
            className={`opcao ${resposta === i ? "selecionada" : ""} ${
              mostrarExplicacao && i === atual.correta ? "correta" : ""
            } ${mostrarExplicacao && resposta === i && resposta !== atual.correta ? "errada" : ""}`}
            onClick={() => !mostrarExplicacao && aoResponder(i)}
            disabled={mostrarExplicacao}
          >
            <span className="letra">{String.fromCharCode(65 + i)}</span>
            <span>{opcao}</span>
          </button>
        ))}
      </div>
      {mostrarExplicacao && (
        <div className="explicacao">
          <strong>{resposta === atual.correta ? "Muito bem!" : "Não foi dessa vez!"}</strong>
          <p>{atual.explicacao}</p>
        </div>
      )}
      {!mostrarExplicacao ? (
        <button className="botao principal" disabled={resposta === null} onClick={confirmar}>
          Confirmar resposta
        </button>
      ) : (
        <button className="botao principal" onClick={proxima}>
          {indice === perguntas.length - 1 ? "Ver resultado" : "Próxima pergunta"}
        </button>
      )}
    </section>
  );
}

function Resultado({ pontos, aoReiniciar }) {
  const porcentagem = Math.round((pontos / perguntas.length) * 100);
  let mensagem = "Continue praticando! Você vai evoluir.";
  if (pontos === perguntas.length) mensagem = "Excelente! Você acertou todas.";
  else if (pontos >= 3) mensagem = "Muito bom! Você já sabe bastante coisa.";

  return (
    <section className="painel resultado">
      <div className="icone">🏆</div>
      <p className="etiqueta">QUIZ FINALIZADO</p>
      <h2>Seu resultado</h2>
      <div className="pontuacao">{pontos}<small>/{perguntas.length}</small></div>
      <p className="descricao">{mensagem}</p>
      <div className="barra"><div style={{ width: `${porcentagem}%` }} /></div>
      <p className="percentual">{porcentagem}% de aproveitamento</p>
      <button className="botao principal" onClick={aoReiniciar}>Jogar novamente</button>
    </section>
  );
}

export default function App() {
  const [tela, setTela] = useState("inicio");
  const [indice, setIndice] = useState(0);
  const [resposta, setResposta] = useState(null);
  const [pontos, setPontos] = useState(0);

  // Recupera o progresso salvo quando o aplicativo abre.
  useEffect(() => {
    const salvo = localStorage.getItem("quiz-dsa-progresso");
    if (salvo) {
      try {
        const dados = JSON.parse(salvo);
        if (dados.tela === "pergunta" && dados.indice >= 0 && dados.indice < perguntas.length) {
          setIndice(dados.indice);
          setPontos(dados.pontos || 0);
          setResposta(dados.resposta ?? null);
          setTela("pergunta");
        }
      } catch {
        localStorage.removeItem("quiz-dsa-progresso");
      }
    }
  }, []);

  // Salva o progresso sempre que os dados principais mudam.
  useEffect(() => {
    if (tela === "pergunta") {
      localStorage.setItem("quiz-dsa-progresso", JSON.stringify({ tela, indice, pontos, resposta }));
    }
  }, [tela, indice, pontos, resposta]);

  function comecar() {
    setIndice(0);
    setPontos(0);
    setResposta(null);
    setTela("pergunta");
  }

  function avancar() {
    if (resposta === perguntas[indice].correta) {
      setPontos((valorAtual) => valorAtual + 1);
    }
    if (indice === perguntas.length - 1) {
      setTela("resultado");
      localStorage.removeItem("quiz-dsa-progresso");
    } else {
      setIndice((valorAtual) => valorAtual + 1);
      setResposta(null);
    }
  }

  function reiniciar() {
    localStorage.removeItem("quiz-dsa-progresso");
    setIndice(0);
    setPontos(0);
    setResposta(null);
    setTela("inicio");
  }

  return (
    <main className="pagina">
      <header className="cabecalho">
        <div className="marca"><span className="marca-icone">JS</span><span>Quiz <b>JavaScript</b></span></div>
        <span className="tag-dsa">PROJETO DSA 2026</span>
      </header>

      <div className="conteudo">
        {tela === "inicio" && <Inicio aoComecar={comecar} />}
        {tela === "pergunta" && (
          <Pergunta
            indice={indice}
            resposta={resposta}
            aoResponder={setResposta}
            aoAvancar={avancar}
          />
        )}
        {tela === "resultado" && <Resultado pontos={pontos} aoReiniciar={reiniciar} />}
      </div>

      <footer>Feito para praticar lógica de programação com JavaScript.</footer>
    </main>
  );
}