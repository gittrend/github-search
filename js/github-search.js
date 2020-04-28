$('div select').formSelect();
const btnSearch = document.querySelector("#btnSearch") ? document.querySelector("#btnSearch") : "" ;
const iptitem = document.querySelector("#iptitem") ? document.querySelector("#iptitem") : "";
let newCard = "";
let newCard2 = "";
let newCard3 = ""; 
const BASE_URL = "https://api.github.com";

const htLoad1 = "<div class='loader'><div class='dot four'></div><div class='dot five'></div><div class='dot six'></div></div>";
const htLoad2 = "<div class='bouncybox col s2 item-load'><div class='bouncy'></div></div>";
const notResult = "<div class='center-align col s5  p-10  push-s3 lime lighten-2'><p>Nenhum resultado encontrado</p></div>";

const card = `
<div class='col s6 m6'>
            <div class='card horizontal z-depth-2'>
                <div class='card-image col s5 blue-grey lighten-4'>
                    <img class='mt-30' src='@avatar_url'>
                </div>
                <div class='card-stacked'>
                   <div class="card-header text-center position-relative">
                        <span class="card-title black-text">@name</span>
                        <a class='btn-floating halfway-fab waves-effect activator waves-light deep-purple lighten-3'><i class='material-icons'>assignment_ind</i></a>
                   </div>
                    <div class='card-content p-1 auto-scroll'>
                        <p>Nome do perfil: <strong>@sub_name</strong></p>
                        <p>@desc</p>
                    </div>
                    <div class='card-action fixed text-center'>
                        <a href='@html_url' target='_blank'>Acessar Perfil</a>
                    </div>
                </div>
                <div class='card-reveal'>
                    <span class='card-title grey-text text-darken-4'>Card Title<i class='material-icons right'>close</i></span>
                    <ul class='collapsible' id='collapsible'>
                        <li>
                            <div class='collapsible-header'><i class='material-icons deep-purple-text text-lighten-1'>folder_open</i>Repositórios<span class="new badge brown lighten-1" data-badge-caption="public">@num_repos</span></div>
                            <div class='collapsible-body'>
                                <a href='./repositors.html?repos=@repo_url&page=0&per_page=10' target='_blank'>Ver repositórios</a>
                            </div>
                        </li>
                        <li>
                            <div class='collapsible-header'><i class='material-icons deep-purple-text text-lighten-1'>group</i>Seguidores(as)<span class="new badge brown lighten-1" data-badge-caption="">@num_followers</span></div>
                            <div class='collapsible-body'>
                                <a href='./amigos.html?friends=@follower_url&follow=followers&page=0&per_page=10' target='_blank'>Ver Seguidores</a>
                            </div>
                        </li>
                        <li>
                            <div class='collapsible-header'><i class="material-icons deep-purple-text text-lighten-1">group</i>Seguem<span class="new badge brown lighten-1" data-badge-caption="">@num_followings</span></div>
                            <div class='collapsible-body'>
                                <a href='./amigos.html?friends=@following_url&follow=following&page=0&per_page=10' target='_blank'>Ver Amigos</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>`;

