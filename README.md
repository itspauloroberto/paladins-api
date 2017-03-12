Welcome to paladins-api Wrapper!
------------

This is a Javascript wrapper for the Paladins API to simplify making requests and handling the responses.

>**Note:** This wrapper is still in early stages of development. Some API methods are not yet implemented.


Installation
-------------
**1.** Install the package using npm install.

```nmp install paladins-api --save```


Setting Up
-------------
**1.** Import the package to your entry file. **Ex. app.js**

```const paladins = req('paladins-api'); ```

**2.** Create a new instance of the api class.

```const pal = new paladins('your-dev-id', 'your-auth-key'); ```

> **Note:**
>Development credentials can be obtained by completing [this](https://fs12.formsite.com/HiRez/form48/secure_index.html) application.


Creating a Session
--------------
> **Note:**
> Hi-Rez has limits set in place to throttle requests and sessions. Sessions expire after 15 min so re-creating a session when needed is something that needs to be implemented by yourself.

**1.** Create a new session using the ```connect()``` method.

```
var sessionId;
pal.connect((err, res) => {
	if(!err) {
		sessionId = res;
	};
});
```
First we create a variable called ```sessionId``` so that we can store the session returned from the ```connect()``` method.

In the ```connect()``` method we have a call back function which returns the session in the ```res``` variable. We check for error's and then store the session into the ```sessionId``` variable.

Usage (Get a player's stats)
--------------

This example is just to demonstrate how the process works. We're going to retrieve a players statistics using the ```getPlayer()``` method.

Every method we use requires a valid session variable to be passed into the function. This is required for signature generation and validation on Hi-Rez's end.

**1.** Create a session using the ```connect()``` method.

**2.** Call the method using the ```sessionsId``` and the Player's username.
```
pal.getPlayer(sessionId, 'HiRez', (err, res) => {
	console.log(res);
});
```

**3.** The response that gets returned is an object that we can now use in our application. In this case, we just console log to make sure it's working.

>**Note:**
>Player name <i>'**HiRez**'</i> returns an empty object because the player does not exist...

Methods
------------

```connect()``` - Returns a session variable that's required for all API calls.

```getPlayer(session, player)``` - Returns an object with basic player statistics.

```getMatchHistory(session, player)``` - Returns a list of  the players most recent matches (50).

```getMatchDetails(session, match_id)``` - Returns details of a specific match.

```getChampions(session)``` - Returns a list of all the champions and details about them.

```getItems(session)``` - Returns all the items in the game, including cards, items etc...

```getDataUsed(session)``` - Returns an object containing resources used.

>**Note:** More methods will be added in the future.