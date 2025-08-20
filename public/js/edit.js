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
    if (document.getElementById("addInput").value.match(/\p{Extended_Pictographic}/gu) == null) return;

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

for (const panel of document.querySelectorAll("#signUpView .panel")) {
    panel.addEventListener("click", editPanel)
}