require('./server').start({
	"name"        : "New DiscoMUD Install",
	"world_path"  : "example_world",
	"start_room"  : "lobby"
}).listen(8000);
