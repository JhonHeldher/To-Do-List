
const localStorageKey = 'to-do-list-gn'
const localStorageKeyTrash = 'to-do-list-Th'
const toggleSwitch = document.querySelector('.toggle-switch input[type="checkbox"]');
const body = document.querySelector('body');

toggleSwitch.addEventListener('change', function() {
    if (this.checked) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }    
});
/* ========================================================================== */
function validateExistsTask(){
	let values =  JSON.parse(localStorage.getItem(localStorageKey) || "[]")
	let inputValue = document.getElementById('input-new-task').value
	let exists = values.find(x => x.name == inputValue)
	return !exists ? false : true
}
/* ========================================================================== */
function newTask() {
  let input = document.getElementById('input-new-task');

  // validação
  if (!input.value) {
    alert('Digite algo para inserir em sua lista');
  } else if (validateExistsTask()) {
    alert('Já existe uma task com essa descrição');
  } else {
    // incremente to localstorage
    let values = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
    values.push({
      name: input.value,
    });
    localStorage.setItem(localStorageKey, JSON.stringify(values));
    
    input.value = '';
    showValues();
  } 
  
}
/* ========================================================================== */
function searchItems() {
  let searchTerm = document.getElementById('search-input').value; // Obtém o valor do termo de pesquisa
  let values = JSON.parse(localStorage.getItem(localStorageKey) || "[]"); // Obtém os itens do localStorage
  let list = document.getElementById('to-do-list');
  
  // Filtra os itens com base no termo de pesquisa
  let filteredValues = values.filter(item => item['name'].toLowerCase().includes(searchTerm.toLowerCase()));
  
  // Limpa a lista antes de exibir os resultados
  list.innerHTML = '';
  
  for (let i = 0; i < filteredValues.length; i++) {
    list.innerHTML += `<li>${filteredValues[i]['name']}
      <button id="btc-trash" onclick='removeItemDef("${filteredValues[i]['name']}")'>
      </button></li>`;
  }
  
  // Se não houver resultados, exibe uma mensagem de aviso
  if (filteredValues.length === 0) {
    list.innerHTML = '<li>Nenhum resultado encontrado</li>';
  }
}
document.getElementById('search-input').addEventListener('input', searchItems);

/* ========================================================================== */

function showValues() {
  let values = JSON.parse(localStorage.getItem(localStorageKey) || "[]");
  let list = document.getElementById('to-do-list');
  let allBadge = document.getElementById('all-badge');
  let doneBadge = document.getElementById('done-badge'); // Obter o elemento do badge
  
  // Remover classe de cor dos elementos
  document.getElementById('click-done').classList.remove('option-clicked');
  document.getElementById('click-trash').classList.remove('option-clicked');
  
  // Adicionar classe de cor ao elemento desejado
  document.getElementById('click-all').classList.add('option-clicked');
  
  list.innerHTML = '';
  let count = 0; // Contador para itens concluídos
  for (let i = 0; i < values.length; i++) {
    list.innerHTML += `
      <li>
        <div id="btn-star">
          <label id="ch">
            <input id="check" title="Clique para concluir Task" type="checkbox" onchange='updateCheckbox("${values[i]['name']}", this.checked)' ${values[i]['checked'] ? 'checked' : ''}>
            <span class="checkbox"></span>
          </label>
          ${values[i]['name']} 
        </div>
        <div id="btn-fim">
          <button id='btn-edit' title="Editar Task" onclick='editItem("${values[i]['name']}")'>
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
            </svg>
          </button>
          <button id='btn-excluir' title="Mover para lixeira" onclick='removeItem("${values[i]['name']}")'>
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
            </svg>
            <span class="badge" id="trash-badge"></span>
          </button>
        </div>
      </li>`;
    
    if (values[i]['checked']) { // Verifica se o item foi marcado como checado
      count++; // Incrementa o contador de itens concluídos
    }
  }
  
  allBadge.textContent = values.length;
  doneBadge.textContent = count; // Atualiza o valor do badge done-badge
}



/* ========================================================================== */

