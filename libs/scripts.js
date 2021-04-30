var request = new XMLHttpRequest();
var request2 = new XMLHttpRequest();

//sleep(ms) function
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//Reset Search Bar
parent.location.hash = "";


//Search & Check username
async function search() {

    var div = document.getElementById("search"), textbox = document.getElementById("textbox");

    if (textbox.value != null && textbox.value != "") {

        var username = textbox.value;

        div.style.animationName = "searchD";
        await sleep(500);
        div.style.display = "none";

        request.open("GET", "https://api.github.com/users/" + username, true)


        request.onload = function () {
            var data = JSON.parse(this.responseText);

            if (data.length == 0 || data.message) {
                cantfound(username);
            }
            else {

                setdata(data);
            }
        }

        request.send();

    }


}


var username;
var starred;

async function setdata(data) {

    starred = "";

    // Activate loading icon
    document.getElementById("loader").style.animationName = "searchA";
    document.getElementById("loader").style.display = "block";

    // Get data to be pull
    username = data.login;
    starreds();
    activity();
    await sleep(3000);

    var name = data.name;
    var avatar = data.avatar_url;
    var followers = data.followers;
    var following = data.following;
    var bio = data.bio;
    var blog = data.blog;
    var twitter = data.twitter_username;


    //console.log(username, starred, followers, following, bio, blog, twitter, avatar);

    document.getElementById("stars").innerText = starred;
    //Set Avatar Image
    document.getElementById("avatar").style.backgroundImage = "url(" + avatar + ")";

    //Print All Data
    document.getElementById("datauser").innerText = name;
    document.getElementById("datauser").onclick = function () { window.open('https://github.com/' + username); }
    document.getElementById("datausername").innerText = username;
    document.getElementById("followers").innerText = followers;
    document.getElementById("following").innerText = following;
    document.getElementById("bio").innerText = bio;

    if (blog == "") {
        document.getElementById("blog").innerText = "Can't Found.";
    }
    else {
        document.getElementById("blog").innerText = blog;
    }


    //Checking blog is have https:// or https://
    if (blog != null && (blog[0] != "h" && blog[1] != "t" && blog[2] != "t" && blog[4] != "p") || (blog[0] != "h" && blog[1] != "t" && blog[2] != "t" && blog[4] != "p" && blog[5] != "s")) {
        document.getElementById("blog").onclick = function () { window.open("http://" + blog); }
    }
    else if (blog == null) {

    }
    else {
        document.getElementById("blog").onclick = function () { window.open(blog); }
    }


    if (twitter == null) {
        document.getElementById("twitter").innerText = "Can't Found.";
        document.getElementById("twitter").onclick = function () {
            window.open('https://twitter.com/');
        }
    }
    else {
        document.getElementById("twitter").innerText = "@" + twitter;
        document.getElementById("twitter").onclick = function () { window.open('https://twitter.com/' + twitter); }
    }

    //Getting All Repos

    getrepos();

    //Profile screen being visible.
    document.getElementById("data").style.animationName = "searchA";
    document.getElementById("data").style.display = "block";

    //Changing Searchbar
    parent.location.hash = username;

    //Hiding Loading Icon
    document.getElementById("loader").style.animationName = "searchD";
    await sleep(500);
    document.getElementById("loader").style.display = "none";
}

async function starreds() {

    var data;

    //Getting Starred Repos, Checking and sending.
    request2.open("GET", "https://api.github.com/users/" + username + "/starred" + "?page=1&per_page=999", true);

    request2.onload = function () {

        var data = JSON.parse(this.responseText);
        if (data.length > 100 || data.length == 100) {
            starred = "100>"
        }
        else {
            if (starred == undefined || starred == "undefined") {
                document.getElementById("stars").innerHTML = "0";
            }
            else {
                starred = data.length;
                document.getElementById("stars").innerHTML = data.length;
            }
        }

    }

    request2.send();

}

