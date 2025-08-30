import * as utils from "./utils.js";

utils.addEventListener("#signUpView", "viewSwitch", () => {
    document.querySelector("#editPanelView #create").classList.remove("hide");
    document.querySelector("#editPanelView #change").classList.add("hide");
})

function editPanel(event) {
    utils.showTransparentView("editPanel");

    document.getElementById("editPanel").style.backgroundColor = event.target.style.backgroundColor;
    document.getElementById("editPanel").innerHTML = event.target.innerHTML;

    for (const element of document.getElementById("editPanel").children) {
        element.addEventListener("mousedown", startMove);
    }

    utils.addEventListener("#close", "click", () => {
        event.target.style.backgroundColor = document.getElementById("editPanel").style.backgroundColor;
        event.target.innerHTML = document.getElementById("editPanel").innerHTML;

        utils.hideTransparentView("editPanel")
    }, { once: true })
}


function startMove(event) {
    if (event.button == 2) {
        event.target.remove()
    }
    if (event.button != 0) return

    const node = event.target;
    const parent = event.target.parentNode;

    function move(event) {
        node.style.left = Math.min(80, Math.max(-2.5, (event.clientX - parent.getBoundingClientRect().left - node.clientWidth / 2) / parent.clientWidth * 100)) + "%"
        node.style.top = Math.min(80, Math.max(-2.5, (event.clientY - parent.getBoundingClientRect().top - node.clientHeight / 2) / parent.clientHeight * 100)) + "%"
    }
    document.addEventListener("mousemove", move)

    document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", move);
    }, { once: true })
}

utils.addEventListener("#add", "click", () => {
    const p = document.createElement("p");
    p.innerText = document.getElementById("addInput").value;
    p.style.fontSize = "inherit";
    p.style.position = "absolute";
    p.style.margin = "0px";
    p.addEventListener('contextmenu', event => event.preventDefault());
    p.addEventListener("mousedown", startMove);

    document.getElementById("addInput").value = "";
    document.getElementById("editPanel").appendChild(p);
})

utils.addEventListener("#changeColor", "input", (event) => {
    document.getElementById("editPanel").style.backgroundColor = event.target.value;
})

utils.addEventListener("#signUpView #usernameInput", "input", checkUsername);

utils.addEventListener("#createAccountButton", "click", async () => {
    const username = document.querySelector("#signUpView #usernameInput").value

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

    const status = await fetch("./signup", { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username, story: story.toString(), panelInfo: panelInfo }) }).then(res => res.status);

    if (status != 201) {
        checkUsername()
        return
    }

    utils.switchToView("account")
});

async function checkUsername() {
    const element = document.querySelector("#signUpView #usernameInput")
    const value = element.value
    if (value == "") return

    const response = await fetch("./signup/usernameInUse/" + value, {}).then((res) => res.json());

    if (element.value != value) return
    const available = !response[0]
    document.getElementById("usernameAvailable").style.display = available ? "none" : "initial";
}

for (const panel of document.querySelectorAll("#signUpView .panel")) {
    panel.addEventListener("click", editPanel)
}