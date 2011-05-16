ENGINE_PATH =  __dirname+'/';
require.paths.push(ENGINE_PATH);
require.paths.push('./');
sys = require('sys');
fs  = require('fs');
require('mootools');
require('classes/String');
require('classes/Math');
require('classes/English');
require('classes/Styles');
require('classes/Prompts');
require('classes/Messages');
require('classes/Base');
require('classes/CommandParser');
require('classes/AdvancedParser');
require('classes/Visible');
require('classes/Command');
require('classes/Container');
require('classes/Combat');
require('classes/CombatStandard');
require('classes/Item');
require('classes/Living');
require('classes/Player');
require('classes/Room');
require('classes/Zone');
require('classes/World');
require('classes/Conversation');
