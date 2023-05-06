import { GithubApi } from "./GithubApi.js";

class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {
            const userAlreadyExists = this.entries.find(entry => entry.login.toUpperCase() === username.toUpperCase())

            if (userAlreadyExists) {
                throw new Error('Usuário já cadastrado')
            }

            const user = await GithubApi.get_user(username)

            if (!user) {
                throw new Error('Usuário não encontrado')
            }

            this.entries = [user, ...this.entries]

            this.save()
            this.update()
        } catch (error) {
            alert(error.message)
        }

    }

    delete(user) {
        this.entries = this.entries.filter(entry => entry !== user)
        this.save()
        this.update()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('tbody')

        this.onadd()
        this.update()
    }

    onadd() {
        const input = document.querySelector('.input-search input')
        const button = document.querySelector('.add-button')

        const add = () => {
            if(input.value === "") return

            this.add(input.value)

            input.value = ""
        }
        
        input.onkeypress = (event) => {
            if(event.key == "Enter") {
                add()
            }
        }

        button.onclick = () => {
            add()
        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach(entry => this.createRow(entry))
    }

    createRow(user) {
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td>
                <div class="user">
                    <img src="${user.avatar_url}" alt="Imagem de ${user.login}">

                        <a href="${user.html_url}" target="_blank">
                            <p>${user.name}</p>
                            <span>/${user.login}</span>
                        </a>
                </div>
            </td>

            <td class="repositories">${user.public_repos}</td>

            <td class="followers">${user.followers}</td>

            <td class="">
                <button class="remove">Remover</button>
            </td>
        `

        const removeButton = tr.querySelector('.remove')

        removeButton.onclick = () => {
            const isOk = confirm(`Deseja realmente excluir ${user.login} da sua lista de favoritos?`)

            if(isOk) {
                this.delete(user)
            }
        }

        this.tbody.appendChild(tr)
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach(tr => tr.remove())
    }
}