moment.locale('fr');

// ----------
// Constants
// ----------

var KIND_COLORS = {
  canceled:    'black',
  competition: 'red',
  friendly:    'purple',
  holidays:    'black',
  internal:    'purple',
  leasure:     'green',
  move:        'grey',
  team:        'red',
  training:    'blue'
};
var KIND_TAGS = {
  canceled:    'Séance annulée',
  competition: 'Compétition',
  holidays:    'Vacances',
  internal:    'Tournoi interne',
  leasure:     'Soirée challenge loisir',
  move:        'Séance délocalisée',
  team:        'Compétition équipe',
  training:    'Séance normale'
};

var LOC_VDN      = 'Nevers - Maison des Sports';
var LOC_VDN2     = 'Nevers - Gymnase des Loges';
var LOC_OPEN     = 'Nevers - Gymnase Jean Rostand';
var LOC_MARZY    = 'Marzy - Gymnase multisport';
var LOC_ASGU     = 'Guérigny - Gymnase des forges';
var LOC_CORBIGNY = 'Corbigny - COSEC';
var LOC_CHARIBAD = 'La Charité - Gymnase du complexe Georges Picq';

var REGULAR_TRAINING_LOCATIONS = {
  1: LOC_VDN,
  5: LOC_VDN2
};
var REGULAR_TRAINING_HOURS = {
  1: '20h-22h30',
  5: '18h45-21h'
};
var REGULAR_TRAINING_START = moment('2018-11-05');
var REGULAR_TRAINING_END   = moment('2019-07-01');
var REGULAR_TRAINING_DAYS  = [1, 5]; // Monday, Friday

var TXT_WORKS = 'Travaux à la maison des Sports';
var TXT_CARS  = 'La séance se déroulera au gymnase du collège des Loges (Nevers).<br />' + 
                'Pensez au covoiturage !';
var TXT_LEASURE = 'Les joueurs des clubs locaux se rencontrent au cours d\'un tournoi amical.<br />'
                + 'Les équipes sont constituées autant que possible de débutants.';
var TXT_TEAM = 'Les équipes des clubs locaux s\'affrontent au cours d\'une soirée.<br />' +
               'Les résultats des matchs comptent pour le classement final des équipes.';

/**
 * Data in events:
 * date (required)
 * kind (required): see enums
 * location
 * newLocation: replacing location (case of moved events for instance)
 * hours
 * tag: What to put in the label tag. By default, depends on the kind (see KIND_TAGS).
 * comments
 * warning: a warning message to add, with a warning sign icon
 *
 * By default, training events come with date, kind, location, hours. You can override everything but the date.
 */

