<?php
/**
 * Add / Update 30 top doors from A-Net Online (game.a-net-online.lol)
 * into rlogin_doors table.
 */

$autoload = file_exists('/var/www/html/vendor/autoload.php')
    ? '/var/www/html/vendor/autoload.php'
    : (file_exists(__DIR__ . '/../vendor/autoload.php') ? __DIR__ . '/../vendor/autoload.php' : __DIR__ . '/vendor/autoload.php');
require_once $autoload;

$functions = file_exists('/var/www/html/src/functions.php')
    ? '/var/www/html/src/functions.php'
    : (file_exists(__DIR__ . '/../src/functions.php') ? __DIR__ . '/../src/functions.php' : __DIR__ . '/src/functions.php');
require_once $functions;

use BinktermPHP\Database;

$pdo = Database::getInstance()->getPdo();

function createSvgIcon(string $label, string $sublabel, string $topColor, string $botColor, string $textColor): string {
    $cleanLabel = htmlspecialchars($label, ENT_QUOTES | ENT_XML1);
    $cleanSub = htmlspecialchars($sublabel, ENT_QUOTES | ENT_XML1);
    return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="g_{$cleanLabel}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{$topColor}"/>
      <stop offset="100%" stop-color="{$botColor}"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="16" fill="url(#g_{$cleanLabel})" stroke="{$textColor}" stroke-width="1.5" stroke-opacity="0.3"/>
  <!-- Top badge -->
  <rect x="25" y="10" width="50" height="16" rx="4" fill="#000000" fill-opacity="0.5"/>
  <text x="50" y="22" fill="#00ffea" font-family="monospace" font-weight="bold" font-size="8.5" letter-spacing="1" text-anchor="middle">A-NET</text>
  <!-- Main Title -->
  <text x="50" y="56" fill="{$textColor}" font-family="sans-serif" font-weight="bold" font-size="13" letter-spacing="0.5" text-anchor="middle">{$cleanLabel}</text>
  <!-- Subtitle / Genre -->
  <text x="50" y="76" fill="#e2e8f0" font-family="sans-serif" font-size="7.5" font-weight="600" opacity="0.85" letter-spacing="0.5" text-anchor="middle">{$cleanSub}</text>
</svg>
SVG;
}

