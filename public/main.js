import * as utils from "./js/utils.js";
import "./js/edit.js";
import "./js/logIn.js";

utils.switchToView("logIn")

utils.addEventListener("#signUpView #usernameInput", "input", async (event) => {
    const value = event.target.value
    if (value == "") return

    const response = await fetch("/signup/usernameInUse/" + value, {}).then((res) => res.json());

    if (event.target.value != value) return
    const available = !response[0]
    document.getElementById("usernameAvailable").style.display = available ? "none" : "initial";
});

utils.addEventListener("#createAccountButton", "click", async () => {
    const username = document.getElementById("usernameInput").value
    const story = document.querySelector("#signUpView #story").innerHTML.replaceAll(" ", "").replaceAll("\n", "")

    if (document.getElementById("usernameAvailable").style.display != "none") return

    await fetch("/signup", { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username, story: story }) }).then(res => { console.log("Request complete! response:", res); });
});