const card2 = `
<div class='col s6 m6'>
    <div class='card horizontal z-depth-2'>
    <div class='card-image col s5 blue-grey lighten-4'>
        <img class='mt-30' src='@avatar_url'>
    </div>
    <div class='card-stacked'>
        <div class='card-header text-center'>
            <span class='card-title'>@title</span>
        </div>
        <div class='card-content p-1 auto-scroll'>
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

const methods = {
    /**
    * 
    * @param {Object} obj 
    */
    setMessage: (obj) => {
        M.toast(obj);
    },
    /**
    *
    * @param {Boolean} setload
    */
    load: (setload = false) => {
       const boxLoad = document.createElement("div");
       $(boxLoad).attr("class","boxLoad");
       boxLoad.innerHTML = htLoad1;
       (setload)?  $(document.body).append(boxLoad): setTimeout(() => {$('.boxLoad').remove()},10);
   },
    /**
     * 
     * @param {String} valuestring 
     */
   convertObjectChaveValor: (valuestring) => {
    
    const data = valuestring.split("&");

    let res = data.map((valor,index) => {
        const arrayExpire = valor.split("=");
        let chav = arrayExpire[0];
        let val = arrayExpire[1];
        let objChaveValor = `"${chav}": "${val}"`;

        return objChaveValor;
    });

    const obj = `{${res.toString()}}`;

    return obj;
}
}



 const github_search = {
    /**
     * 
     * @param {String}  page
     * @param {String} limit 
     */

    search: async (page = 0, limit = 10) => {
        try
        {
        const filtro = document.querySelector("#filtro");
        const result = document.querySelector("#result");

            if(!iptitem.value) return setMessage({html:"Não posso buscar um valor vázio",classes: "toast toast-alert"});

            methods.load(true);
            
            let url;
            result.innerHTML = "";
            const query =  iptitem.value.replace(" ","+").toLowerCase();
            const opt = !filtro.value || filtro.value > '3' ?  1 : parseInt(filtro.value.trim());
        
            switch(opt) {
                case 1:
                    url = `/search/users?q=${query}&page=${page}&per_page=${limit}`;
                    break;
                case 2:
                    url = `/search/repositories?q=${query}&page=${page}&per_page=${limit}`;
                    break;
                case 3:
                    url =`/orgs/${query}?page=${page}&per_page=${limit}`;
                    break;
            }
        
            const response  = await axios.get(BASE_URL+url);
            
            if(response.data.total_count == 0) return (methods.load(false), result.innerHTML = notResult);
            
            const {items} = response.data;
            switch(opt) {
                case 1:
                        if(items.length > 1) 
                        {
        
                            for(item of items) {
                                const res =  await axios.get(`${BASE_URL}/users/${item.login}`);
                                newCard = card
                                    .replace("@name",(res.data.name)? res.data.name: "")
                                    .replace("@desc",(res.data.bio)? res.data.bio: "")
                                    .replace("@avatar_url",res.data.avatar_url)
                                    .replace("@sub_name",res.data.login)
                                    .replace("@html_url",res.data.html_url)
                                    .replace("@num_repos",res.data.public_repos)
                                    .replace("@num_followers",res.data.followers)
                                    .replace("@num_followings",(res.data.following) ? res.data.following: "")
                                    .replace("@repo_url",(res.data.login) ? res.data.login : "")
                                    .replace("@follower_url",(res.data.login) ? res.data.login : "")
                                    .replace("@following_url",(res.data.login) ? res.data.login : "")
        
                                result.innerHTML += newCard; 
                            };
                        } else 
                        {
                            const res =  await axios.get(`${BASE_URL}/users/${items[0].login}`);
                            newCard = card
                                .replace("@avatar_url",items[0].avatar_url)
                                .replace("@sub_name",items[0].login)
                                .replace("@html_url",items[0].html_url) 
                                .replace("@name",(res.data.name)? res.data.name: "")
                                .replace("@desc",res.data.bio)
                                .replace("@num_repos",res.data.public_repos)
                                .replace("@num_followers",res.data.followers)
                                .replace("@num_followings",res.data.following)
                                .replace("@num_followers",res.data.followers)
                                .replace("@num_followings",res.data.following)
                                .replace("@repo_url",(res.data.login) ? res.data.login : "")
                                .replace("@follower_url",(res.data.login) ? res.data.login : "")
                                .replace("@following_url",(res.data.login) ? res.data.login : "")
                            result.innerHTML = newCard; 
                        }
                    break;
                case 2:
                    if(items.length > 1) 
                    {
                        for(item of items) {
                            newCard = card2
                                .replace("@avatar_url",item.owner.avatar_url)
                                .replace("@title",item.name)
                                .replace("@name",item.owner.login)
                                .replace("@language",(item.language)? item.language : "")
                                .replace("@desc",(item.description)? item.description : "")
                                .replace("@html_url", (!item.private)? item.html_url : "");
                            result.innerHTML += newCard;
                        }    
                    } else 
                    {
                        newCard = card2
                                .replace("@avatar_url",items[0].owner.avatar_url)
                                .replace("@title",items[0].name)
                                .replace("@name",items[0].owner.login)
                                .replace("@language",(items[0].language)? items[0].language : "")
                                .replace("@desc",(items[0].description)? items[0].description : "")
                                .replace("@html_url", (!items[0].private)? items[0].html_url : "");
                            result.innerHTML += newCard;
                    }
                    break;
                case 3:
                    break;
            }
            methods.load(false);
            $('div #collapsible').collapsible();
        }catch(err)
        {
            methods.load(false);
            methods.setMessage({html:"Ouve um erro ao fazer a solicitação",classes: "toast toast-alert"});
            console.log(err);
        }
    },

    getRepositors: async () => {
        try {
            methods.load(true);
            const resultRepos = document.querySelector("#resultrepo");
            const url = window.location.href.split("?")[1];
            const obj = methods.convertObjectChaveValor(url);
            var data = JSON.parse(obj);
            const repos = await axios.get(`${BASE_URL}/users/${data.repos}/repos?page=${data.page}&per_page=${data.per_page}`);
                
            if(repos.data.total_count == 0) return (methods.load(false), result.innerHTML = notResult);

                var {data} = repos;

                if(data.length > 1) 
                    {
                        for(item of data) {
                            newCard2 = card2
                                .replace("@avatar_url",item.owner.avatar_url)
                                .replace("@title",item.name)
                                .replace("@name",item.owner.login)
                                .replace("@language",(item.language)? item.language : "")
                                .replace("@desc",(item.description)? item.description : "")
                                .replace("@html_url", (!item.private)? item.html_url : "");
                            resultRepos.innerHTML += newCard2;
                        }    
                    } else 
                    {
                        newCard2 = card2
                                .replace("@avatar_url",data[0].owner.avatar_url)
                                .replace("@title",data[0].name)
                                .replace("@name",data[0].owner.login)
                                .replace("@language",(data[0].language)? data[0].language : "")
                                .replace("@desc",(data[0].description)? data[0].description : "")
                                .replace("@html_url", (!data[0].private)? data[0].html_url : "");
                            resultRepos.innerHTML += newCard2;
                    }
                    methods.load(false);
        } catch (err) {
            methods.load(false);
            methods.setMessage({html:"Ouve um erro ao fazer a solicitação",classes: "toast toast-alert"});
            console.log(err); 
        }
    },

    getFriends: async () => {
        try
        {
            methods.load(true);
            const resultFriends = document.querySelector("#resultfriends");
            const url = window.location.href.split("?")[1];
            const obj = methods.convertObjectChaveValor(url);
            var data = JSON.parse(obj);
            const res = await axios.get(`${BASE_URL}/users/${data.friends}/${data.follow}?page=${data.page}&per_page=${data.per_page}`);
            
            if(res.data.total_count == 0) return (methods.load(false), result.innerHTML = notResult);
            
            var {data} = res;
            
            if(data.length > 1) 
            {

                for(item of data) {
                    const res =  await axios.get(`${BASE_URL}/users/${item.login}`);
                    newCard3 = card
                        .replace("@name",(res.data.name)? res.data.name: "")
                        .replace("@desc",(res.data.bio)? res.data.bio: "")
                        .replace("@avatar_url",res.data.avatar_url)
                        .replace("@sub_name",res.data.login)
                        .replace("@html_url",res.data.html_url)
                        .replace("@num_repos",res.data.public_repos)
                        .replace("@num_followers",res.data.followers)
                        .replace("@num_followings",(res.data.following) ? res.data.following: "")
                        .replace("@repo_url",(res.data.login) ? res.data.login : "")
                        .replace("@follower_url",(res.data.login) ? res.data.login : "")
                        .replace("@following_url",(res.data.login) ? res.data.login : "")

                    resultFriends.innerHTML += newCard3; 
                };
            } else 
            {
                const res =  await axios.get(`${BASE_URL}/users/${items[0].login}`);
                newCard3 = card
                    .replace("@avatar_url",items[0].avatar_url)
                    .replace("@sub_name",items[0].login)
                    .replace("@html_url",items[0].html_url) 
                    .replace("@name",(res.data.name)? res.data.name: "")
                    .replace("@desc",res.data.bio)
                    .replace("@num_repos",res.data.public_repos)
                    .replace("@num_followers",res.data.followers)
                    .replace("@num_followings",res.data.following)
                    .replace("@num_followers",res.data.followers)
                    .replace("@num_followings",res.data.following)
                    .replace("@repo_url",(res.data.login) ? res.data.login : "")
                    .replace("@follower_url",(res.data.login) ? res.data.login : "")
                    .replace("@following_url",(res.data.login) ? res.data.login : "")
                resultFriends.innerHTML = newCard3; 
            }
            methods.load(false);
            $('div #collapsible').collapsible();
        }catch(err) 
        {
            methods.load(false);
            methods.setMessage({html:"Ouve um erro ao fazer a solicitação",classes: "toast toast-alert"});
            console.log(err); 
        }
        
    }
    
 }


btnSearch.onclick = () => {github_search.search();};

iptitem.onkeyup = (evt) => { if(evt.keyCode == 13) github_search.search(); };

window.onoffline = () => { methods.setMessage({html:"Você está offline",classes:"purple darken-1"})};