var TRAINING_PATCHES = [
  // Moved trainings
  { date: '2018-11-12', kind: 'move', warning: TXT_WORKS, newLocation: LOC_VDN2 + ' (19h30-21h30)', comments: TXT_CARS },
  { date: '2018-11-19', kind: 'move', warning: TXT_WORKS, newLocation: LOC_VDN2 + ' (19h30-21h30)', comments: TXT_CARS },
  { date: '2018-11-26', kind: 'move', warning: TXT_WORKS, newLocation: LOC_VDN2 + ' (19h30-21h30)', comments: TXT_CARS },
  { date: '2018-12-03', kind: 'move', warning: TXT_WORKS, newLocation: LOC_VDN2 + ' (19h30-21h30)', comments: TXT_CARS },
  { date: '2018-12-10', kind: 'move', warning: TXT_WORKS, newLocation: LOC_VDN2 + ' (19h30-21h30)', comments: TXT_CARS },
  { date: '2018-12-17', kind: 'move', warning: TXT_WORKS, newLocation: LOC_VDN2 + ' (19h30-21h30)', comments: TXT_CARS },
  { date: '2019-01-07', kind: 'move', warning: TXT_WORKS, newLocation: LOC_VDN2 + ' (19h30-21h30)', comments: TXT_CARS },
  { date: '2019-01-14', kind: 'move', warning: TXT_WORKS, newLocation: LOC_VDN2 + ' (19h30-21h30)', comments: TXT_CARS },
  { date: '2019-01-21', kind: 'move', warning: TXT_WORKS, newLocation: LOC_VDN2 + ' (19h30-21h30)', comments: TXT_CARS },
  { date:        '2019-03-04',
    kind:        'move',
    warning:     'Gymnastique à la maison des Sports',
    newLocation: LOC_VDN2 + ' (19h30-22h)',
    comments:    'La Maison des Sports est réquisitionnée pour une compétition de gymnastique.<br/>' + TXT_CARS },
  { date: '2019-06-03', kind: 'move', warning: TXT_WORKS, newLocation: LOC_VDN2 + ' (19h30-21h30)' },

  // Canceled trainings
  { date: '2018-11-05', kind: 'canceled', warning: TXT_WORKS },
  { date: '2018-12-21', kind: 'canceled', comments: 'L\'effectif est extrêment réduit avant les vacances, la séance est annulée.' },
  { date: '2019-06-21', kind: 'canceled', comments: 'En raison de la fête de la musique, très peu de joueurs ont manifesté leur intérêt pour cet entraînement.<br />En conséquence, la séance est annulée' },
  { date: '2019-06-28', kind: 'canceled', comments: 'En raison de la canicule, la séance est annulée.' },

  // Holidays
  { date: '2018-12-24', kind: 'holidays' },
  { date: '2018-12-28', kind: 'holidays' },
  { date: '2018-12-31', kind: 'holidays' },
  { date: '2019-01-04', kind: 'holidays' },
  { date: '2019-04-22', kind: 'holidays', tag: 'Jour férié', comments: 'Séance annulée en raison d\'un jour férié.<br />(Désolé pour l\'annonce tardive)' },
  { date: '2019-06-10', kind: 'holidays', tag: 'Jour férié', comments: 'Séance annulée en raison d\'un jour férié (la Maison des Sports est fermée).' },
  
  // Leasures
  { date: '2019-06-24', kind: 'leasure', warning: 'Espace réduit', comments: 'Doubles H / Doubles D<br />' + TXT_LEASURE },

  // Other
  { date: '2019-02-11', kind: 'friendly', tag: 'Soirée crêpes', comments: 'Après une séance normale quoique légèrement raccourcie, nous fêterons la Chandeleur.<br /><br />Volontaires pour faire quelques crêpes ? Contactez Sabrina !' },
  { date: '2019-02-25', kind: 'internal', comments: 'Double mixte<br /><br />Tournoi entre les membres du club.<br />Inscriptions auprès de Pierre-Alexandre ou par mail.<br /><br />Des terrains restent disponibles pour les joueurs qui souhaitent une séance normale.' },
  { date: '2019-05-13', kind: 'friendly', tag: 'Soirée Handisport', comments: 'Cette soirée est l\'occasion d\'essayer le para-badminton (badminton en fauteuil roulant).<br />Nous clôturons cette soirée par un pot amical.' },
  { date: '2019-07-01', kind: 'friendly', tag: 'Verre de l\'amitié', warning: TXT_WORKS, newLocation: LOC_VDN2 + ' (19h30-21h30)', comments: 'La séance se déroulera au gymnase du collège des Loges (Nevers).<br /><br />Pour cette dernière, nous terminerons l\'entraînement par un petit casse-croûte.<br />Chacun apporte un petit truc à grignoter et à boire afin de partager un moment convivial.' }
];

