/*

    configuração do database fica aqui, retirado por segurança

*/

// Inicializar o Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Referência para a lista de atendentes no Firebase
const atendentesRef = database.ref("atendentes");
const atendentesRefNeuro = database.ref("atendentesNeuro");
const atendentesRefCampanha = database.ref("atendentesCampanha");


const buttons = document.querySelectorAll('.adicionar');
const listaAtendentes = document.getElementById('listaAtendentes');
const listaAtendentesNeuro = document.getElementById('listaAtendentesNeuro');
const listaAtendentesCampanha = document.getElementById('listaAtendentesCampanha');
const inputGroups = document.querySelectorAll('.input-group');
const botaoDeletar = document.getElementById("deletar");
const botaoDeletarNeuro = document.getElementById("deletarNeuro");
const botaoDeletarCampanha = document.getElementById("deletarCampanha");



// Adiciona o event listener para cada grupo
inputGroups.forEach((group) => {
    const adicionarBtn = group.querySelector('button');
    const statusSelect = group.querySelector('select');

    // Atualiza a cor do botão de acordo com o status selecionado
    const atualizarCorBotao = (status) => {
        if (status === 'Offline') {
            adicionarBtn.style.backgroundColor = 'rgb(134, 130, 130)'; // Cinza
        } else if (status === 'Online') {
            adicionarBtn.style.backgroundColor = '#28a745'; // Verde
        } else if (status === 'Pausa') {
            adicionarBtn.style.backgroundColor = '#ffc107'; // Amarelo
        }
    };

    // Listener para o dropdown do grupo atual
    statusSelect.addEventListener('change', (event) => {
        const status = event.target.value;
        atualizarCorBotao(status);
        atualizarProximo() // 31/03
      
    });

    // Inicializa a cor do botão com o status padrão
    atualizarCorBotao(statusSelect.value);
})



function adicionarNaLista(nome, horario, key, isNeuro, isCampanha) {

    if (!nome || !horario) {
        console.error(`❌ ERRO: Tentativa de adicionar atendente inválido! Nome: ${nome}, Horário: ${horario}`);
        return;
    }

    const atendenteItem = document.createElement("div");
    atendenteItem.classList.add("atendente-item");
    atendenteItem.setAttribute("data-key", key);

    atendenteItem.innerHTML = `
    <span>${nome}</span>
    <span class="hora">${horario}</span>
`;


    if (isNeuro) {
        listaAtendentesNeuro.prepend(atendenteItem);
    } 
    else if(isCampanha){
        listaAtendentesCampanha.prepend(atendenteItem);
    }
    else {
        listaAtendentes.prepend(atendenteItem);
    }
    // Adiciona no topo da lista

}

function salvarAtendente(nome, isNeuro, isCampanha) {

    if (!nome) {
        console.error("❌ ERRO: Nome do atendente está vazio ou indefinido.");
        return null;
    }

    const horario = new Date().toLocaleTimeString("pt-br", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });


    if (isNeuro) {
        const novoAtendente = atendentesRefNeuro.push(); // Cria um novo nó com ID único
        novoAtendente.set({
            nome,
            horario,
        });

        return { nome, horario, key: novoAtendente.key };
    } 

    else if(isCampanha){
        const novoAtendente = atendentesRefCampanha.push(); // Cria um novo nó com ID único
        novoAtendente.set({
            nome,
            horario,
        });

        return { nome, horario, key: novoAtendente.key };
    }
    
    
    else {

        const novoAtendente = atendentesRef.push(); // Cria um novo nó com ID único
        novoAtendente.set({
            nome,
            horario,
        });

        return { nome, horario, key: novoAtendente.key };
    }


}

// Função para carregar atendentes do Firebase
function carregarAtendentes(isNeuro, isCampanha) {


    if (isNeuro) {
        atendentesRefNeuro.on("value", (snapshot) => {
            listaAtendentesNeuro.innerHTML = ""; // Limpa a lista antes de adicionar
            const dados = snapshot.val();
            if (dados) {
                Object.keys(dados).forEach((key) => {
                    const { nome, horario } = dados[key];
                    adicionarNaLista(nome, horario, key, isNeuro);
                });
            }
        });
        
    }

    if(isCampanha){
        atendentesRefCampanha.on("value", (snapshot) => {
            listaAtendentesCampanha.innerHTML = ""; // Limpa a lista antes de adicionar
            const dados = snapshot.val();
            if (dados) {
                Object.keys(dados).forEach((key) => {
                    const { nome, horario } = dados[key];
                    adicionarNaLista(nome, horario, key,false , isCampanha);
                });
            }
        });
        
    }

    atendentesRef.on("value", (snapshot) => {
        listaAtendentes.innerHTML = ""; // Limpa a lista antes de adicionar
        const dados = snapshot.val();
        if (dados) {
            Object.keys(dados).forEach((key) => {
                const { nome, horario } = dados[key];
                adicionarNaLista(nome, horario, key);
            });
        }
    });
}

