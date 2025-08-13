import * as utils from "./utils.js";

utils.addEventListener("#logInView #nextButton", "click", async (event) => {
    const value = document.querySelector("#logInView #usernameInput").value;
    if (value == "") return;

    const response = await fetch("/signup/usernameInUse/" + value, {}).then((res) => res.json());
    if (!response[0]) return;

    event.target.classList.add("hide");
    event.target.previousElementSibling.classList.add("hide");
    event.target.nextElementSibling.classList.remove("hide");
})