var ADDITIONAL_EVENTS = [
  // Leasures
  { date: '2018-10-15', kind: 'leasure', hours: '20h-22h30', location: LOC_VDN,      comments: 'Doubles mixtes<br />' + TXT_LEASURE, warning: ' Pas d\'entraînement' },
  { date: '2018-11-15', kind: 'leasure', hours: '20h-22h30', location: LOC_OPEN,     comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2018-12-13', kind: 'leasure', hours: '20h-23h30', location: LOC_MARZY,    comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2019-01-17', kind: 'leasure', hours: '20h-23h30', location: LOC_ASGU,     comments: 'Doubles H / Doubles D<br />' + TXT_LEASURE },
  { date: '2019-03-21', kind: 'leasure', hours: '20h-23h30', location: LOC_MARZY,    comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2019-05-23', kind: 'leasure', hours: '20h-23h30', location: LOC_ASGU,     comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2019-06-06', kind: 'leasure', hours: '20h-23h30', location: LOC_OPEN,     comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2019-06-13', kind: 'leasure', hours: '20h-23h30', location: LOC_CORBIGNY, comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2019-07-02', kind: 'leasure', hours: '20h-23h30', location: LOC_CHARIBAD, comments: 'Les joueurs des clubs locaux se rencontrent au cours d\'un tournoi amical.<br />Les équipes sont tirées au sort pour appairer des joueurs de clubs différents.', tag: 'Soirée challenge "mix"' },

  // Competition
  { date: '2018-11-25', kind: 'competition', hours: '9h-17h', location: LOC_ASGU,     comments: 'Doubles mixtes / Doubles hommes<br /><br />Inscription : 5€/pers.<br />Repas offert. Résultats et verre de l\'amitié à 17h.<br />S\'inscrire auprès de Sabrina avant le 20/11.' },
  { date: '2019-02-12', kind: 'competition', hours: '9h-17h', location: LOC_CHARIBAD, comments: 'Simples<br />Rencontres en simples contre les joueurs du coin.' },
  { date: '2019-03-17', kind: 'competition', hours: '9h-18h', location: LOC_VDN,      comments: 'Doubles mixtes / Doubles hommes<br /><br />Inscription : 6€/pers.<br />Repas offert. Résultats et verre de l\'amitié en fin de journée.' },

  // Team
  { date: '2018-11-29', kind: 'team', hours: '20h-23h30', location: LOC_CORBIGNY, comments: 'Doubles mixtes<br />' + TXT_TEAM },
  { date: '2018-12-18', kind: 'team', hours: '20h-23h30', location: LOC_CHARIBAD, comments: 'Doubles H / Doubles D<br />' + TXT_TEAM },
  { date: '2019-01-28', kind: 'team', hours: '20h-23h30', location: LOC_VDN,      comments: 'Doubles mixtes<br />' + TXT_TEAM + '<b>Pour les membres du VDN hors équipe :<br />Séance délocalisée au Gymnase des Loges</b>' },
  { date: '2019-03-07', kind: 'team', hours: '20h-23h30', location: LOC_ASGU,     comments: 'Doubles H / Doubles D<br />' + TXT_TEAM },
  { date: '2019-04-04', kind: 'team', hours: '20h-23h30', location: LOC_ASGU,     comments: 'Doubles mixtes<br />' + TXT_TEAM },
  { date: '2019-05-09', kind: 'team', hours: '20h-23h30', location: LOC_OPEN,     comments: 'Doubles mixtes<br />' + TXT_TEAM },

  // Other
  { date: '2019-03-12', kind: 'friendly', tag: 'Rencontre amicale',                     hours: '19h-22h', location: LOC_OPEN,           comments: 'Le club de badminton ABN nous invite pour une rencontre amicale.<br />Cette rencontre ne prendra pas forme de tournoi, mais juste de jeu libre nous permettant de taper le volant entre joueurs.<br /><br />Cette soirée se conclura par une "auberge espagnole" (chacun peut emmener quelque chose à partager à la fin de la soirée).' },
  { date: '2019-04-11', kind: 'canceled', tag: 'Soirée challenge loisirs<br />Annulée', hours: '19h-22h', location: LOC_OPEN,           comments: 'Doubles mixtes<br />' + TXT_LEASURE + '<br /><br />Soirée reportée au jeudi 6 juin.'  },
  { date: '2019-06-25', kind: 'friendly', tag: 'Assemblée Générale',                    hours: '19h',     location: 'Locaux de la FOL', comments: 'L\'Assemblée Générale se déroulera à partir de 19h dans les locaux de la FOL, 7/11 rue du Commandant Rivière 58000 Nevers.<br />Venez nombreux !' }
];


// ---------------------------
// Compute all relevant dates
// ---------------------------

var allDates = [];

// Training dates
var cursor = REGULAR_TRAINING_START.clone();
while (cursor.isSameOrBefore(REGULAR_TRAINING_END)) {
  if (REGULAR_TRAINING_DAYS.indexOf(cursor.day()) !== -1) {
    var date = cursor.clone();
    allDates.push({
      date:     date,
      kind:     'training',
      location: REGULAR_TRAINING_LOCATIONS[date.day()],
      hours:    REGULAR_TRAINING_HOURS[date.day()]
    });
  }
  cursor.add(1, 'day');
}

// Apply patches on trainings
for (var i = 0; i < TRAINING_PATCHES.length; i++) {
  var patch  = TRAINING_PATCHES[i];
  var origin = findDateItem(patch.date);
  origin.kind        = patch.kind     || origin.kind;
  origin.location    = patch.location || origin.location;
  origin.hours       = patch.hours    || origin.hours;
  origin.comments    = patch.comments || origin.comments;
  origin.warning     = patch.warning  || origin.warning;
  origin.tag         = patch.tag      || origin.tag;
  origin.newLocation = patch.newLocation;
}

