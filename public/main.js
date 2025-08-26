import * as utils from "./js/utils.js";
import "./js/singUp.js";
import "./js/logIn.js";

utils.switchToView("home")

async function getIfLoggedIn() {
    return await fetch("/loggedIn").then((res) => res.json());
}

var loggedIn = await getIfLoggedIn();

{
    const element = document.querySelector("#homeView button#signUp")
    element.style.display = loggedIn ? "none" : "inital"
    element.addEventListener("click", () => {
        utils.switchToView("signUp")
    })
}

{
    const element = document.querySelector("#homeView header button")
    element.innerText = loggedIn ? "account" : "log in"
    element.addEventListener("click", () => {
        if (loggedIn) {
            utils.switchToView("account")
        } else {
            utils.switchToView("logIn")
        }
    })
}