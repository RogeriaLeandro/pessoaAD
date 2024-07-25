document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("pessoaForm");
    const cancelButton = document.getElementById("cancelButton");
    const pessoaIdInput = document.getElementById("pessoaId");
    const nomeInput = document.getElementById("nome");
    const idadeInput = document.getElementById("idade");
    const pessoasTableBody = document.getElementById("pessoasTableBody");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const pessoaId = pessoaIdInput.value;
        const nome = nomeInput.value;
        const idade = idadeInput.value;

        if (pessoaId) {
            updatePessoa(pessoaId, nome, idade);
        } else {
            createPessoa(nome, idade);
        }
    });

    cancelButton.addEventListener("click", function () {
        resetForm();
    });

    function createPessoa(nome, idade) {
        fetch("/api/pessoas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, idade })
        })
        .then(response => response.json())
        .then(pessoa => {
            addPessoaToTable(pessoa);
            resetForm();
        });
    }

    function updatePessoa(id, nome, idade) {
        fetch(`/api/pessoas/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, idade })
        })
        .then(response => response.json())
        .then(pessoa => {
            const row = document.querySelector(`[data-id='${id}']`);
            row.querySelector(".nome").textContent = pessoa.nome;
            row.querySelector(".idade").textContent = pessoa.idade;
            resetForm();
        });
    }

    function deletePessoa(id) {
        fetch(`/api/pessoas/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            const row = document.querySelector(`[data-id='${id}']`);
            row.remove();
        });
    }

    function addPessoaToTable(pessoa) {
        const row = document.createElement("tr");
        row.setAttribute("data-id", pessoa.id);
        row.innerHTML = `
            <td>${pessoa.id}</td>
            <td class="nome">${pessoa.nome}</td>
            <td class="idade">${pessoa.idade}</td>
            <td>
                <button onclick="editPessoa(${pessoa.id})">Editar</button>
                <button onclick="deletePessoa(${pessoa.id})">Excluir</button>
            </td>
        `;
        pessoasTableBody.appendChild(row);
    }

    function resetForm() {
        pessoaIdInput.value = "";
        nomeInput.value = "";
        idadeInput.value = "";
    }

    function loadPessoas() {
        fetch("/api/pessoas")
        .then(response => response.json())
        .then(pessoas => {
            pessoas.forEach(addPessoaToTable);
        });
    }

    loadPessoas();

    window.editPessoa = function (id) {
        fetch(`/api/pessoas/${id}`)
        .then(response => response.json())
        .then(pessoa => {
            pessoaIdInput.value = pessoa.id;
            nomeInput.value = pessoa.nome;
            idadeInput.value = pessoa.idade;
        });
    };

    window.deletePessoa = deletePessoa;
});
