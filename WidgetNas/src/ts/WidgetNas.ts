﻿function wnabout() {
    return `
/*--------------------------------------
 * Widgetnas Version: 1.4.3.0
 * Release Date: 1401-05-16 - 2022-08-07
 *--------------------------------------*/
`}

document.addEventListener("DOMContentLoaded", initComponents, true);

function initComponents() {
    WNDefaultLanguage = document.documentElement.lang;
    if (document.documentElement.lang.indexOf('fa') > -1 || window.navigator.languages.indexOf('fa') > -1) {
        WNDefaultCalendar = new wnPersianCalendar();
        WNDefaultCultureInfo = new wnCultureInfo_fa_IR();
        WNDefaultLanguage = 'fa';
    }
    else {
        WNDefaultCalendar = new wnGregorianCalendar();
        WNDefaultCultureInfo = new wnCultureInfo_en_US();
    }

    WNTagEvalScript(document.head);
    WNTagEvalScriptBody();

    CheckBrowserCompatibility();

    InitWNBlock(document);
}

function CheckBrowserCompatibility() {
    let objAgent = navigator.userAgent;
    let objbrowserName = '';
    let objfullVersion = '';
    let objBrMajorVersion = 0;
    let objOffsetName, objOffsetVersion, ix;
    if ((objOffsetVersion = objAgent.indexOf("Chrome")) != -1) {
        objbrowserName = "Chrome";
        objfullVersion = objAgent.substring(objOffsetVersion + 7);
    }
    else if ((objOffsetVersion = objAgent.indexOf("MSIE")) != -1) {
        objbrowserName = "Microsoft Internet Explorer";
        objfullVersion = objAgent.substring(objOffsetVersion + 5);
    }
    else if ((objOffsetVersion = objAgent.indexOf("Firefox")) != -1) {
        objbrowserName = "Firefox";
        objfullVersion = objAgent.substring(objOffsetVersion + 8);
    }
    else if ((objOffsetVersion = objAgent.indexOf("Safari")) != -1) {
        objbrowserName = "Safari";
        objfullVersion = objAgent.substring(objOffsetVersion + 7);
        if ((objOffsetVersion = objAgent.indexOf("Version")) != -1)
            objfullVersion = objAgent.substring(objOffsetVersion + 8);
    }
    else if ((objOffsetName = objAgent.lastIndexOf(' ') + 1) < (objOffsetVersion = objAgent.lastIndexOf('/'))) {
        objbrowserName = objAgent.substring(objOffsetName, objOffsetVersion);
        objfullVersion = objAgent.substring(objOffsetVersion + 1);
        if (objbrowserName.toLowerCase() == objbrowserName.toUpperCase()) {
            objbrowserName = 'Netscape';
        }
    }
    if ((ix = objfullVersion.indexOf(";")) != -1)
        objfullVersion = objfullVersion.substring(0, ix);
    if ((ix = objfullVersion.indexOf(" ")) != -1)
        objfullVersion = objfullVersion.substring(0, ix);
    objBrMajorVersion = parseInt('' + objfullVersion, 10);
    if (isNaN(objBrMajorVersion)) {
        objfullVersion = '1.0';
        objBrMajorVersion = 0;
    }
    let error = true;
    if (objbrowserName == 'Chrome' && objBrMajorVersion >= 89)
        error = false;
    else if (objbrowserName == 'Firefox' && objBrMajorVersion >= 5)
        error = false;
    if (error)
        document.body.innerHTML = `<div class='alert warning'>` + WNlang[WNDefaultCultureInfo.TwoLetterISOLanguageName]["common"]["browsererror"] + ' ' + objbrowserName + ':' + objBrMajorVersion + `</div>` + document.body.innerHTML;
}
function InitWNBlock(elem: HTMLElement | Document = document) {
    InitWN(elem);
    SetComponentCompatibility(elem);
    WNTooltipAssign(elem);
    WNAnimationSetup();
}
function InitWN(masterelem: HTMLElement | Document = document) {
    let selectors: NodeListOf<HTMLDivElement> = masterelem.querySelectorAll("[wn-type]");
    for (var i = 0; i < selectors.length; i++) {
        let elem = selectors[i];
        if (elem !== null) {
            let type = elem.getAttribute("wn-type");
            if (!elem.hasAttribute('id') || elem.getAttribute('is') == '') {
                elem.id = 'wn-' + type + (Object.keys(WN).length + 1).toString();
                elem.setAttribute('id', elem.id);
            }
            try {
                WN[elem.id] = null;
                WN[elem.id] = new Function('elem', 'return new wn' + type + '(elem)')(elem);
            }
            catch { }
        }
    }
}
function SetComponentCompatibility(elem: HTMLElement | Document = document) {
    //Select
    let selectors: NodeListOf<HTMLSelectElement> = elem.querySelectorAll("*");
    for (var i = 0; i < selectors.length; i++) {
        let elem = selectors[i];
        if (elem !== null) {
            let st = getComputedStyle(elem);
            if (st.direction == 'ltr') {
                if (elem.tagName == "INPUT" && (elem.type == 'email')) {
                    if (getComputedStyle(<HTMLElement>elem.parentElement).direction == 'ltr')
                        elem.setAttribute('dir', 'ltr');
                    else
                        elem.setAttribute('dir', 'rtl');
                }
                else
                    elem.setAttribute('dir', 'ltr');
            }
        }
    }
}
function WNTagEvalScriptBody() {
    if (!DisableTagEvalScript)
        WNTagEvalScript(document.body);
}
function WNTagEvalScript(elem: HTMLElement) {
    const regexp = /\$\[([\s\S]*?)\]/img;
    let html = elem.innerHTML;
    let v = html.matchAll(regexp);
    for (const m of v) {
        try {
            html = html.replace(m[0], eval(m[1]));
        } catch (e) {

        }
    }
    elem.innerHTML = html;
}

