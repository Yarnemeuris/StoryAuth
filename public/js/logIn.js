import * as utils from "./utils.js";

utils.addEventListener("#logInView #nextButton", "click", async (event) => {
    const value = document.querySelector("#logInView #usernameInput").value;
    if (value == "") return;

    const response = await fetch("/signup/usernameInUse/" + value).then((res) => res.json());
    if (!response[0]) {
        document.querySelector("#signUpView #usernameInput").value = value;
        document.querySelector("#signUpView #usernameInput").classList.remove("emptyText");
        utils.switchToView("signUp");
    }

    event.target.classList.add("hide");
    event.target.previousElementSibling.classList.add("hide");
    event.target.nextElementSibling.classList.remove("hide");

    var story = await fetch("/logIn/story/" + value).then((res) => res.json());
    console.log(story)
    story = story[0]
    document.querySelectorAll("#logInView .panel").forEach((panel) => {
        panel.style.backgroundColor = story[panel.id].color

        story[panel.id].positions.forEach((pos) => {
            const p = document.createElement("p");
            p.style.top = pos[1] + "%"
            p.style.left = pos[0] + "%"
            p.style.position = "absolute"
            p.style.fontSize = "inherit";
            p.style.margin = "0px";
            p.innerText = "x"
            panel.appendChild(p);
        })
    })
})