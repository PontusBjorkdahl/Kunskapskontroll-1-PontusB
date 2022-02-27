// API key: c5d49f30-9655-11ec-8a62-699f157b1fec
// Premier League standings url: https://app.sportdataapi.com/api/v1/soccer/standings?apikey=c5d49f30-9655-11ec-8a62-699f157b1fec&season_id=1980
// Premier League --> league_id: 237
// Premier League season 21/22 --> season_id: 1980
// Premier League standings (Array(20)) --> standings: [0-19]

// Teams id:
// Manchester City      team_id: 12400
// Liverpool            team_id: 2509
// Chelsea              team_id: 2524
// Manchester United    team_id: 2523
// Arsenal              team_id: 2522
// West Ham             team_id: 12401
// Wolverhampton        team_id: 850
// Tottenham            team_id: 12295
// Brighton             team_id: 2518
// Southampton          team_id: 12423
// Crystal Palace       team_id: 2515
// Leicester            team_id: 12424
// Aston Villa          team_id: 2520
// Brentford            team_id: 2537
// Leeds                team_id: 2546
// Everton              team_id: 2516
// Newcastle            team_id: 849
// Burnley              team_id: 2513
// Watford              team_id: 2517
// Norwich              team_id: 2510
const links = document.querySelectorAll('#main-nav a');
const content = document.getElementById('content');
const tableBody = document.querySelector('#table tbody');
console.log(links);
let teamName = '';
let position = '';
let matches = '';
let goals = '';
let points = '';

for(let link of links) {
    link.addEventListener('click', fetchData);
}

let selectedTeam = '';

async function fetchData() {

    try {
        const response = await fetch('https://app.sportdataapi.com/api/v1/soccer/standings?apikey=c5d49f30-9655-11ec-8a62-699f157b1fec&season_id=1980');
        const standingData = await response.json();

        console.log(standingData.data.standings)

        for(let team of standingData.data.standings) {
            selectedTeam = team.team_id;
            console.log(selectedTeam);
            position = standingData.data.standings.indexOf(team) + 1;
            matches = team.overall.games_played;
            goals = team.overall.goals_diff;
            points = team.points;
            
            await getTeamName();
            console.log(team)
            console.log(teamName)
            tableBody.innerHTML += `
                <tr>
                    <td>${position}</td>
                    <td>${teamName}</td>
                    <td>${matches}</td>
                    <td>${goals}</td>
                    <td><strong>${points}</strong></td>
                </tr>
            `
        }

    }   catch(error) {
            console.log(error);
        }
}

// function that collect the teamname from team_id
async function getTeamName () {
    try {
        const teamresponse = await fetch('https://app.sportdataapi.com/api/v1/soccer/teams/' + selectedTeam + '?apikey=c5d49f30-9655-11ec-8a62-699f157b1fec');
        const teamData = await teamresponse.json();
        teamName = teamData.data.name;
        console.log(teamName);

    } catch(error) {
    console.log(error);
    }

    return teamName;
}

