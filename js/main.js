// API key: c5d49f30-9655-11ec-8a62-699f157b1fec
// Premier League standings url: https://app.sportdataapi.com/api/v1/soccer/standings?apikey=c5d49f30-9655-11ec-8a62-699f157b1fec&season_id=1980
// Premier League --> league_id: 237
// Premier League season 21/22 --> season_id: 1980
// Premier League standings (Array(20)) --> standings: [0-19]

const links = document.querySelectorAll('#main-nav a');
const content = document.getElementById('content');
const tBody = document.querySelector('#table tbody');
const thead = document.querySelector('#table thead');

let theClickedLink = '';
let selection = '';
let teamName = '';
let logo = '';
let position = '';
let matches = '';
let goals = '';
let points = '';
let standingsBool = false;
let topScorersBool = false;
let name = '';
let selectedTeam = '';

linksEventListener ();

async function fetchData(e) {
    e.preventDefault();
    theClickedLink = e.target;
    selection = theClickedLink.id;
    
    // adds css to the selected link
    selectedLink();
 
    if(selection == 'standings') {
        // bool to prevent the table to duplicate when the same link is pressed more than ones
        if(standingsBool == false) {

            // prevents the user to start a new fetch while the current one is still loading
            linksRemoveEventListener();

            clearTable();
            bool ();
            changeThead ();
            await getStandingsTable();
            linksEventListener();
        }
    }

    else {
        if(topScorersBool == false) {
            linksRemoveEventListener(); 
            clearTable();
            bool ();
            changeThead ();
            await getTopScorersTable ();
            linksEventListener();
        }
    }
}



function linksEventListener () {
    for(let link of links) {
        link.addEventListener('click', fetchData);
    }
}

function linksRemoveEventListener () {
    for(let link of links) {
        link.removeEventListener('click', fetchData);
    }
}

function selectedLink () {
    theClickedLink.classList.add('selectedLink');
    if(selection == 'standings') {
        document.getElementById('top-scorers').classList.remove('selectedLink');
    }

    else {
        document.getElementById('standings').classList.remove('selectedLink');
    }
}

async function getStandingsTable() {
    try {
        const standingResponse = await fetch('https://app.sportdataapi.com/api/v1/soccer/standings?apikey=c5d49f30-9655-11ec-8a62-699f157b1fec&season_id=1980');
        const standingData = await standingResponse.json();
        console.log(standingData.data.standings)
        let counter = 0;
        for(let team of standingData.data.standings) {
            selectedTeam = team.team_id;
            position = standingData.data.standings.indexOf(team) + 1;
            matches = team.overall.games_played;
            goals = team.overall.goals_diff;
            points = team.points;
            
            await getTeamInfo();
            

            if(counter == 3 || counter == 4) {
                tBody.innerHTML += `
                    <tr id="qualifications-border">
                        <td><strong>${position}</strong></td>
                        <td id="team-name"><img src="${logo}" id="team-logo">${teamName}</td>
                        <td>${matches}</td>
                        <td>${goals}</td>
                        <td><strong>${points}</strong></td>
                    </tr>
            `;
            }

            else {
                tBody.innerHTML += `
                    <tr>
                        <td><strong>${position}</strong></td>
                        <td id="team-name"><img src="${logo}" id="team-logo">${teamName}</td>
                        <td>${matches}</td>
                        <td>${goals}</td>
                        <td><strong>${points}</strong></td>
                    </tr>
                    `;
            }
            counter++;
        }

    }   
    
    catch(error) {
        console.log(error);
    }
}

async function getTopScorersTable () {
    try {
        const topScorersResponse = await fetch('https://app.sportdataapi.com/api/v1/soccer/topscorers?apikey=c5d49f30-9655-11ec-8a62-699f157b1fec&season_id=1980');
        const topscorersData = await topScorersResponse.json();
        console.log(topscorersData);

        let counter = 0; 
        for(let players of topscorersData.data) {
            position = topscorersData.data.indexOf(players) + 1;
            name = players.player.player_name;
            selectedTeam = players.team.team_id;
            goals = players.goals.overall;
            matches = players.matches_played;

            await getTeamInfo()
            tBody.innerHTML += `
            <tr>
                <td><strong>${position}</strong></td>
                <td id="team-name"><img src="${logo}" id="team-logo">${name}</td>
                <td><strong>${matches}</strong></td>
                <td><strong>${goals}</strong></td>
            </tr>
            `
            counter++;
            if (counter == 20) {
                break;
            }
        }
    }

    catch(error) {
        console.log(error);
    }
}

async function getTeamInfo () {
    try {
        const teamresponse = await fetch('https://app.sportdataapi.com/api/v1/soccer/teams/' + selectedTeam + '?apikey=c5d49f30-9655-11ec-8a62-699f157b1fec');
        const teamData = await teamresponse.json();
        teamName = teamData.data.name;
        logo = teamData.data.logo;
    } 

    catch(error) {
        console.log(error);
    }
}

function clearTable () {
    tBody.innerHTML = '';
    thead.innerHTML = '';
}

function bool () {
    if(selection == 'top-scorers') {
        topScorersBool = true;
        standingsBool = false;
    }

    else if(selection == 'standings') {
        standingsBool = true;
        topScorersBool = false;
    }
}

function changeThead () {
    if(selection == 'top-scorers') {
        thead.innerHTML = `
            <tr>
                <th>Plats</th>
                <th>Namn</th>
                <th>Matcher</th>
                <th>Mål</th>
            </tr>
        `;
    }

    else if(selection == 'standings') {
        thead.innerHTML = `
            <tr>
                <th>Plats</th>
                <th>Lag</th>
                <th>Matcher</th>
                <th>Mål +/-</th>
                <th>Poäng</th>
            </tr>
        `;
    }
}