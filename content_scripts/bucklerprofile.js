let port = chrome.runtime.connect({name: "bbcbuddy"});

// ONLY Profile Home Page
if (location.href.match(/profile\/[0-9].+$/)) {
  //console.log("Main profile page");

  const apicacheid = document.querySelectorAll('script[src$="buildManifest.js"]')[0]
      .src.match(/static\/([^\/].*)\//)[1];
  //console.log("CACHE KEY", apicacheid);
  // TODO: silly of me to think there was global state in this object across all scripts..
  SFApiUrls.setCacheKey(apicacheid);

  //console.log("base?", SFApiUrls.getProfileBaseUrl());
  const sid = location.href.replace(SFApiUrls.getProfileBaseUrl(), '');
  //console.log("sid", sid);

  SFApiUrls.setSid(sid);
  //console.log(SFApiUrls.getUserBattleInfoUrl());
  //console.log(SFApiUrls);

// Create the save button (TODO)
// TODO: Flag for "always update?"
  let save_button = document.createElement("p");
  save_button.className = "save_button";
  save_button.style.backgroundColor = "rgb(255,255,255)";
  save_button.style.cursor = "pointer";
  save_button.addEventListener("click", (event) =>{
    // TODO: auto save every file on option (remember state of it)
    port.postMessage({
      name: "UpdateUserCard",
      sid: sid,
      cache_key: apicacheid
    });
  });

  let save_button_label = document.createElement("p");
  save_button_label.innerText = "Store / Update This Player";
  save_button_label.style.color = "rgb(0,0,0)";
  save_button_label.style.fontSize = "20pt";
  save_button.append(save_button_label);

// TODO: this button location is tentative
  const status_node = document.querySelectorAll('article[class^="character_character_status"]')[0];

  status_node.append(save_button);


}