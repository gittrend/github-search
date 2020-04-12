
$(document).ready(function () {
    
    let connection;

const htLoad1 = "<div class='loader'><div class='dot four'></div><div class='dot five'></div><div class='dot six'></div></div>";
const htLoad2 = "<div class='switchbox'><div class='switch'></div><div class='switch' id='switch2'></div></div>";
const htLoad3 = "<div class='bouncybox col s2'><div class='bouncy'></div></div>";

const card = `
<div class='col s4 m3 l3'>
    <div class='card'>
        <div class='card-image'>
            <img src='@avatar_url'>
            <span class='card-title black-text'>@name</span>
            <a class='btn-floating halfway-fab waves-effect activator waves-light deep-purple lighten-1'><i class='material-icons'>assignment_ind</i></a>
        </div>
        <div class='card-content'>
            <p>Nome do perfil: <strong>@sub_name</strong></p>
            <p>@desc</p>
        </div>
        <div class='card-action text-center  blue-grey lighten-4'>
            <a href='@html_url'>Acessar Perfil</a>
        </div>
        <div class='card-reveal'>
            <span class='card-title grey-text text-darken-4'>Card Title<i class='material-icons right'>close</i></span>
            <ul class='collapsible'>
                <li>
                    <div class='collapsible-header'><i class='material-icons deep-purple-text text-lighten-1'>folder_open</i>Repositórios<span class="new badge brown lighten-1" data-badge-caption="public">@num_repos</span></div>
                    <div class='collapsible-body'>
                        <span class='card-title'>@repo_name</span>
                        <a href=''>@repo_url< target='_blank'/a>
                    </div>
                </li>
                <li>
                    <div class='collapsible-header'><i class='material-icons deep-purple-text text-lighten-1'>group</i>Seguidores(as)<span class="new badge brown lighten-1" data-badge-caption="">@num_followers</span></div>
                    <div class='collapsible-body'>
                        <span class='card-title'>@follower</span>
                        <a href='@follower_url' target='_blank'>Ver Seguidores</a>
                    </div>
                </li>
                <li>
                    <div class='collapsible-header'><i class="material-icons deep-purple-text text-lighten-1">group</i>Seguem<span class="new badge brown lighten-1" data-badge-caption="">@num_followings</span></div>
                    <div class='collapsible-body'>
                        <span class='card-title'>@following</span>
                        <a href='@following_url' target='_blank'>Ver Amigos</a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>`;

const card2 = `
<div class='col s6 m6'>
    <div class='card horizontal z-depth-2'>
    <div class='card-image col s5 mt-30'>
        <img src='@avatar_url'>
    </div>
    <div class='card-stacked'>
        <div class='card-header text-center'>
            <span class='card-title'>@title</span>
        </div>
        <div class='card-content p-1'>
            <p>Nome: <strong>@name</strong></p>
            <p>Linguagem: <strong>@language</strong></p>
            <p>@desc</p>
        </div>
        <div class='card-action'>
        <a class='deep-purple-text text-lighten-1' href='@html_url' target='_blank'>Acessar repositório</a>
        </div>
    </div>
    </div>
</div>`;

const notResult = "<div class='center-align col s5  p-10  push-s3 lime lighten-2'><p>Nenhum resultado encontrado</p></div>";

const btnSearch = document.querySelector("#btnSearch");
const box_load =  document.querySelector("#load");
const iptitem = document.querySelector("#iptitem");
const filtro = document.querySelector("#filtro");
const result = document.querySelector("#result");

window.onoffline = () => {statusConnnection("Você está offline")}


function statusConnnection(msg) {
    M.toast({html:`${msg}`,classes:"purple darken-1"});
    document.onload = document.documentURI;
}

/**
 * 
 * @param {Boolean} setload 
 * @param {Element} obj 
 */
function load(obj = Element , setload = false) {
    (setload)? obj.innerHTML = htLoad1 : setTimeout(() => {obj.innerHTML = ""},10);
}

/**
 * 
 * @param {String}  page
 * @param {String} limit 
 */
async function searchGithub(page = 0, limit = 10) {
    if(!iptitem.value) return M.toast({html:"Não posso buscar um valor vázio",classes: "toast toast-alert"});
    
    load(box_load,true);
    
    let url;
    let newCard = "";
    let count = 0;
    const query =  iptitem.value.replace(" ","+");

    const opt = !filtro.value || filtro.value > '3' ?  1 : parseInt(filtro.value);

    switch(opt) {
        case 1:
            url = `https://api.github.com/search/users?q=${query}&page=${page}&per_page=${limit}`;
            break;
        case 2:
            url = `https://api.github.com/search/repositories?q=${query}&page=${page}&per_page=${limit}`;
            break;
        case 3:
            url =`https://api.github.com/orgs/${query}?page=${page}&per_page=${limit}`;
            break;
    }

    const response  = await axios.get(url);
    
    if(response.data.total_count == 0) return (load(box_load), result.innerHTML = notResult);
    
    const {items} = response.data;
    result.innerHTML = "";
    switch(opt) {
        case 1:card
                if(items.length > 1) 
                {

                    for(item of items) {
                        const res =  await axios.get(item.url);
                        // const followers = await axios.get(`${item.followers_url}?page=${page}&per_page=${limit=4}`);
                        // const repos = await axios.get(`${item.subscriptions_url}?page=${page}&per_page=${limit=4}`);
                        
                        newCard = card.replace("@name",res.data.name)
                            .replace("@desc",res.data.bio)
                            .replace("@avatar_url",res.data.avatar_url)
                            .replace("@sub_name",res.data.login)
                            .replace("@html_url",res.data.html_url)
                            .replace("@num_repos",res.data.public_repos)
                            .replace("@num_followers",res.data.followers)
                            .replace("@num_followings",res.data.following)
                            // for (repo of repos.data) {
                            //     card.replace("@repo_name", repo.name)
                            //         .replace("@repo_url", repo.html_url)
                            // }
                            // for (follower of followers.data) {
                            //     card.replace("@follower",follower.name)
                            //         .replace("@follower_url",follower.html_url)
                            // }
                        
                        result.innerHTML += newCard; 
                    };
                } else 
                {
                    const res =  await axios.get(items[0].url);
                    const repos = await axios.get(`${items[0].repos_url}?page=${page}&per_page=${limit=4}`);
                    const followers = await axios.get(`${items[0].followers_url}?page=${page}&per_page=${limit=4}`);

                    newCard = card.replace("@avatar_url",items[0].avatar_url)
                        .replace("@sub_name",items[0].login)
                        .replace("@html_url",items[0].html_url) 
                        .replace("@name",res.data.name)
                        .replace("@desc",res.data.bio)
                        .replace("@num_repos",res.data.public_repos)
                        .replace("@num_followers",res.data.followers)
                        .replace("@num_followings",res.data.following)
                        for (repo of repos.data) {
                            card.replace("@repo_name", repo.name)
                                .replace("@repo_url", repo.html_url)
                        }
                        for (follower of followers.data) {
                            card.replace("@follower",follower.name)
                                .replace("@follower_url",follower.html_url);
                        }
                    result.innerHTML = newCard; 
                }
            break;
        case 2:
            if(items.length > 1) 
            {
                for(item of items) {
                    newCard = card2.replace("@avatar_url",item.owner.avatar_url)
                        .replace("@title",item.name)
                        .replace("@name",item.owner.login)
                        .replace("@language",item.language)
                        .replace("@desc",item.description)
                        .replace("@html_url", (!item.private)? item.html_url : "");
                    result.innerHTML += newCard;
                }    
            } else 
            {
                console.log(items[0].avatar_url);
                newCard = card2.replace("@avatar_url",items[0].owner.avatar_url)
                        .replace("@title",items[0].name)
                        .replace("@name",items[0].owner.login)
                        .replace("@language",items[0].language)
                        .replace("@desc",items[0].description)
                        .replace("@html_url", (!items[0].private)? items[0].html_url : "");
                    result.innerHTML += newCard;
            }
            break;
        case 3:
            break;
    }
    load(box_load);
}

btnSearch.onclick = () => {searchGithub()};

iptitem.onkeyup = (evt) => { if(evt.keyCode == 13) searchGithub() };

$('select').formSelect();
$('.collapsible').collapsible();
});