botaoDeletar.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja remover todos os atendentes?")) {
        // Remove todos do Firebase
        atendentesRef.remove();
        filaAtendentesRef.remove()

        // Limpa a lista HTML
        listaAtendentes.innerHTML = "";

        alert("Todos os atendentes foram removidos.");
    }
});

botaoDeletarCampanha.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja remover todos os atendentes?")) {
        // Remove todos do Firebase
        atendentesRefCampanha.remove();
    

        // Limpa a lista HTML
        listaAtendentesCampanha.innerHTML = "";

        alert("Todos os atendentes foram removidos.");
    }
});

botaoDeletarNeuro.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja remover todos os atendentes?")) {

        atendentesRefNeuro.remove();


        listaAtendentesNeuro.innerHTML = "";

        alert("Todos os atendentes foram removidos.");
    }
});



document.addEventListener("DOMContentLoaded", () => {
    const divsDosAtendentes = document.querySelectorAll(".input-group");

    divsDosAtendentes.forEach((div) => {

        const nome = div.dataset.nome

        if (!nome) {
            console.warn("Nome do atendente não encontrado na div:", div);
            return;
        }

        const botao = div.querySelector("button"); // Botão adicionar
        const select = div.querySelector("select"); // Dropdown de status

        if (!select) {
            console.warn("Elemento <select> não encontrado dentro da div:", div);
            return;
        }

        const atendentesStatusRef = database.ref(`atendentes/status-select-${nome}`);

        let statusAtual = ""; // Armazena o status atualizado

        const alterarBackGround = (status) => {


            if (status === 'Online') {
                botao.style.backgroundColor = "green";
                botao.style.color = "white";
            } else if (status === 'Pausa') {
                botao.style.backgroundColor = "yellow";
                botao.style.color = "black";
            } else if (status === 'Offline') {
                botao.style.backgroundColor = "rgb(134, 130, 130)";
                botao.style.color = "white";
            }
        }

        // Carregar o valor salvo do Firebase
        atendentesStatusRef.on("value", (snapshot) => {
            if (snapshot.exists()) {
                statusAtual = snapshot.val();
                select.value = statusAtual; // Atualiza o select sem disparar eventos
                alterarBackGround(statusAtual)
            }
        });

        // Salvar o valor do `select` no Firebase
        select.addEventListener("change", (event) => {
            event.stopPropagation();
            statusAtual = select.value; // Atualiza o valor localmente
            atendentesStatusRef.set(statusAtual);
            alterarBackGround(statusAtual); // Atualiza a cor do fundo

        });

        select.addEventListener("click", (event) => {
            event.stopPropagation(); // ⛔ BLOQUEIA a propagação para a div
        });

        div.addEventListener("click", (event) => {
            event.stopPropagation(); // ⛔ BLOQUEIA a propagação para a div
        });


        botao.addEventListener("click", (event) => {


            if (statusAtual === "Online") {
                console.log("Adicionando atendente:", nome);
                const registro = salvarAtendente(nome);

                if (!registro || !registro.nome) {
                    console.error("Erro ao salvar atendente:", nome);
                    return;
                }

            } else {
                alert("Status não é 'Online'. Não adicionado à lista.");
            }

        });
    });
});