function showValuesTrash() {
  let valuesTrash = JSON.parse(localStorage.getItem(localStorageKeyTrash) || "[]");
  let list = document.getElementById('to-do-list');
  let trashBadge = document.getElementById('trash-badge'); // Obter o elemento do badge
  
  // Remover classe de cor dos elementos
  document.getElementById('click-all').classList.remove('option-clicked');
  document.getElementById('click-done').classList.remove('option-clicked');

  // Adicionar classe de cor ao elemento desejado
  document.getElementById('click-trash').classList.add('option-clicked');


  list.innerHTML = '';
  for (let i = 0; i < valuesTrash.length; i++) {
    list.innerHTML += `<li>${valuesTrash[i]['name']}
      <button id="btc-trash" title="Excluir definitivamente  a Task" onclick='removeItemDef("${valuesTrash[i]['name']}")'>
        <svg id="op" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
        </svg>
      </button></li>`;
  }
  trashBadge.textContent = valuesTrash.length; // Atualizar o valor do badge com a contagem de itens na lixeira
}
function pushTrash() {
  showValuesTrash();
}
/* ========================================================================== */
function showValuesDone() {
  let values = JSON.parse(localStorage.getItem(localStorageKey) || "[]");
  let list = document.getElementById('to-do-list');
  let doneBadge = document.getElementById('done-badge');
  
  document.getElementById('click-all').classList.remove('option-clicked');
  document.getElementById('click-trash').classList.remove('option-clicked');
  document.getElementById('click-done').classList.add('option-clicked');
  let count = 0;
  list.innerHTML = '';
  for (let i = 0; i < values.length; i++) {
    if (values[i]['checked']) {
      list.innerHTML += `<li>${values[i]['name']}
        <button id="btc-trash" title="Mover para lixeira" onclick='removeItem("${values[i]['name']}")'>
        <svg id="op" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
        </svg>
        </button></li>`
        count++;
    }
  }
  doneBadge.textContent = count;
  
  // Atualizar o badge de concluídos
  doneBadge.textContent = count;
}

/* ========================================================================== */
function editItem(data) {
  let values = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
  let index = values.findIndex((x) => x.name == data);

  // Exibe o pop-up de edição
  document.getElementById('edit-input').value = values[index].name;
  document.getElementById('popup').style.display = 'flex';

  // Salva a edição quando o botão Salvar é clicado
  document.getElementById('edit-save').addEventListener('click', function() {
    let newTaskName = document.getElementById('edit-input').value;
    values[index].name = newTaskName;
    localStorage.setItem(localStorageKey, JSON.stringify(values));
    closePopup();
    showValues()
  }
 
  );

  // Fecha o pop-up quando o botão Cancelar é clicado
  document.getElementById('edit-cancel').addEventListener('click', function() {
    closePopup();
  });

  // Função para fechar o pop-up
  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }
}

// ==========================================================================================================================================
function removeItem(data) {
  let values = JSON.parse(localStorage.getItem(localStorageKey) || "[]");
  let index = values.findIndex(x => x.name == data);
  let task = values.splice(index, 1)[0];
  localStorage.setItem(localStorageKey, JSON.stringify(values));
  
  // Adiciona a tarefa ao localStorage com a chave localStorageKeyTrash
  let valuesTrash = JSON.parse(localStorage.getItem('to-do-list-Th') || "[]");
  valuesTrash.push(task);
  localStorage.setItem('to-do-list-Th', JSON.stringify(valuesTrash));
  
  let trashBadge = document.getElementById('trash-badge'); // Obter o elemento do badge
  trashBadge.textContent = valuesTrash.length; // Atualizar o valor do badge com a contagem de itens removidos
  
  showValues();
}

// ==========================================================================================================================================

function removeItemDef(data) {
  let valuesTrash = JSON.parse(localStorage.getItem(localStorageKeyTrash) || "[]");
  let index = valuesTrash.findIndex(x => x.name == data);
  let task = valuesTrash.splice(index, 1)[0];
  localStorage.setItem(localStorageKeyTrash, JSON.stringify(valuesTrash));
  
  showValuesTrash();
}
// ==========================================================================================================================================
function updateCheckbox(data, checked) {
  let values = JSON.parse(localStorage.getItem(localStorageKey) || "[]");
  let index = values.findIndex(x => x.name == data);
  values[index]['checked'] = checked;
  localStorage.setItem(localStorageKey, JSON.stringify(values));
  showValues();
}
function checkItem(data, checked){
	let values =  JSON.parse(localStorage.getItem(localStorageKey) || "[]")
	let index = values.findIndex(x => x.name == data)
  values[index]['checked'] = checked;
  values[index]['checked'] = checked; // Atualiza o estado do checkbox no objeto de tarefa
  localStorage.setItem(localStorageKey, JSON.stringify(values));
}
// ==========================================================================================================================================

showValuesTrash()
showValuesDone()
showValues();



