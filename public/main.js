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

    if (document.getElementById("usernameAvailable").style.display != "none") return

    var panelInfo = Array.from({ length: 6 }, () => { return { positions: [] } });
    document.querySelectorAll("#signUpView #story p").forEach((element) => {
        panelInfo[element.parentNode.id].positions.push([element.style.top.split("%")[0], element.style.left.split("%")[0]])
    });
    document.querySelectorAll("#signUpView .panel").forEach((element) => {
        panelInfo[element.id].color = element.style.backgroundColor
    })

    var story = Array.from({ length: 6 }, () => []);
    document.querySelectorAll("#signUpView .panel").forEach((panel) => {
        story[panel.id].push(panel.style.backgroundColor);
        panel.querySelectorAll("p").forEach((element) => {
            story[panel.id].push(element.style.top.split("%")[0] + " " + element.style.left.split("%")[0] + element.innerText)
        })
        story[panel.id].sort()
    })

    const status = await fetch("/signup", { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username, story: story.toString(), panelInfo: panelInfo }) }).then(res => res.status);

    console.log(status)
});