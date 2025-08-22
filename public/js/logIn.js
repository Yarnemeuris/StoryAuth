import * as utils from "./utils.js";

utils.addEventListener("#logInView", "viewSwitch", () => {
    document.querySelector("#editPanelView #change").classList.remove("hide");
    document.querySelector("#editPanelView #create").classList.add("hide");
})

utils.addEventListener("#logInView #nextButton", "click", async (event) => {
    const value = document.querySelector("#logInView #usernameInput").value;
    if (value == "") return;

    const response = await fetch("/signup/usernameInUse/" + value).then((res) => res.json());
    if (!response[0]) {
        document.querySelector("#signUpView #usernameInput").value = value;
        document.querySelector("#signUpView #usernameInput").classList.remove("emptyText");
        utils.switchToView("signUp");
        return
    }

    event.target.classList.add("hide");
    event.target.previousElementSibling.classList.add("hide");
    event.target.nextElementSibling.classList.remove("hide");

    var story = await fetch("/logIn/" + value).then((res) => res.json());
    story = story[0]

    document.querySelectorAll("#logInView .panel").forEach((panel) => {
        panel.style.backgroundColor = story[panel.id].color
        panel.addEventListener("click", editPanel);

        story[panel.id].positions.forEach((pos) => {
            const p = document.createElement("p");
            p.style.top = pos[0] + "%"
            p.style.left = pos[1] + "%"
            p.style.position = "absolute"
            p.style.fontSize = "inherit";
            p.style.margin = "0px";
            p.innerText = "x"
            //panel.appendChild(p);
        })
    })

    utils.addEventListener("#logInView #logInButton", "click", logIn)
})

async function logIn() {
    const username = document.querySelector("#logInView #usernameInput").value;

    var story = Array.from({ length: 6 }, () => []);
    document.querySelectorAll("#signUpView .panel").forEach((panel) => {
        story[panel.id].push(panel.style.backgroundColor);
        panel.querySelectorAll("p").forEach((element) => {
            story[panel.id].push(element.style.top.split("%")[0] + " " + element.style.left.split("%")[0] + element.innerText);
        })
        story[panel.id].sort();
    })

    const status = await fetch("/logIn/" + username, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ story: story.toString() }) }).then(res => res.status);

    if (status != 200) return;

    utils.switchToView("account");
}

function editPanel(event) {
    utils.showTransparentView("editPanel");

    document.getElementById("editPanel").style.backgroundColor = event.currentTarget.style.backgroundColor;
    document.getElementById("editPanel").innerHTML = event.currentTarget.innerHTML;

    document.querySelectorAll("#editPanel > *").forEach((emoji) => {
        emoji.addEventListener("click", () => {
            document.querySelector("#editPanelView #changeInput").value = emoji.innerText

            if (document.querySelector("#editPanel .outline") != null) document.querySelector("#editPanel .outline").classList.remove("outline")
            emoji.classList.add("outline")

            document.querySelector("#editPanelView #changeInput").oninput = (input) => {
                if (input.currentTarget.value === "") return

                emoji.innerText = input.currentTarget.value
            }
        })
    })

    utils.addEventListener("#close", "click", () => {
        if (document.querySelector("#editPanel .outline") != null) document.querySelector("#editPanel .outline").classList.remove("outline")
        document.querySelector("#editPanelView #changeInput").value = ""

        event.target.style.backgroundColor = document.getElementById("editPanel").style.backgroundColor;
        event.target.innerHTML = document.getElementById("editPanel").innerHTML;

        utils.hideTransparentView("editPanel")
    }, { once: true })
}
