Discord MMO Engine
========================

Discord is highly expressive, text-based MMO engine written in JavaScript on top of Node.JS and MooTools.

This is packaged as a library.  Just add `discord` to your package.json file, then type `npm install`.

Usage
------------------------

Here's an example world using the Discord engine:

	require('discord').start({
		world_name: 'DiscordMUD',
		world_path: __dirname+'/world',
		start_room: 'lobby'
	}).listen(8000);
	
For more information, check out http://github.com/Yuffster/discord-example.
