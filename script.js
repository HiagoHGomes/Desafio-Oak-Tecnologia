function renderMercadorias(mercadoriasData){
    let mercadorias = document.createElement('ul');
    mercadorias.id = `idMercadoria-${mercadoriasData.id}`;
    mercadorias.classList.add('mercadorias');

    let nomeMercadoria = document.createElement('li');
    nomeMercadoria.classList.add('nomeMercadoria');
    nomeMercadoria.textContent = `Nome: ${mercadoriasData.name}`;

    // let descricaoMercadoria = document.createElement('li');
    // descricaoMercadoria.classList.add('descricaoMercadoria');
    // descricaoMercadoria.textContent = `Descrição: ${mercadoriasData.description}`

    let precoMercadoria = document.createElement('li');
    precoMercadoria.classList.add('precoMercadoria');
    precoMercadoria.textContent = `Preço R$ ${mercadoriasData.value}`;

    let atualizarBtn = document.createElement('button');
    atualizarBtn.classList.add('botoes');
    atualizarBtn.id = "atualizarBtn"
    atualizarBtn.textContent = "Editar!";
    //Fazer com que os dados que estão sendo editados vá para o input:
    atualizarBtn.addEventListener('click', ()=>{
        document.querySelector('#id').value = mercadoriasData.id;
        document.querySelector('#name').value = mercadoriasData.name;
        document.querySelector('#descricao').value = mercadoriasData.description;
        document.querySelector('#value').value = mercadoriasData.value;
        document.querySelector('input[name="opcao"]:checked').value = mercadoriasData.available;
    })

    let deletarBtn = document.createElement('button');
    deletarBtn.classList.add('botoes');
    deletarBtn.id = "deletarBtn"
    deletarBtn.textContent = "Deletar";
    //Função para deletar:
    deletarBtn.addEventListener('click', async ()=>{
        await fetch(`http://localhost:3000/mercadorias/${mercadoriasData.id}`, {method: 'DELETE'})
        //Remover da tela:
        deletarBtn.parentElement.remove()
    })

    mercadorias.append(nomeMercadoria, precoMercadoria, atualizarBtn, deletarBtn);

    document.querySelector("#mercadoriasAll").appendChild(mercadorias);
}

//Requisição get:
async function fetchmercadorias(){
   let result = await fetch('http://localhost:3000/mercadorias').then(res=> res.json());
   result.forEach(renderMercadorias)
}

//Quando a pagian carregar, chamar a função.
document.addEventListener('DOMContentLoaded', fetchmercadorias)



// Requisição post:
let form = document.querySelector("form");

form.addEventListener('submit', async(ev)=>{
    ev.preventDefault();

    let mercadoriasData = {
        name: document.querySelector('#name').value,
        description: document.querySelector('#descricao').value,
        value: parseFloat(document.querySelector('#value').value),
        available: document.querySelector('input[name="opcao"]:checked').value
    }

    //Para usar na atualização:
    let id = document.querySelector("#id").value;
    if(id){
        // Editar transação existente:
        let response = await fetch(`http://localhost:3000/mercadorias/${id}`,{
            method: 'PUT',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(mercadoriasData)
        })
        let savedmercadorias = await response.json();
        document.querySelector(`#idMercadoria-${mercadoriasData.id}`).remove()
        form.reset();
        renderMercadorias(savedmercadorias);
    }else{
        //Criar nova transação:
        let response = await fetch('http://localhost:3000/mercadorias', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
              },
            body: JSON.stringify(mercadoriasData)
        })
    
        let savedmercadorias = await response.json();
        renderMercadorias(savedmercadorias);
    }   
    form.reset();
    
})

form.reset();