//Get and group activites.
async function activity() {

    var type, time = "";
    var data;

    request.open("GET", "https://api.github.com/users/" + username + "/events?page=1&per_page=999", true);

    request.send();

    request.onload = function () {

        data = JSON.parse(this.responseText);

        var call = '<div class="bioheader text-center">Activities</div>' +
            '<div class="hr col-12 mt-2 mx-auto"></div>';

        $.each(data, function (i, datas) {
            time = "";

            for (var q = 0; q < 10; q++) {

                time += datas.created_at[q];

            }


            if (datas.type == "PushEvent") {

                type = "[ PUSH ] " + username + " pushed " + datas.repo.name + " at " + time;

            }
            else if (datas.type == "WatchEvent") {

                type = "[ WATCH ] " + username + ", added " + datas.repo.name + " to watchs at " + time;

            }
            else if (datas.type == "PullRequestEvent") {

                type = "[ PULL REQ. ] " + username + " sends pull request for " + datas.repo.name + " at " + time;

            }
            else if (datas.type == "ForkEvent") {

                type = "[ FORK ] " + username + " forked " + datas.repo.name + " at " + time;

            }
            else if (datas.type == "CreateEvent") {

                type = "[ CREATE ] " + username + " created " + datas.repo.name + " at " + time;

            }
            else if (datas.type == "PublicEvent") {

                type = "[ PUBLIC ] " + username + " changed visibilty to public of " + datas.repo.name + " at " + time;

            }
            else if (datas.type == "IssueCommentEvent") {

                type = "[ ISSUE COMMENT ] " + datas.repo.name + " at " + time;

            }
            else if (datas.type == "IssueEvent") {

                type = "[ ISSUE ] " + datas.repo.name + " at " + time;

            }

            call +=
                '<div style="font-family=Rubik!important" class="biocontent p-1 col-12 mt-2 text-left">' +
                '<span style="font-family=Rubik!important" class="clickable"> ' + type +
                '</span></div>';

        })

        $("#activity").html(call);
    }
}

//Getting All Public Repos
async function getrepos() {

    var data;
    var number = 0;

    request.open("GET", "https://api.github.com/users/" + username + "/repos", true);

    request.send();

    request.onload = function () {

        data = JSON.parse(this.responseText);

        //Printing Datas
        var call = '<div class="bioheader text-center">Repositories</div>' +
            '<div class="hr col-12 mt-2 mx-auto"></div>';

        $.each(data, function (i, datas) {

            call +=
                '<div class="biocontent p-1 col-12 mt-2 text-left">' +
                '<span class="clickable" id="repo' + number + '" name=' + datas.name + '> [ PUBLIC ] ' + datas.name +
                '</span></div>';
            number++;

        });

        //Apply data to elements
        $("#repos").html(call);

        //Set Repos Onclick Links 
        for (var q = 0; q < data.length; q++) {

            document.getElementById("repo" + q).onclick = function () {
                window.open("https://github.com/" + username + "/" + this.getAttribute("name"));

            }

        }
    }
}

async function cantfound(e) {

    //Function of "User Cant Found"
    var div = document.getElementById("CF");

    await sleep(700);

    div.style.display = "block";

    div.style.animationName = "CFA";

    document.getElementById("CFUSER").innerHTML = "We can't find <strong class='text-center' style='word-wrap: break-word;font-family:Raleway;font-weight:400;'><br>" + e + "</strong><br> username in <strong class='text-center' style='font-family:Raleway;font-weight:400;'>GitHub</strong>."
}

async function back(e) {

    //Function Of "Back" Button, checking where is function coming etc.
    if (e == "data") {

        document.getElementById("data").style.animationName = "searchD";

        await sleep(700);

        document.getElementById("data").style.display = "none";

        searchvisible(true);
    }
    else if (e == "error") {

        var divcf = document.getElementById("CF");

        divcf.style.animationName = "CFD";

        await sleep(700);

        divcf.style.display = "none";

        searchvisible(true);
    }

    //Reset SearchBar
    parent.location.hash = "";
}


async function searchvisible(e) {

    //Set SearchDiv visible or unvisible
    var divmain = document.getElementById("search");

    await sleep(100);

    if (e == true) {

        divmain.style.display = "block";
        divmain.style.animationName = "searchA";

    }
    else {

        divmain.style.animationName = "searchD";
        divmain.style.display = "none";

    }

}