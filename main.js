// ANALYZING POSITIONAL HIT RATES BY ROUND
// AUTHOR: RYAN PIKE

//REFERENCES: 
//https://fantasydata.com/


//ASSUMPTIONS: 
//This analysis is based on a 12 team, full PPR league setup


//REQUIRES

const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');
const fs = require('fs');
const csv = require('csv-parser');


//***2019***


//CREATE DATABASE

let db2019 = new sqlite3.Database('./combinedData2019.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected successfully.');
});



//CREATE TABLES

db2019.serialize( () => {

  //2019 Projections
  db2019.run(`DROP TABLE IF EXISTS projections_2019`);
  db2019.run(`CREATE TABLE projections_2019 (
    name TEXT PRIMARY KEY,
    team TEXT,
    position TEXT,
    proj_fpts_per_game NUMERIC(2,1),
    proj_total_fpts NUMERIC(3,1)
    )`
  );

  //2019 ADP
  db2019.run(`DROP TABLE IF EXISTS adp_2019`);
  db2019.run(`CREATE TABLE adp_2019 (
    name TEXT PRIMARY KEY,
    team TEXT,
    bye INTEGER,
    age INTEGER,
    position TEXT,
    pos_rank TEXT,
    adp NUMERIC(3,1)
    )`
  );

  //2019 Season Finish
  db2019.run(`DROP TABLE IF EXISTS season_finish_2019`);
  db2019.run(`CREATE TABLE season_finish_2019 (
    name TEXT PRIMARY KEY,
    team TEXT,
    position TEXT,
    games_played INTEGER,
    pass_yards INTEGER,
    pass_tds INTEGER,
    interceptions INTEGER,
    rush_yards INTEGER,
    rush_tds INTEGER,
    rec INTEGER,
    rec_yards INTEGER,
    rec_tds INTEGER,
    actual_fpts_per_game NUMERIC(2,1),
    actual_total_fpts NUMERIC(3,1) 
    )`
  );
});



//READ IN DATA

//2019 Projections
const projectionsVec2019 = [];
fs.createReadStream('Fantasy_Projections_2019.csv')
  .pipe(csv())
  .on('data', (data) => projectionsVec2019.push(data))
  .on('end', () => {
    for (i = 0; i < projectionsVec2019.length; i++) {
      db2019.run(`INSERT INTO projections_2019 (
        name, 
        team, 
        position, 
        proj_fpts_per_game, 
        proj_total_fpts
        ) 
        VALUES (?, ?, ?, ?, ?)`, 
        [projectionsVec2019[i].NAME, projectionsVec2019[i].TEAM, projectionsVec2019[i].POS, projectionsVec2019[i].FPTSPG, projectionsVec2019[i].TOTFPTS],
        (err) => {
        if (err) {
          console.error('Error:', err.message);
          }
        }
      );
    }
  });


//2019 ADP
const adpVec2019 = [];
fs.createReadStream('ADP_2019.csv')
  .pipe(csv())
  .on('data', (data) => adpVec2019.push(data))
  .on('end', () => {
    for (i = 0; i < adpVec2019.length; i++) {
      db2019.run(`INSERT INTO adp_2019 (
        name, 
        team, 
        bye, 
        age, 
        position, 
        pos_rank, 
        adp
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [adpVec2019[i].NAME, adpVec2019[i].TEAM, adpVec2019[i].BYE, adpVec2019[i].AGE, adpVec2019[i].POS, adpVec2019[i].POS_RANK, adpVec2019[i].ADP],
        (err) => {
        if (err) {
          console.error('Error:', err.message);
          }
        }
      );
    }
  });


//2019 Season Finish
const finishVec2019 = [];
fs.createReadStream('Season_Finish_2019.csv')
  .pipe(csv())
  .on('data', (data) => finishVec2019.push(data))
  .on('end', () => {
    for (i = 0; i < finishVec2019.length; i++) {
      db2019.run(`INSERT INTO season_finish_2019 (
        name,
        team,
        position,
        games_played,
        pass_yards,
        pass_tds,
        interceptions,
        rush_yards,
        rush_tds,
        rec,
        rec_yards,
        rec_tds,
        actual_fpts_per_game,
        actual_total_fpts
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [finishVec2019[i].NAME, finishVec2019[i].TEAM, finishVec2019[i].POS, finishVec2019[i].GP, finishVec2019[i].PASS_YDS,
        finishVec2019[i].PASS_TDS, finishVec2019[i].INT, finishVec2019[i].RUSH_YDS, finishVec2019[i].RUSH_TDS, finishVec2019[i].REC,
        finishVec2019[i].REC_YDS, finishVec2019[i].REC_TDS, finishVec2019[i].FPTSPG, finishVec2019[i].TOTFPTS],
        (err) => {
        if (err) {
          console.error('Error:', err.message);
          }
        }
      );
    }
  });