// Add special events
for (var i = 0; i < ADDITIONAL_EVENTS.length; i++) {
  ADDITIONAL_EVENTS[i].date = moment(ADDITIONAL_EVENTS[i].date);
  allDates.push(ADDITIONAL_EVENTS[i]);
}

// Sort then group by month
allDates.sort((a, b) => {
  return a.date.isSameOrBefore(b.date) ? -1 : 1;
});

var allDatesByMonth = {};
var allMonths = [];
for (var i = 0; i < allDates.length; i++) {
  var month = allDates[i].date.format('YYYY-MM');
  if (!allDatesByMonth[month]) {
    allDatesByMonth[month] = [];
    allMonths.push(month);
  }
  allDatesByMonth[month].push(allDates[i]);
}


// -----
// Draw
// -----

setTimeout(drawCalendar, 50);

function drawCalendar() {
  var $calendarArea = $('#calendarArea');
  var $tabArea = $('<div class="ui top attached tabular menu">').appendTo(calendarArea);

  for (var i = 0; i < allMonths.length; i++) {
    addTab($calendarArea, $tabArea, allMonths[i], allDatesByMonth[allMonths[i]]);
  }

  // Create tabs and auto-select current month if possible (else select the nearest month)
  var tabDate = moment();
  if (tabDate.isBefore(allDates[0].date)) {
    tabDate = allDates[0].date;
  }
  if (tabDate.isAfter(allDates[allDates.length-1].date)) {
    tabDate = allDates[allDates.length-1].date;
  }
  var tabId = 'tab_' + tabDate.year() + '_' + tabDate.month();

  $('.tabular.menu .item').tab();
  $('.tabular.menu .item').tab('change tab', tabId);
}

function addTab($calendarArea, $tabArea, monthIsoId, monthEvents) {
  var month = moment(monthIsoId);
  var tabId = 'tab_' + month.year() + '_' + month.month();
  var tabLabel = upperFirst(month.format('MMMM'));
  $('<div class="item" data-tab="' + tabId + '">' + tabLabel + '</div>').appendTo($tabArea);

  var $tabContent = $('<div class="ui tab bottom attached segment" data-tab="' + tabId + '">').appendTo($calendarArea);
  var $eventTable = $('<table class="ui table">').appendTo($tabContent);

  for (var i = 0; i < monthEvents.length; i++) {
    addEvent($eventTable, monthEvents[i]);
  }
}

function addEvent($eventTable, monthEvent) {
  var date        = upperFirst(monthEvent.date.format('dddd D MMMM YYYY'));
  var hours       = monthEvent.hours;
  var location    = monthEvent.location;
  var newLocation = monthEvent.newLocation;
  var color       = KIND_COLORS[monthEvent.kind];
  var tag         = monthEvent.tag || KIND_TAGS[monthEvent.kind];
  var comments    = monthEvent.comments || '';
  var warning     = monthEvent.warning;

  if (monthEvent.kind === 'move' || monthEvent.kind === 'canceled' || monthEvent.kind === 'holidays') {
    location = null;
    hours = '';
  }

  var $tr = $('<tr>').appendTo($eventTable);
  var $summaryTd  = $('<td></td>').appendTo($tr);
  $('<b>' + date + '</b>').appendTo($summaryTd);
  if (!!hours) {
    $('<span> - <i>' + hours + '</i></span>').appendTo($summaryTd);
  }

  if (!!location) {
    $('<br />').appendTo($summaryTd);
    $('<span>' + location + '</span>').appendTo($summaryTd);
  }
  if (!!warning) {
    $('<br />').appendTo($summaryTd);
    $('<i class="ui red icon warning sign"></i>').appendTo($summaryTd);
    $('<span style="color: red;">' + warning + '</span>').appendTo($summaryTd);
  }
  if (!!newLocation) {
    $('<br />').appendTo($summaryTd);
    $('<i class="ui blue icon right arrow"></i>').appendTo($summaryTd);
    $('<span>' + newLocation + '</span>').appendTo($summaryTd);
  }

  var $tagTd = $('<td class="center aligned">' +
                 '<span class="ui ' + color + ' label">' + tag + '</span>' + 
                 '</td>').appendTo($tr);

  var $commentsTd = $('<td>' + comments + '</td>').appendTo($tr);
}

function findDateItem(date) {
  for (var i = 0; i < allDates.length; i++) {
    if (allDates[i].date.isSame(date)) {
      return allDates[i];
    }
  }
  return null;
}


function upperFirst(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}