document.addEventListener("DOMContentLoaded", () => {
    const divsDosAtendentes = document.querySelectorAll(".input-group-neuro");

    divsDosAtendentes.forEach((div) => {

        const nome = div.dataset.nome

        if (!nome) {
            console.warn("Nome do atendente não encontrado na div:", div);
            return;
        }

        const botao = div.querySelector("button"); // Botão adicionar
        const select = div.querySelector("select"); // Dropdown de status

        if (!select) {
            console.warn("Elemento <select> não encontrado dentro da div:", div);
            return;
        }

        const atendentesStatusRef = database.ref(`atendentes/status-select-${nome}`);

        let statusAtual = ""; // Armazena o status atualizado

        const alterarBackGround = (status) => {


            if (status === 'Online') {
                botao.style.backgroundColor = "green";
                botao.style.color = "white";
            } else if (status === 'Pausa') {
                botao.style.backgroundColor = "yellow";
                botao.style.color = "black";
            } else if (status === 'Offline') {
                botao.style.backgroundColor = "rgb(134, 130, 130)";
                botao.style.color = "white";
            }
        }

        // Carregar o valor salvo do Firebase
        atendentesStatusRef.on("value", (snapshot) => {
            if (snapshot.exists()) {
                statusAtual = snapshot.val();
                select.value = statusAtual; // Atualiza o select sem disparar eventos
                alterarBackGround(statusAtual)
            }
        });

        // Salvar o valor do `select` no Firebase
        select.addEventListener("change", (event) => {
            event.stopPropagation();
            statusAtual = select.value; // Atualiza o valor localmente
            atendentesStatusRef.set(statusAtual);
            alterarBackGround(statusAtual); // Atualiza a cor do fundo
            atualizarProximo() // 31/03

        });

        select.addEventListener("click", (event) => {
            event.stopPropagation(); // ⛔ BLOQUEIA a propagação para a div
        });

        div.addEventListener("click", (event) => {
            event.stopPropagation(); // ⛔ BLOQUEIA a propagação para a div
        });


        botao.addEventListener("click", (event) => {


            if (statusAtual === "Online") {
                console.log("Adicionando atendente:", nome);
                const registro = salvarAtendente(nome, true, false);

                if (!registro || !registro.nome) {
                    console.error("Erro ao salvar atendente:", nome);
                    return;
                }

            } else {
                alert("Status não é 'Online'. Não adicionado à lista.");
            }

        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const divsDosAtendentes = document.querySelectorAll(".input-group-campanha");

    divsDosAtendentes.forEach((div) => {

        const nome = div.dataset.nome

        if (!nome) {
            console.warn("Nome do atendente não encontrado na div:", div);
            return;
        }

        const botao = div.querySelector("button"); // Botão adicionar
        const select = div.querySelector("select"); // Dropdown de status

        if (!select) {
            console.warn("Elemento <select> não encontrado dentro da div:", div);
            return;
        }

        const atendentesStatusRef = database.ref(`atendentes/status-select-${nome}`);

        let statusAtual = ""; // Armazena o status atualizado

        const alterarBackGround = (status) => {


            if (status === 'Online') {
                botao.style.backgroundColor = "green";
                botao.style.color = "white";
            } else if (status === 'Pausa') {
                botao.style.backgroundColor = "yellow";
                botao.style.color = "black";
            } else if (status === 'Offline') {
                botao.style.backgroundColor = "rgb(134, 130, 130)";
                botao.style.color = "white";
            }
        }

        // Carregar o valor salvo do Firebase
        atendentesStatusRef.on("value", (snapshot) => {
            if (snapshot.exists()) {
                statusAtual = snapshot.val();
                select.value = statusAtual; // Atualiza o select sem disparar eventos
                alterarBackGround(statusAtual)
            }
        });

        // Salvar o valor do `select` no Firebase
        select.addEventListener("change", (event) => {
            event.stopPropagation();
            statusAtual = select.value; // Atualiza o valor localmente
            atendentesStatusRef.set(statusAtual);
            alterarBackGround(statusAtual); // Atualiza a cor do fundo
            atualizarProximo() // 31/03

        });

        select.addEventListener("click", (event) => {
            event.stopPropagation(); // ⛔ BLOQUEIA a propagação para a div
        });

        div.addEventListener("click", (event) => {
            event.stopPropagation(); // ⛔ BLOQUEIA a propagação para a div
        });


        botao.addEventListener("click", (event) => {


            if (statusAtual === "Online") {
                console.log("Adicionando atendente:", nome);
                const registro = salvarAtendente(nome, false,true);

                if (!registro || !registro.nome) {
                    console.error("Erro ao salvar atendente:", nome);
                    return;
                }

            } else {
                alert("Status não é 'Online'. Não adicionado à lista.");
            }

        });
    });
});


carregarAtendentes(true,false)
carregarAtendentes(false,true)

const loginForm = document.getElementById('loginForm')
const loginContainer = document.getElementById('loginContainer')
const chatContainer = document.getElementById('chatContainer')
const chatForm = document.getElementById('chatForm')
const userNameDisplay = document.getElementById('usernameDisplay')
const inputNome = document.getElementById("usernameInput")
const inputMessage = document.getElementById("chatInput")
const chatMessages = document.getElementById('chatMessages')
const botaodeleteChat = document.getElementById('deleteChat')


const filaAtendentesRef = database.ref('filaAtendentesRef')

// Mantém a lista atualizada automaticamente


let atualizando = false; // Evita múltiplas atualizações concorrentes

document.addEventListener("DOMContentLoaded", () => {
    atualizarProximo();
});


setInterval(() => {
    if (!atualizando) {
        atualizarProximo();
    }
}, 5000); // Atualiza a fila a cada 5 segundos



// 🔄 Atualiza automaticamente quando um atendente muda de status
filaAtendentesRef.on("child_changed", (snapshot) => {
    
    if (atualizando) return;
    atualizando = true;

    //atualizado 31/03/2025 

    const atendenteAtualizado = snapshot.val();

    
        if (atendenteAtualizado.status === "Online") {
        filaAtendentesRef.child(snapshot.key).once("value", (snap) => {
            const atual = snap.val();
            const ultima = new Date(atual.ultimaInteracao || 0);
            const agora = formatarHoraBrasil()

            // Só atualiza se a última interação for há mais de 2 segundos
            if ((agora - ultima) > 2000) {
                filaAtendentesRef.child(snapshot.key).update({
                    ultimaInteracao: agora.toISOString(),
                }).then(() => {
                    console.log("Interação atualizada para:", atendenteAtualizado.nome);
                    atualizarProximo();
                }).catch(error => console.error("Erro ao atualizar interação:", error));
            }
        });
    } else {
        atualizarProximo();
    }
    

    //atualizarProximo();
    
    atualizando = false;
});



function getProximoAtendente(atendentes) {

    return atendentes
        .filter((a) => a.status === "Online")
        .sort((a, b) => {

            // a vem antes de b
            if(!a.isQuee && b.isQuee) return -1

            // b vem antes de a
            if(a.isQuee && !b.isQuee) return 1


            return (new Date(a.ultimaInteracao).getTime() - new Date(b.ultimaInteracao).getTime())

        })[0]       

}


function atualizarProximo() {
    if (atualizando) return; // Evita chamadas concorrentes
    atualizando = true;

    setTimeout(() => {
        filaAtendentesRef.once("value", (snapshot) => {
            const atendentes = snapshot.val() ? Object.values(snapshot.val()) : [];
            const atendentesFilter = atendentes.filter(atendente => atendente.status === "Online")


            console.log(atendentesFilter)
          
            const proximo = getProximoAtendente(atendentesFilter);


            //console.log("Próximo atendente:", proximo ? proximo.nome : "Nenhum atendente disponível");

            const proximoElemento = document.querySelector("#proximoAtendente");
            if (proximoElemento) {
                proximoElemento.textContent = proximo ? proximo.nome : "Nenhum atendente disponível";
            }

            atualizando = false;
        });
    }, 300);
}


function formatarHoraBrasil() {
    const agora = new Date();
    const opcoes = { 
        year: "numeric", month: "2-digit", day: "2-digit", 
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    };
    return agora.toLocaleString("pt-BR", opcoes);
}


// Delegação de evento para evitar `querySelectorAll`
document.querySelectorAll(".adicionar").forEach((botao) => {
    botao.addEventListener("click", (event) => {
        const divAtendente = event.target.closest(".input-group");
        if (!divAtendente) return;

        const nome = divAtendente.dataset.nome;
        const status = divAtendente.querySelector("select").value; // Seleciona corretamente o <select>

        filaAtendentesRef.once("value", (snapshot) => {
            const atendentes = snapshot.val() || {};
            const chaveAtendente = Object.keys(atendentes).find(
                (key) => atendentes[key].nome === nome
            );

            
           
            const atendenteData = {
                nome,
                ultimaInteracao: formatarHoraBrasil(),
                isQuee: true,
                status,
            };
            
 
            console.log("Enviando para Firebase:", atendenteData);

            if (chaveAtendente) {
                // Atualiza apenas os campos alterados
                filaAtendentesRef.child(chaveAtendente).update(atendenteData)
                    .then(() => {
                        console.log("Atendente atualizado:", atendenteData)
                        atualizarProximo()
                    })
                    .catch((error) => console.error("Erro ao atualizar:", error));

                    
            } else {
                // Adiciona um novo atendente com chave automática
                filaAtendentesRef.push(atendenteData)
                    .then(() => {
                        console.log("Novo atendente adicionado:", atendenteData)
                        atualizarProximo()
                    }) 
                    .catch((error) => console.error("Erro ao adicionar:", error));

                    
            }
        });
    });
});

// 🎯 Atualiza automaticamente ao mudar o status no select
document.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", (event) => {
        const divAtendente = event.target.closest(".input-group");
        if (!divAtendente) return;

        const nome = divAtendente.dataset.nome;
        const status = event.target.value; // Obtém o novo status

        filaAtendentesRef.once("value", (snapshot) => {
            const atendentes = snapshot.val() || {};
            const chaveAtendente = Object.keys(atendentes).find(
                (key) => atendentes[key].nome === nome
            );

            console.log(chaveAtendente)

            if (chaveAtendente) {
                // Atualiza o status no banco de dados
                filaAtendentesRef.child(chaveAtendente).update({ status })
                    .then(() => {
                        console.log("Status atualizado:", nome, status);
                        atualizarProximo(); // 🔥 Atualiza a fila imediatamente
                    })
                    .catch((error) => console.error("Erro ao atualizar:", error));
            }
            else {
    
                 // Se o atendente não estiver no banco, adiciona um novo
                 adicionarNovoAtendente(nome, status);
            }
        });
    });
});

