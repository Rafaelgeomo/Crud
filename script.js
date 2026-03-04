const tarefa = document.getElementById("input-tarefa");
const botaoAdicionar = document.getElementById("botao-adicionar");
const listaTarefa = document.getElementById("lista-tarefa");
const popup = document.getElementById("meu-popup");
const fecharPopup = document.getElementById("fechar-popup");

// --- EVENTOS PRINCIPAIS ---

// Carregar dados assim que abrir a página
document.addEventListener("DOMContentLoaded", carregarDados);

botaoAdicionar.addEventListener("click", () => {
   const valor = tarefa.value;
   if (valor === "") {
      popup.style.display = "flex";
   } else {
      adicionarTarefaNaTela(valor);
      tarefa.value = "";
      tarefa.focus();
      salvarDados(); // Salva após adicionar
   }
});

fecharPopup.addEventListener("click", () => {
   popup.style.display = "none";
   tarefa.focus();
});

// --- A "FÁBRICA" DE TAREFAS ---

function adicionarTarefaNaTela(texto, concluida = false) {
   const textoLista = document.createElement("li");
   // Criamos um span para o texto para não bugar com os botões
   const spanTexto = document.createElement("span");
   spanTexto.innerText = texto;

   if (concluida) {
      spanTexto.classList.add("concluida");
   }
   // LÓGICA DO CLIQUE:
   spanTexto.onclick = () => {
      spanTexto.classList.toggle("concluida"); // Adiciona ou remove a classe ao clicar
      salvarDados(); // Salva o novo estado (riscado ou não)
      atualizarContador()
   };
   textoLista.appendChild(spanTexto);

   const divBotoes = document.createElement("div");
   divBotoes.classList.add("area-botoes");

   // Botão Editar
   const botaoEditar = document.createElement("button");
   botaoEditar.classList.add("btn-edit");
   botaoEditar.innerHTML = '<i class="bi bi-pencil-square"></i>';
   botaoEditar.onclick = () => {
      const novoTexto = prompt("Edite sua tarefa:", spanTexto.innerText);
      if (novoTexto !== null && novoTexto.trim() !== "") {
         spanTexto.innerText = novoTexto;
         salvarDados(); // Salva após editar
         atualizarContador()
      }
   };

   // Botão Remover
   const botaoRemover = document.createElement("button");
   botaoRemover.classList.add("btn-delete");
   botaoRemover.innerHTML = '<i class="bi bi-trash"></i>';
   botaoRemover.onclick = () => {
      textoLista.remove();
      salvarDados(); // Salva após remover
      atualizarContador();
   };

   divBotoes.appendChild(botaoEditar);
   divBotoes.appendChild(botaoRemover);
   textoLista.appendChild(divBotoes);
   listaTarefa.appendChild(textoLista);
   atualizarContador();
}

// --- FUNÇÕES DE MEMÓRIA (LocalStorage) ---

function salvarDados() {
   const todosOsItens = document.querySelectorAll("li");
   const arrayTarefas = [];

   todosOsItens.forEach(li => {
      const span = li.querySelector("span");
      arrayTarefas.push({
         texto: span.innerText,
         pronta: span.classList.contains("concluida") // Salva true ou false
      });
   });

   localStorage.setItem("lista_tarefas", JSON.stringify(arrayTarefas));
}

function carregarDados() {
   const dados = localStorage.getItem("lista_tarefas");
   if (dados) {
      const tarefasRecuperadas = JSON.parse(dados);

      tarefasRecuperadas.forEach(t => {
         // Verificamos se 't' é um objeto. Se for texto antigo, ignoramos ou tratamos
         if (typeof t === "object" && t.texto) {
            adicionarTarefaNaTela(t.texto, t.pronta);
         } else if (typeof t === "string") {
            // Caso ainda tenha restos de textos simples, ele carrega sem erro
            adicionarTarefaNaTela(t, false);
         }
      });
   };
   atualizarContador()
};

function atualizarContador() {
   const pendentes = document.querySelectorAll("li span:not(.concluida)").length;
   const elementoContador = document.getElementById("contador");

   if (pendentes === 1) {
      elementoContador.innerText = `Você tem 1 tarefa pendente`;
   } else {
      elementoContador.innerText = `Você tem ${pendentes} tarefas pendentes`;
   }
};






