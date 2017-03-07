# Catalysts Lunch Bot

:cow: :sushi: :hamburger: :spaghetti: :stew:

Bringing back the glorious lunchbot!

:rice: :green_apple: :beers: :fork_and_knife: :poultry_leg:

## How to

Just add [the bot](https://join.skype.com/bot/1e7994e1-ae54-4ed0-be74-05e16bc835d6) as contact in Skype (it is not published yet, so use the link here). In group chats use @cat-lunch-bot to talk to it.

For getting started, try

```
@cat-lunch-bot all
```

## Contributing

Feel free to submit pull requests with more lunch commands! 

### Add a new menu

Add a file xyz.js to 'menus'. Use this template:

```
module.exports = {
	intent: "your intent",				//the intent to match
	location: "your location",			//the location: "linz", "vienna" or "cluj"
	menu: function(callback) {...}		//a function that parses the menu from somewhere
}
```

All js files in 'menus' will be loaded automatically (except if the file starts with an underscore '_').

## Testing

First, run the bot 

```
node app.js
```

then, use the [Microsoft Bot Framework Emulator](https://docs.botframework.com/en-us/tools/bot-framework-emulator/) and connect to it.

## Changelog

**08.03.2017**	

- Added locations (linz, vienna, cluj)
- Fixed hartl (pdf file name changes from week to week, now parsing it from their website)
- Remove kräuterspiele (closed)
