var request = require("fetch").fetchUrl;
var moment = require("moment");
var md5 = require("md5");
var c = require("./constants");

module.exports = class API {
  constructor(devId, authKey, format, lang) {
    !devId ? console.log("Error: No devId specified.") : (this.devId = devId);
    !authKey
      ? console.log("Error: No authKey specified.")
      : (this.authKey = authKey);
    !format ? (this.format = "Json") : (this.format = c[format]);
    !lang ? (this.lang = "1") : (this.lang = c[lang]);
  }

  getFormat(send) {
    send(this.format);
  }

  getLanguage(send) {
    send(this.lang);
  }

  setLanguage(lang) {
    this.lang = c[lang];
  }

  setFormat(format) {
    this.format = c[format];
  }

  getPlayer(session, player) {
    var method = "getplayer";
    var url = this.urlBuilder(session, method, player);
    return this.makeRequest(url);
  }

  getPlayerStatus(session, player) {
    var method = "getplayerstatus";
    var url = this.urlBuilder(session, method, player);
    return this.makeRequest(url);
  }

  getMatchHistory(session, player) {
    var method = "getmatchhistory";
    var url = this.urlBuilder(session, method, player);
    return this.makeRequest(url);
  }

  getMatchDetails(session, match_id) {
    var method = "getmatchdetails";
    var url = this.urlBuilder(session, method, null, null, match_id);
    return this.makeRequest(url);
  }
  
  getMatchDetailsBatch(session, matches) {
    var method = "getmatchdetailsbatch";
    var url = this.urlBuilder(session, method, null, null, matches);
    return this.makeRequest(url);
  }

  getChampions(session) {
    var method = "getchampions";
    var url = this.urlBuilder(session, method, null, this.lang);
    return this.makeRequest(url);
  }

  getChampionRanks(session, player) {
    var method = "getchampionranks";
    var url = this.urlBuilder(session, method, player);
    return this.makeRequest(url);
  }

  getChampionSkins(session, champ_id) {
    var method = "getchampionskins";
    var url = this.urlBuilder(session, method, null, this.lang, null, champ_id);
    return this.makeRequest(url);
  }

  //Currently returns an empty object. Don't know why.
  getChampionRecommendedItems(session, champ_id) {
    var method = "getchampionrecommendeditems";
    var url = this.urlBuilder(session, method, null, this.lang, null, champ_id);
    return this.makeRequest(url);
  }

  getDemoDetails(session, match_id) {
    var method = "getdemodetails";
    var url = this.urlBuilder(session, method, null, null, match_id);
    return this.makeRequest(url);
  }

  getQueueStats(session, player, queue, match_id) {
    var method = "getqueuestats";
    var url = this.urlBuilder(session, method, player, null, null, null, queue);
    return this.makeRequest(url);
  }

  getItems(session) {
    var method = "getitems";
    var url = this.urlBuilder(session, method, null, this.lang);
    return this.makeRequest(url);
  }

  getDataUsed(session) {
    var method = "getdataused";
    var url = this.urlBuilder(session, method);
    return this.makeRequest(url);
  }

  getPlayerLoadouts(session, player) {
    var method = "getplayerloadouts";
    var url = this.urlBuilder(session, method, player);
    return this.makeRequest(url);
  }

  getLeagueLeaderboard(session, queue, tier, season) {
    var method = "getleagueleaderboard";
    var url = this.urlBuilder(
      session,
      method,
      null,
      null,
      null,
      null,
      queue,
      tier,
      season
    );
    return this.makeRequest(url);
  }

  connect() {
    var url =
      c.PC +
      "/" +
      "createsession" +
      this.format +
      "/" +
      this.devId +
      "/" +
      this.getSignature("createsession") +
      "/" +
      this.timeStamp();
    return this.makeRequest(url).then(data => data.session_id);
  }

  makeRequest(url) {
    return new Promise((resolve, reject) => {
      request(url, function(err, res, body) {
        // The callback will be invoked with these variables, one should be filled one should be left null.
        var localError = null,
          bodyParsed = null;
        if (!err) {
          try {
            bodyParsed = JSON.parse(body);
          } catch (e) {
            localError = { error: "Paladins API down.", exception: e };
          }
        } else {
          localError = { error: "Paladins API down.", data: err };
        }
        if (localError) reject(localError);
        else resolve(bodyParsed);
      });      
    });
  }

  urlBuilder(
    session,
    method,
    player,
    lang,
    match_id,
    champ_id,
    queue,
    tier,
    season
  ) {
    var baseURL =
      c.PC +
      "/" +
      method +
      this.format +
      "/" +
      this.devId +
      "/" +
      this.getSignature(method) +
      "/" +
      session +
      "/" +
      this.timeStamp();

    player ? (baseURL += "/" + player) : null;
    champ_id ? (baseURL += "/" + champ_id) : null;
    lang ? (baseURL += "/" + lang) : null;
    match_id ? (baseURL += "/" + match_id) : null;
    queue ? (baseURL += "/" + queue) : null;
    tier ? (baseURL += "/" + tier) : null;
    season ? (baseURL += "/" + season) : null;
    return baseURL;
  }

  timeStamp() {
    return moment()
      .utc()
      .format("YYYYMMDDHHmmss");
  }

  getSignature(method) {
    return md5(this.devId + method + this.authKey + this.timeStamp());
  }
};
