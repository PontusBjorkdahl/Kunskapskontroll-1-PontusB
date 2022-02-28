// API key: c5d49f30-9655-11ec-8a62-699f157b1fec
// Premier League standings url: https://app.sportdataapi.com/api/v1/soccer/standings?apikey=c5d49f30-9655-11ec-8a62-699f157b1fec&season_id=1980
// Premier League --> league_id: 237
// Premier League season 21/22 --> season_id: 1980
// Premier League standings (Array(20)) --> standings: [0-19]

const links = document.querySelectorAll('#main-nav a');
const content = document.getElementById('content');
const tBody = document.querySelector('#table tbody');
const thead = document.querySelector('#table thead');
console.log(links);
let teamName = '';
let logo = '';
let position = '';
let matches = '';
let goals = '';
let points = '';
let standingsBool = false;
let topScorersBool = false;
let name = '';

console.log(thead)
for(let link of links) {
    link.addEventListener('click', fetchData);
}

let selectedTeam = '';

async function fetchData(e) {
    e.preventDefault();

    const theClickedLink = e.target;
    console.log(theClickedLink);
    const selection = theClickedLink.id;
    
    // "standingsBool" to prevent the table to duplicate when "Tabell" is pressed more than one time
    if(standingsBool == false) {

        
        if(selection == 'standings') {

            clearTable();
            standingsBool = true;
            topScorersBool = false;
            thead.innerHTML = `
                <tr>
                    <th>Plats</th>
                    <th>Lag</th>
                    <th>Matcher</th>
                    <th>Mål +/-</th>
                    <th>Poäng</th>
                </tr>
            `;

            try {
                const standingResponse = await fetch('https://app.sportdataapi.com/api/v1/soccer/standings?apikey=c5d49f30-9655-11ec-8a62-699f157b1fec&season_id=1980');
                const standingData = await standingResponse.json();

                console.log(standingData.data.standings)

                

                for(let team of standingData.data.standings) {
                    selectedTeam = team.team_id;
                    console.log(selectedTeam);
                    position = standingData.data.standings.indexOf(team) + 1;
                    matches = team.overall.games_played;
                    goals = team.overall.goals_diff;
                    points = team.points;
                    
                    await getTeamInfo();
                    console.log(team)
                    console.log(teamName)
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

            }   catch(error) {
                    console.log(error);
                }
        }
    }
    // "topScorersBool" to prevent the table to duplicate when "Skytteliga" is pressed more than one time
    if(topScorersBool == false) {
        if(selection == 'top-scorers') {
            clearTable();
            topScorersBool = true;
            standingsBool = false;

            try {
                const topScorersResponse = await fetch('https://app.sportdataapi.com/api/v1/soccer/topscorers?apikey=c5d49f30-9655-11ec-8a62-699f157b1fec&season_id=1980');
                const topscorersData = await topScorersResponse.json();
                console.log(topscorersData);

                let counter = 0; 
                for(let players of topscorersData.data) {
                    console.log(players.player.player_name)

                    position = topscorersData.data.indexOf(players) + 1;
                    name = players.player.player_name;
                    tBody.innerHTML += `
                    <tr>
                        <td><strong>${position}</strong></td>
                        <td id="team-name"><img src="" id="team-logo">${name}</td>

                    </tr>
                    `
                    counter++;
                    if(counter == 30) {
                        break;
                    }
                }
        
            } catch(error) {
                console.log(error);
            }
        }
    }
}

// function that collect the teamname from team_id
async function getTeamInfo () {
    try {
        const teamresponse = await fetch('https://app.sportdataapi.com/api/v1/soccer/teams/' + selectedTeam + '?apikey=c5d49f30-9655-11ec-8a62-699f157b1fec');
        const teamData = await teamresponse.json();
        teamName = teamData.data.name;
        logo = teamData.data.logo;
        console.log(teamName);

    } catch(error) {
    console.log(error);
    }

    return teamName;
}

function clearTable () {
    tBody.innerHTML = '';
    thead.innerHTML = '';
}
