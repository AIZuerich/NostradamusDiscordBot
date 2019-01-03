const Channel = require('./channel');
const db = require('./db');

const Role = {};

Role.names = {
    // french level
    'beginner': 'Débutant',
    'intermediate': 'Intermédiaire',
    'advanced': 'Avancé',
    'native': 'Francophone Natif',

    // french level alts
    'débutant': 'Débutant',
    'debutant': 'Débutant',
    'débutante': 'Débutant',
    'debutante': 'Débutant',
    'intermédiaire': 'Intermédiaire',
    'intermediaire': 'Intermédiaire',
    'avancé': 'Avancé',
    'avance': 'Avancé',
    'avancée': 'Avancé',
    'avancee': 'Avancé',
    'natif': 'Francophone Natif',
};

Role.frenchLevelNames = {
    // french level
    'beginner': Role.names.beginner,
    'débutant': Role.names.beginner,
    'debutant': Role.names.beginner,
    'débutante': Role.names.beginner,
    'debutante': Role.names.beginner,
    'intermediate': Role.names.intermediate,
    'intermédiaire': Role.names.intermediate,
    'intermediaire': Role.names.intermediate,
    'advanced': Role.names.advanced,
    'avancé': Role.names.advanced,
    'avance': Role.names.advanced,
    'avancée': Role.names.advanced,
    'avancee': Role.names.advanced,
    'native': Role.names.native,
    'natif': Role.names.native,
};

Role.frenchLevelRoles = [
    Role.names.beginner,
    Role.names.intermediate,
    Role.names.advanced,
    Role.names.native
];

Role.languages = [];
Role.languagesFriendly = [];
Role.countries = [];
Role.countriesFriendly = [];
Role.NO_COUNTRY = 'SANS PAYS';
Role.NO_LANGUAGE = 'SANS LANGUE';
Role.alts = {};

const init = () => {
    db.query('SELECT * FROM languages').on('result', function(row) {
        Role.names[row.friendly.toLowerCase()] = row.role;
		Role.alts[row.role.toLowerCase()] = row.role;

        if (!Role.languages.includes(row.role)) {
            Role.languages.push(row.role);
            Role.languagesFriendly.push(row.friendly);
        }
    }).on('error', function(err) {
        Channel.logInChannel('Error loading languages: ' + err);
    }).on('end', function() {
        // sort alpha
        Role.languagesFriendly.sort();
    });

    db.query('SELECT * FROM countries').on('result', function(row) {
        Role.names[row.friendly.toLowerCase()] = row.role;
        Role.alts[row.role.toLowerCase()] = row.role;

        if (!Role.countries.includes(row.role)) {
            Role.countries.push(row.role);
            Role.countriesFriendly.push(row.friendly);
        }
    }).on('error', function(err) {
        Channel.logInChannel('Error loading countries: ' + err);
    }).on('end', function() {
        // all rows have been received
        Role.countriesFriendly.sort();
    });
};

init();


Role.add = (english, french, type) => {
	db.query('SET NAMES utf8');

	if (type === 'countries' || type === 'languages') {
        if (type === 'countries') {
            Role.countries.push(french);
            Role.countriesFriendly.push(english);
        } else {
            Role.languages.push(french);
            Role.languagesFriendly.push(english);
        }

        const start = 'INSERT INTO ' + type;
        db.query(start + ' (friendly, role) VALUES (?, ?)', [english, french], function (error) {
            if (error) {
                Channel.logInChannel('error adding role to database:' + error);
            } else {
                Channel.logInChannel('added ' + english + '|' + french + ' to ' + type + ' table');
            }
        });
	}
};

// helper functions
Role.isLanguageRole = (role) => {
    return Role.languagesFriendly.some(function(el) {
        return el.toLowerCase() === role.toLowerCase();
    });
};

Role.isCountryRole = (role) => {
    return Role.countriesFriendly.some(function(el) {
        return el.toLowerCase() === role.toLowerCase();
    });
};

Role.createRole = (guild, name) => {
    return guild.createRole({ name: name, permissions: [] });
};

// possible names for each role
Role.alts = Object.assign(Role.alts, {
    'debutant': Role.names.beginner,
    'débutant': Role.names.beginner,
    'debutante': Role.names.beginner,
    'débutante': Role.names.beginner,
    'intermediaire': Role.names.intermediate,
    'intermédiaire': Role.names.intermediate,
    'avancé': Role.names.advanced,
    'avancée': Role.names.advanced,
    'natif': Role.names.native,
    'français': Role.names.native,
    'usa': 'États-Unis',
    'united states': Role.names.usa,
    'united states of america': Role.names.usa,
    'us': Role.names.usa,
    'america': Role.names.usa,
    'uk': 'Royaume-Uni',
    'united kingdom': Role.names.uk,
    'etats-unis': Role.names.usa,
    'états-unis': Role.names.usa,
    'états unis': Role.names.usa,
    'etats unis': Role.names.usa,
});

module.exports = Role;