function adicionarNovoAtendente(nome, status) {
    const atendenteData = {
        nome,
        ultimaInteracao: formatarHoraBrasil(),
        isQuee: false,
        status,
    };

    filaAtendentesRef.push(atendenteData)
        .then(() => {
            //console.log("Novo atendente adicionado:", atendenteData);
            atualizarProximo(n);
        })
        .catch((error) => console.error("Erro ao adicionar:", error));
}


 // Seleciona os botões
 const openBtn = document.getElementById("button-campanha-open");
 const closeBtn = document.getElementById("button-campanha-poup");
 const campanhaDiv = document.querySelector(".button-campanha");

 // Evento para abrir
 openBtn.addEventListener("click", () => {
   campanhaDiv.classList.toggle("ativo");
 });

 // Evento para fechar
 closeBtn.addEventListener("click", () => {
   campanhaDiv.classList.remove("ativo");
 });




// tudo referente ao chat 

const messageRef = database.ref('messages').push()


const chatButton = document.getElementById('chatButton');
const chatPopup = document.getElementById('chatPopup');
const closeChat = document.getElementById('closeChat');
const chatFormPopup = document.getElementById('chatFormPopup');
const usernameInputPopup = document.getElementById('usernameInputPopup');
const messageInputPopup = document.getElementById('messageInputPopup');
const chatMessagesPopup = document.getElementById('chatMessagesPopup');