$doors = [
    [
        'code' => 'THECLANS',
        'door_id' => 'anet-theclans',
        'name' => 'The Clans (A-Net)',
        'short_name' => 'The Clans',
        'author' => 'Allen Vance',
        'version' => '1.0',
        'year' => 1997,
        'desc' => 'Classic multi-player BBS RPG where players build clans, manage armies, battle monsters, and conquer territory.',
        'genre' => ['A-Net', 'RPG', 'Fantasy', 'Strategy', 'Multiplayer'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('CLANS', 'RPG / STRATEGY', '#3b0764', '#1e1b4b', '#f472b6'),
    ],
    [
        'code' => 'SRE',
        'door_id' => 'anet-sre',
        'name' => 'Solar Realms Elite (A-Net)',
        'short_name' => 'SRE',
        'author' => 'Amit Patel',
        'version' => '0.992',
        'year' => 1990,
        'desc' => 'Classic multi-player space conquest and empire-building strategy game.',
        'genre' => ['A-Net', 'Space', 'Strategy', 'Classic', 'Multiplayer'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('SRE', 'SPACE EMPIRE', '#0c4a6e', '#082f49', '#38bdf8'),
    ],
    [
        'code' => 'KINGDOMS',
        'door_id' => 'anet-kingdoms',
        'name' => 'Kingdoms (A-Net)',
        'short_name' => 'Kingdoms',
        'author' => 'Tom Tarka',
        'version' => '2.5',
        'year' => 1992,
        'desc' => 'Multi-player kingdom management and medieval warfare strategy door game.',
        'genre' => ['A-Net', 'Strategy', 'Fantasy', 'Multiplayer'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('KINGDOMS', 'MEDIEVAL WAR', '#713f12', '#451a03', '#facc15'),
    ],
    [
        'code' => 'COLONY',
        'door_id' => 'anet-colony',
        'name' => 'Colonies (A-Net)',
        'short_name' => 'Colonies',
        'author' => 'Paul Sidorsky',
        'version' => '2.0',
        'year' => 1994,
        'desc' => 'Space colonization and resource trading multi-player strategy game.',
        'genre' => ['A-Net', 'Space', 'Strategy', 'Simulation'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('COLONIES', 'SPACE COLONY', '#134e4a', '#042f2e', '#2dd4bf'),
    ],
    [
        'code' => 'GD',
        'door_id' => 'anet-gd',
        'name' => 'Galactic Dynasty (A-Net)',
        'short_name' => 'Galactic Dyn',
        'author' => 'Sam Peterson',
        'version' => '1.0',
        'year' => 1991,
        'desc' => 'Space conquest strategy game competing against other dynasties for control of the galaxy.',
        'genre' => ['A-Net', 'Space', 'Strategy', 'Multiplayer'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('G-DYNASTY', 'GALACTIC CONQUEST', '#1e1b4b', '#0f172a', '#a78bfa'),
    ],
    [
        'code' => 'GAL',
        'door_id' => 'anet-gal',
        'name' => 'Galactic Overlord (A-Net)',
        'short_name' => 'Gal Overlord',
        'author' => 'Mike Brand',
        'version' => '1.5',
        'year' => 1990,
        'desc' => 'Classic galactic domination space tactical war door game.',
        'genre' => ['A-Net', 'Space', 'Strategy', 'Classic'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('OVERLORD', 'SPACE WAR', '#1c1917', '#292524', '#f97316'),
    ],
    [
        'code' => 'GALAXY5',
        'door_id' => 'anet-galaxy5',
        'name' => 'Galaxy 5 (A-Net)',
        'short_name' => 'Galaxy 5',
        'author' => 'Sean D. Dennis',
        'version' => '1.2',
        'year' => 1995,
        'desc' => 'Futuristic space warfare and exploration multi-player BBS strategy game.',
        'genre' => ['A-Net', 'Space', 'Strategy', 'Sci-Fi'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('GALAXY 5', 'SCI-FI SPACE', '#0f172a', '#1e293b', '#60a5fa'),
    ],
    [
        'code' => 'SFC',
        'door_id' => 'anet-sfc',
        'name' => 'Star Force Commander (A-Net)',
        'short_name' => 'Star Force Cmd',
        'author' => 'Wolverine Software',
        'version' => '2.1',
        'year' => 1993,
        'desc' => 'Command starships, engage hostile alien fleets, and conquer star systems.',
        'genre' => ['A-Net', 'Space', 'Strategy', 'Simulation'],
        'players' => 'Single-player',
        'icon' => createSvgIcon('SFC', 'STAR FLEET', '#1e293b', '#0284c7', '#38bdf8'),
    ],
    [
        'code' => 'ULTIMATE',
        'door_id' => 'anet-ultimate',
        'name' => 'Ultimate Universe (A-Net)',
        'short_name' => 'Ult Universe',
        'author' => 'Aaron Morris',
        'version' => '1.7',
        'year' => 1994,
        'desc' => 'Legendary space exploration, trading, combat, and empire-building door game.',
        'genre' => ['A-Net', 'Space', 'Strategy', 'Trading', 'Multiplayer'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('ULTIMATE', 'UNIVERSE', '#312e81', '#1e1b4b', '#c084fc'),
    ],
    [
        'code' => 'STARDOCK',
        'door_id' => 'anet-stardock',
        'name' => 'StarDock LOCO (A-Net)',
        'short_name' => 'StarDock',
        'author' => 'G.A.G.S.',
        'version' => '1.0',
        'year' => 1993,
        'desc' => 'Deep space trading, exploration, and combat at the edge of the galaxy.',
        'genre' => ['A-Net', 'Space', 'Strategy', 'Trading'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('STARDOCK', 'DEEP SPACE', '#064e3b', '#022c22', '#34d399'),
    ],
    [
        'code' => 'OREGON',
        'door_id' => 'anet-oregon',
        'name' => 'Oregon Trail (A-Net)',
        'short_name' => 'Oregon Trail',
        'author' => 'MECC / BBS Port',
        'version' => '1.0',
        'year' => 1990,
        'desc' => 'Lead a covered wagon expedition across 19th-century America to the Willamette Valley.',
        'genre' => ['A-Net', 'Adventure', 'Simulation', 'Classic'],
        'players' => 'Single-player',
        'icon' => createSvgIcon('OREGON', 'WAGON TRAIL', '#451a03', '#78350f', '#fde047'),
    ],
    [
        'code' => 'PHANT',
        'door_id' => 'anet-phant',
        'name' => 'Phantasia (A-Net)',
        'short_name' => 'Phantasia',
        'author' => 'Edward Estes',
        'version' => '3.3.2',
        'year' => 1992,
        'desc' => 'Legendary multiplayer fantasy role-playing and character progression game.',
        'genre' => ['A-Net', 'RPG', 'Fantasy', 'Classic'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('PHANTASIA', 'FANTASY RPG', '#4c1d95', '#2e1065', '#d8b4fe'),
    ],
    [
        'code' => 'EXITILUS',
        'door_id' => 'anet-exitilus',
        'name' => 'Exitilus (A-Net)',
        'short_name' => 'Exitilus',
        'author' => 'Exit Software',
        'version' => '1.2',
        'year' => 1995,
        'desc' => 'Rich multi-player dark fantasy role-playing door game with deep character customization.',
        'genre' => ['A-Net', 'RPG', 'Fantasy', 'Multiplayer'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('EXITILUS', 'DARK FANTASY', '#581c87', '#3b0764', '#e879f9'),
    ],
    [
        'code' => 'DOR',
        'door_id' => 'anet-dor',
        'name' => 'Day of Reckoning (A-Net)',
        'short_name' => 'Day of Reckon',
        'author' => 'Apocalypse Software',
        'version' => '1.4',
        'year' => 1994,
        'desc' => 'Post-apocalyptic wasteland survival and faction warfare RPG.',
        'genre' => ['A-Net', 'RPG', 'Post-Apocalyptic', 'Strategy'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('RECKONING', 'WASTELAND', '#7f1d1d', '#450a0a', '#f87171'),
    ],
    [
        'code' => 'ARMAGD',
        'door_id' => 'anet-armagd',
        'name' => 'Armageddon (A-Net)',
        'short_name' => 'Armageddon',
        'author' => 'B.B.S. Software',
        'version' => '2.0',
        'year' => 1993,
        'desc' => 'Post-nuclear survival role-playing game fighting mutants, bandits, and rival gangs.',
        'genre' => ['A-Net', 'RPG', 'Post-Apocalyptic', 'Action'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('ARMAGEDDON', 'POST-NUCLEAR', '#7c2d12', '#431407', '#fb923c'),
    ],
    [
        'code' => 'BATTLEQU',
        'door_id' => 'anet-battlequ',
        'name' => 'Battle Quest (A-Net)',
        'short_name' => 'Battle Quest',
        'author' => 'Software Engineering',
        'version' => '1.0',
        'year' => 1994,
        'desc' => 'Heroic medieval fantasy questing, monster hunting, and arena battles.',
        'genre' => ['A-Net', 'RPG', 'Fantasy', 'Action'],
        'players' => 'Single-player',
        'icon' => createSvgIcon('BATTLE-Q', 'HEROIC QUEST', '#831843', '#500724', '#f472b6'),
    ],
    [
        'code' => 'BUCK',
        'door_id' => 'anet-buck',
        'name' => 'Buccaneer (A-Net)',
        'short_name' => 'Buccaneer',
        'author' => 'Sean D. Dennis',
        'version' => '1.1',
        'year' => 1996,
        'desc' => 'High seas pirate adventure battling rival captains, looting galleons, and hunting treasure.',
        'genre' => ['A-Net', 'RPG', 'Adventure', 'Classic'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('BUCCANEER', 'PIRATE SEAS', '#14532d', '#052e16', '#4ade80'),
    ],
    [
        'code' => 'CRIME',
        'door_id' => 'anet-crime',
        'name' => 'Crime Quest (A-Net)',
        'short_name' => 'Crime Quest',
        'author' => 'Quest Software',
        'version' => '1.0',
        'year' => 1995,
        'desc' => 'Underworld crime empire simulation: run operations, outsmart the mob, and avoid police.',
        'genre' => ['A-Net', 'RPG', 'Strategy', 'Simulation'],
        'players' => 'Single-player',
        'icon' => createSvgIcon('CRIME-Q', 'UNDERWORLD', '#18181b', '#27272a', '#fbbf24'),
    ],
    [
        'code' => 'DOZ',
        'door_id' => 'anet-doz',
        'name' => 'Defenders of Zentax (A-Net)',
        'short_name' => 'Def Zentax',
        'author' => 'CyberTech Games',
        'version' => '1.0',
        'year' => 1994,
        'desc' => 'Futuristic sci-fi defense and tactical combat role-playing game.',
        'genre' => ['A-Net', 'RPG', 'Sci-Fi', 'Action'],
        'players' => 'Single-player',
        'icon' => createSvgIcon('ZENTAX', 'SCI-FI DEFENSE', '#0e7490', '#155e75', '#67e8f9'),
    ],
    [
        'code' => 'DREAD',
        'door_id' => 'anet-dread',
        'name' => 'Dr. Dread (A-Net)',
        'short_name' => 'Dr Dread',
        'author' => 'Dreadful Enterprises',
        'version' => '1.0',
        'year' => 1993,
        'desc' => 'Infiltrate the secret lair of the villainous Dr. Dread in this retro pulp sci-fi adventure.',
        'genre' => ['A-Net', 'RPG', 'Sci-Fi', 'Adventure'],
        'players' => 'Single-player',
        'icon' => createSvgIcon('DR DREAD', 'PULP SCI-FI', '#374151', '#1f2937', '#f87171'),
    ],
    [
        'code' => 'SH',
        'door_id' => 'anet-sh',
        'name' => 'Adventures of Sherlock Holmes (A-Net)',
        'short_name' => 'Sherlock',
        'author' => 'Victorian Software',
        'version' => '1.0',
        'year' => 1992,
        'desc' => 'Classic interactive detective fiction solving intricate mysteries across Victorian London.',
        'genre' => ['A-Net', 'Adventure', 'Interactive Fiction', 'Classic'],
        'players' => 'Single-player',
        'icon' => createSvgIcon('SHERLOCK', 'DETECTIVE', '#3f3f46', '#18181b', '#e4e4e7'),
    ],
    [
        'code' => 'GOC',
        'door_id' => 'anet-goc',
        'name' => 'Godfather of Crime (A-Net)',
        'short_name' => 'Godfather',
        'author' => 'Syndicate Games',
        'version' => '1.0',
        'year' => 1995,
        'desc' => 'Rise through the ranks of organized crime to become the ultimate Capo di Tutti Capi.',
        'genre' => ['A-Net', 'RPG', 'Strategy', 'Simulation'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('GODFATHER', 'MAFIA EMPIRE', '#27272a', '#09090b', '#ef4444'),
    ],
    [
        'code' => 'GOTHIK',
        'door_id' => 'anet-gothik',
        'name' => 'Gothik (A-Net)',
        'short_name' => 'Gothik',
        'author' => 'Dark Realm Games',
        'version' => '1.0',
        'year' => 1994,
        'desc' => 'Gothic fantasy role-playing journey through cursed lands, catacombs, and forgotten kingdoms.',
        'genre' => ['A-Net', 'RPG', 'Fantasy'],
        'players' => 'Single-player',
        'icon' => createSvgIcon('GOTHIK', 'DARK REALM', '#312e81', '#1e1b4b', '#a5b4fc'),
    ],
    [
        'code' => 'MADKINGS',
        'door_id' => 'anet-madkings',
        'name' => 'Mad King\'s Dungeon (A-Net)',
        'short_name' => 'Mad Kings',
        'author' => 'Dungeon Master Software',
        'version' => '1.0',
        'year' => 1993,
        'desc' => 'Deep dungeon crawler exploring subterranean mazes packed with traps, treasures, and beasts.',
        'genre' => ['A-Net', 'RPG', 'Dungeon Crawler', 'Fantasy'],
        'players' => 'Single-player',
        'icon' => createSvgIcon('MAD KINGS', 'DUNGEON CRAWL', '#701a75', '#4a044e', '#f0abfc'),
    ],
    [
        'code' => 'REBEL',
        'door_id' => 'anet-rebel',
        'name' => 'Rebel Kingdom (A-Net)',
        'short_name' => 'Rebel Kingdom',
        'author' => 'Kingdom Soft',
        'version' => '1.2',
        'year' => 1994,
        'desc' => 'Lead a rebellion against tyrannical monarchs or defend the realm in medieval combat.',
        'genre' => ['A-Net', 'RPG', 'Strategy', 'Fantasy'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('REBEL', 'KINGDOM WAR', '#854d0e', '#713f12', '#fef08a'),
    ],
    [
        'code' => 'CWAR',
        'door_id' => 'anet-cwar',
        'name' => 'Civil War (A-Net)',
        'short_name' => 'Civil War',
        'author' => 'Historical Simulations',
        'version' => '1.0',
        'year' => 1991,
        'desc' => 'Command historic regiments, manage supplies, and maneuver tactical battles across the war.',
        'genre' => ['A-Net', 'War', 'Strategy', 'Classic'],
        'players' => 'Single-player',
        'icon' => createSvgIcon('CIVIL WAR', 'HISTORIC TAC', '#334155', '#1e293b', '#94a3b8'),
    ],
    [
        'code' => 'AGEOFWAR',
        'door_id' => 'anet-ageofwar',
        'name' => 'Age of War (A-Net)',
        'short_name' => 'Age of War',
        'author' => 'Warfare Studios',
        'version' => '1.0',
        'year' => 1995,
        'desc' => 'Strategic multiplayer civilization warfare: train troops, build fortresses, and crush enemies.',
        'genre' => ['A-Net', 'War', 'Strategy', 'Multiplayer'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('AGE OF WAR', 'TOTAL WAR', '#7f1d1d', '#991b1b', '#fca5a5'),
    ],
    [
        'code' => 'BOTWARS',
        'door_id' => 'anet-botwars',
        'name' => 'Bot Wars (A-Net)',
        'short_name' => 'Bot Wars',
        'author' => 'RoboTech Software',
        'version' => '1.0',
        'year' => 1994,
        'desc' => 'Engineer combat robots, customize armor and weaponry, and clash in futuristic arenas.',
        'genre' => ['A-Net', 'War', 'Sci-Fi', 'Strategy'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('BOT WARS', 'ROBOT COMBAT', '#0369a1', '#075985', '#7dd3fc'),
    ],
    [
        'code' => 'ROBOWARS',
        'door_id' => 'anet-robowars',
        'name' => 'Robo Wars (A-Net)',
        'short_name' => 'Robo Wars',
        'author' => 'CyberWars Inc',
        'version' => '1.0',
        'year' => 1993,
        'desc' => 'Tactical mech battles and robot war championships in dystopian futuristic combat zones.',
        'genre' => ['A-Net', 'War', 'Sci-Fi', 'Action'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('ROBO WARS', 'MECH ARENA', '#4c0519', '#881337', '#fda4af'),
    ],
    [
        'code' => 'AMIGA',
        'door_id' => 'anet-amiga',
        'name' => 'Amiga Empire (A-Net)',
        'short_name' => 'Amiga Empire',
        'author' => 'Commodore Door Crew',
        'version' => '1.0',
        'year' => 1992,
        'desc' => 'Classic BBS space empire simulation ported from the Commodore Amiga scene.',
        'genre' => ['A-Net', 'Strategy', 'Classic', 'Simulation'],
        'players' => 'Multi-player',
        'icon' => createSvgIcon('AMIGA-EMP', 'CLASSIC RETRO', '#9d174d', '#831843', '#f472b6'),
    ],
];

echo "Processing " . count($doors) . " A-Net doors...\n";

$checkStmt = $pdo->prepare("SELECT id FROM rlogin_doors WHERE door_id = :door_id");
$insertStmt = $pdo->prepare("
    INSERT INTO rlogin_doors (
        door_id, name, short_name, author, game_version, release_year,
        description, genre, players, icon_data, icon_mime, icon_size,
        bbs_type, host, port, client_username, server_username,
        terminal_type, terminal_speed, output_encoding,
        enabled, credit_cost, max_time_minutes, max_sessions,
        allow_anonymous, guest_max_sessions, hide_from_web,
        created_at, updated_at
    ) VALUES (
        :door_id, :name, :short_name, :author, :game_version, :release_year,
        :description, :genre, :players, :icon_data, :icon_mime, :icon_size,
        'plain_rlogin', 'game.a-net-online.lol', 513, '{user_name}', '{user_name}-ADV',
        :terminal_type, 38400, 'cp437',
        true, 0, 60, 10,
        false, 2, false,
        NOW(), NOW()
    )
");

$updateStmt = $pdo->prepare("
    UPDATE rlogin_doors SET
        name = :name,
        short_name = :short_name,
        author = :author,
        game_version = :game_version,
        release_year = :release_year,
        description = :description,
        genre = :genre,
        players = :players,
        icon_data = :icon_data,
        icon_mime = :icon_mime,
        icon_size = :icon_size,
        bbs_type = 'plain_rlogin',
        host = 'game.a-net-online.lol',
        port = 513,
        client_username = '{user_name}',
        server_username = '{user_name}-ADV',
        terminal_type = :terminal_type,
        terminal_speed = 38400,
        output_encoding = 'cp437',
        enabled = true,
        credit_cost = 0,
        max_time_minutes = 60,
        max_sessions = 10,
        allow_anonymous = false,
        guest_max_sessions = 2,
        hide_from_web = false,
        updated_at = NOW()
    WHERE door_id = :door_id
");

$added = 0;
$updated = 0;

foreach ($doors as $d) {
    $checkStmt->execute([':door_id' => $d['door_id']]);
    $exists = $checkStmt->fetchColumn();

    $params = [
        ':door_id' => $d['door_id'],
        ':name' => $d['name'],
        ':short_name' => $d['short_name'],
        ':author' => $d['author'],
        ':game_version' => $d['version'],
        ':release_year' => $d['year'],
        ':description' => $d['desc'],
        ':genre' => json_encode($d['genre']),
        ':players' => $d['players'],
        ':icon_data' => $d['icon'],
        ':icon_mime' => 'image/svg+xml',
        ':icon_size' => strlen($d['icon']),
        ':terminal_type' => 'xtrn=' . $d['code'],
    ];

    if ($exists) {
        $updateStmt->execute($params);
        $updated++;
        echo "Updated: {$d['name']} ({$d['door_id']}) -> xtrn={$d['code']}\n";
    } else {
        $insertStmt->execute($params);
        $added++;
        echo "Added: {$d['name']} ({$d['door_id']}) -> xtrn={$d['code']}\n";
    }
}

echo "\nDone! Added: {$added}, Updated: {$updated}.\n";
