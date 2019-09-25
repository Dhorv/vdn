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
  5: '19h-22h'
};
var REGULAR_TRAINING_START = moment('2019-09-06');
var REGULAR_TRAINING_END   = moment('2020-07-03');
var REGULAR_TRAINING_DAYS  = [1, 5]; // Monday, Friday

var TXT_WORKS = 'Travaux à la maison des Sports';
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
  { date: '2019-09-09', kind: 'move', warning: TXT_WORKS, newLocation: LOC_VDN2 + ' (19h30-22h)' },
  { date: '2019-09-16', kind: 'move', warning: TXT_WORKS, newLocation: LOC_VDN2 + ' (19h30-22h)' },
  { date: '2019-09-23', kind: 'move', warning: 'SIVIM',   newLocation: LOC_VDN2 + ' (19h30-22h)', comments: 'La Maison des Sports est réquisitionnée pour le SIVIM.' },
  { date: '2019-09-30', kind: 'move', warning: 'SIVIM',   newLocation: LOC_VDN2 + ' (19h30-22h)', comments: 'La Maison des Sports est réquisitionnée pour le SIVIM.' },

  // Canceled trainings
  // { date: '2018-11-05', kind: 'canceled', warning: TXT_WORKS },

  // Holidays
  // { date: '2018-12-24', kind: 'holidays' },
  
  // Leasures
  // { date: '2019-06-24', kind: 'leasure', warning: 'Espace réduit', comments: 'Doubles H / Doubles D<br />' + TXT_LEASURE },

  // Other
];

var ADDITIONAL_EVENTS = [

  // Leasures
  { date: '2019-10-01', kind: 'leasure', hours: '20h', location: LOC_CHARIBAD, comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2019-10-17', kind: 'leasure', hours: '20h', location: LOC_ASGU,     comments: 'Doubles dames, doubles hommes<br />' + TXT_LEASURE },
  { date: '2019-11-07', kind: 'leasure', hours: '20h', location: LOC_CORBIGNY, comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2019-11-21', kind: 'leasure', hours: '20h', location: LOC_MARZY,    comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2019-12-09', kind: 'leasure', hours: '20h', location: LOC_VDN,      comments: 'Doubles dames, doubles hommes<br />' + TXT_LEASURE, warning: ' Pas d\'entraînement' },
  { date: '2020-01-14', kind: 'leasure', hours: '20h', location: LOC_CHARIBAD, comments: 'Doubles dames, doubles hommes<br />' + TXT_LEASURE },
  { date: '2020-02-06', kind: 'leasure', hours: '20h', location: LOC_ASGU,     comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2020-03-19', kind: 'leasure', hours: '20h', location: LOC_MARZY,    comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2020-04-06', kind: 'leasure', hours: '20h', location: LOC_VDN,      comments: 'Doubles dames, doubles hommes<br />' + TXT_LEASURE, warning: ' Pas d\'entraînement' },
  { date: '2020-05-14', kind: 'leasure', hours: '20h', location: LOC_CORBIGNY, comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2020-06-04', kind: 'leasure', hours: '20h', location: LOC_ASGU,     comments: 'Tirage au sort des doubles<br />' + TXT_LEASURE },

  // Competition
  { date: '2019-11-24', kind: 'competition', hours: '9h-18h', location: LOC_ASGU, comments: 'Précisions à venir<br />Les années précédentes, le format était le suivant : doubles mixtes et doubles hommes, repas ensemble le midi, inscription de 5 ou 6€.' },
  { date: '2020-03-15', kind: 'competition', hours: '9h-18h', location: LOC_VDN,  comments: 'Précisions à venir<br />Les années précédentes, le format était le suivant : doubles mixtes et doubles hommes, repas ensemble le midi, inscription de 5 ou 6€.' },

  // Team
  // { date: '2018-11-29', kind: 'team', hours: '20h-23h30', location: LOC_CORBIGNY, comments: 'Doubles mixtes<br />' + TXT_TEAM },

  // Other
  { date: '2019-09-07', kind: 'friendly', tag: 'Samedi Sports', hours: '9h30-18h', location: 'Parc Salengro', comments: 'Le club tiendra un stand toute la journée. Volontaires recherchés !' },
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