let username = ''; // Armazena o nome do usuário
let unreadMessages = 0;

// Abrir o popup ao clicar no botão flutuante
chatButton.addEventListener('click', () => {
    chatPopup.style.display = 'block';
});

// Fechar o popup ao clicar no botão de fechar
closeChat.addEventListener('click', () => {
    chatPopup.style.display = 'none';
});

// Enviar mensagem
chatFormPopup.addEventListener('submit', (event) => {
    event.preventDefault();

    // Captura o nome do atendente apenas na primeira vez
    if (!username) {
        username = usernameInputPopup.value.trim();
        
        // Se o usuário não preencheu o nome, exibe um alerta
        if (!username) {
            alert('Por favor, digite seu nome antes de entrar no chat.');
            return;
        }

        // Esconder o campo de nome após o login
        usernameInputPopup.style.display = 'none';
    }

    const message = messageInputPopup.value.trim();
    const timestamp = Date.now();

    if (message) {
        database.ref('messages').push({
            username: username,
            text: message,
            timestamp: timestamp
        });

        receiveNewMessage(message)
        unreadMessages = 0
        messageInputPopup.value = ''; // Limpa o campo da mensagem
    }
});

// Atualizar mensagens recebidas
database.ref('messages').on('child_added', (snapshot) => {
    const messageData = snapshot.val();
    

    // Formatar a hora para exibição (HH:mm)
    const messageTime = new Date(messageData.timestamp).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    const newMessage = document.createElement('div');

    newMessage.innerHTML = `<strong>${messageData.username}:</strong> ${messageData.text} <span style="font-size: 12px; color: gray;">(${messageTime})</span>`;

    chatMessagesPopup.appendChild(newMessage);
    chatMessagesPopup.scrollTop = chatMessagesPopup.scrollHeight;

     // Exibir alerta para todos os usuários, exceto para quem enviou a mensagem
     if (messageData.username !== username) {
        alert(`Nova mensagem de ${messageData.username}: ${messageData.text}`);
    }
});


function receiveNewMessage(message) {
    alert(message)
}


  clearChat.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja apagar todas as mensagens?")) {
      chatMessagesPopup.innerHTML = "";
      database.ref('messages').remove() // Remove todas as mensagens do banco
      unreadMessages = 0;
      alert("todas mensagens foram deletadas")
    }
  });