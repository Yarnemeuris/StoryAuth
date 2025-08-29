const viewSwitchEvent = new Event("viewSwitch")

export function switchToView(viewName) {
    const allViews = document.getElementsByClassName("view")
    for (const view of allViews) {
        if (view.dataset.viewname == viewName) {
            view.classList.remove("hide");
            view.dispatchEvent(viewSwitchEvent);
            continue;
        }

        view.classList.add("hide");
    }

    window.history.replaceState(null, "", viewName)
}

export function addEventListener(query, event, exec, options) {
    document.querySelector(query).addEventListener(event, exec, options);
}

export function showTransparentView(viewName) {
    const allViews = document.getElementsByClassName("transpartentView")
    for (const view of allViews) {
        if (view.dataset.viewname != viewName) continue;

        view.classList.remove("hide");
        break;
    }
}

export function hideTransparentView(viewName) {
    const allViews = document.getElementsByClassName("transpartentView")
    for (const view of allViews) {
        if (view.dataset.viewname != viewName) continue;

        view.classList.add("hide");
        break;
    }
}

function focusOnInput(event) {
    const element = event.target;

    if (element.classList.contains("emptyText") && element.value === element.dataset.defaultvalue) {
        element.value = "";
        element.classList.remove("emptyText");
    }
}

function blurInput(event) {
    const element = event.target;

    if (element.value != "") return;

    element.classList.add("emptyText");
    element.value = element.dataset.defaultvalue
}

export function onInputSubmit(defaultvalue, callback) {
    for (var element of document.getElementsByTagName("input")) {
        if (element.type !== "text") continue;
        if (element.dataset.defaultvalue != defaultvalue) continue;

        element.addEventListener("submit", callback);
        return;
    }
}

async function importHTML(element) {
    const html = await fetch(element.innerText, {}).then((res) => res.text());
    const div = document.createElement("div");
    div.innerHTML = html;
    await importAllHTML(div);

    div.style.cssText = element.style.cssText;
    div.id = element.id;
    element.replaceWith(div);
}

async function importAllHTML(element) {
    for (var importElement of element.querySelectorAll("import")) {
        await importHTML(importElement);
    }
}


for (var element of document.getElementsByTagName("input")) {
    if (element.type !== "text") continue;
    if (element.dataset.defaultvalue == undefined) continue;

    element.value = element.dataset.defaultvalue;
    element.classList.add("emptyText");

    element.addEventListener("blur", blurInput);
    element.addEventListener("focus", focusOnInput);
}

await importAllHTML(document.body);