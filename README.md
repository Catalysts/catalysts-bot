# Catalysts Bot

:cow: :sushi: :hamburger: :spaghetti: :stew:

Bringing back the glorious lunchbot! And more stuff!

:rice: :green_apple: :beers: :fork_and_knife: :poultry_leg:

## Features

### Lunch

Ask the bot whats for lunch today. It understands locations (linz/vienna/cluj), so you can ask **@cat-lunch-bot linz**. 

### Books

Have you ever found an interesting book and wondered whether we have a copy in our library? The bot can help you answer this question, simply ask:
```
@cat-lunch-bot do we have the book 0132350882
```
The bot will look into our goodreads shelves and lets you know whether we have it or not.

## How to

Just add [the bot](https://join.skype.com/bot/1e7994e1-ae54-4ed0-be74-05e16bc835d6) as contact in Skype (it is not published yet, so use the link here). In group chats use @cat-lunch-bot to talk to it.

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
**09.03.2017**

- Deactivate hartl
- Unify service and bot into one repo

**08.03.2017**	

- Added locations (linz, vienna, cluj)
- Fixed hartl (pdf file name changes from week to week, now parsing it from their website)
- Remove kräuterspiele (closed)

**27.02.2017**

- Add a book command (matches "book <isbn>"). Tells you whether we have a book in our library.
