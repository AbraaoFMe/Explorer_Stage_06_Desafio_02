export class GithubApi {
    static get_user(username) {
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
            .then(data => data.json())
            .then(({ login, name, public_repos, followers, avatar_url, html_url }) => {
                if (!login) {
                    return false
                }

                return {
                    login,
                    name,
                    public_repos,
                    followers,
                    avatar_url,
                    html_url
                }
            })

    }
}