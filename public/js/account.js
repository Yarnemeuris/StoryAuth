import * as utils from "./utils.js";

function newPanel(color, characters) {
    const panel = document.createElement("div");
    panel.classList.add("panel");
    panel.style.backgroundColor = color;
    panel.addEventListener("click", editPanel);

    characters.forEach(character => {
        const element = document.createElement("p");
        element.style.fontSize = "inherit";
        element.style.position = "absolute";
        element.style.margin = "0px";
        element.style.left = character[0];
        element.style.top = character[1];
        element.innerText = character[2];
        panel.appendChild(element)
    });

    return panel;
}

async function sendStory() {
    const storyDiv = document.querySelector("#accountView #story");

    var story = [];
    storyDiv.childNodes.forEach(panel => {
        var panelData = { color: panel.style.backgroundColor, chars: [] };

        panel.childNodes.forEach(character => {
            panelData.chars.push([character.style.left, character.style.top, character.innerText]);
        })

        story.push(panelData);
    })

    fetch("./account/story", { method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(story) }).then(res => res.status)
}

utils.addEventListener("#accountView", "viewSwitch", async () => {
    document.querySelector("#editPanelView #create").classList.remove("hide");
    document.querySelector("#editPanelView #change").classList.add("hide");

    const storyDiv = document.querySelector("#accountView #story");

    const story = await fetch("./account/story").then((res) => res.json());

    story.forEach(panel => {
        storyDiv.appendChild(newPanel(panel.color, panel.chars))
    });
})

utils.addEventListener("#addRow", "click", (event) => {
    const storyDiv = document.querySelector("#accountView #story");

    for (let i = 0; i < 3; i++) {
        storyDiv.appendChild(newPanel("#fff", []))
    }

    sendStory()
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

        sendStory();

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