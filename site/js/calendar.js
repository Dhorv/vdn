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
  move:        'orange',
  team:        'red',
  training:    'grey'
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
  4: LOC_VDN2,
  5: LOC_VDN2
};
var REGULAR_TRAINING_HOURS = {
  1: '20h-22h30',
  4: '20h-22h30',
  5: '19h30-22h30'
};
var CALENDAR_START = moment('2021-09-06');
var CALENDAR_END = moment('2022-07-01');
var REGULAR_TRAINING_START = moment('2021-09-06');
var REGULAR_TRAINING_END   = moment('2022-07-01');
var REGULAR_TRAINING_DAYS  = [1, 4, 5]; // Monday, Thursday, Friday

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
  { date: '2021-09-06', kind: 'friendly', tag: 'Rentrée', comments: 'De retour pour une nouvelle année !' },

  // Moved trainings
  { date: '2021-11-01', kind: 'move', hours: '20h-22h30', warning: 'Maison des Sports fermée', newLocation: LOC_VDN2 },
  //{ date: '2019-09-23', kind: 'move', warning: 'SIVIM',   newLocation: LOC_VDN2 + ' (19h30-22h)', comments: 'La Maison des Sports est réquisitionnée pour le SIVIM.' },

  // Canceled trainings
  //{ date: '2020-12-07', kind: 'canceled', warning: TXT_WORKS }

  // Holidays
  // { date: '2018-12-24', kind: 'holidays' },
  
  // Leasures
  // { date: '2019-06-24', kind: 'leasure', warning: 'Espace réduit', comments: 'Doubles H / Doubles D<br />' + TXT_LEASURE },
  // { date: '2020-03-13', kind: 'internal', warning: 'Pas d\'entraînement', comments: 'Tournoi en simples, réservé aux joueurs du club.<br />A priori, un seul tableau (hommes, femmes, débutants, anciens... seront mélangés), sauf s\'il y a suffisamment de participants pour faire deux groupes.' },

  // Other
];

// To be updated "soon"
var ADDITIONAL_EVENTS = [

  // Leasures
  { date: '2020-11-03', kind: 'leasure', hours: '20h', location: LOC_CHARIBAD, comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2020-12-03', kind: 'leasure', hours: '20h', location: LOC_ASGU,     comments: 'Doubles dames, doubles hommes<br />' + TXT_LEASURE },
  { date: '2021-01-14', kind: 'leasure', hours: '20h', location: LOC_MARZY,    comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2021-02-01', kind: 'leasure', hours: '20h', location: LOC_VDN,      comments: 'Simples dames, doubles hommes<br />' + TXT_LEASURE, warning: 'Pas de séance' },
  { date: '2021-03-09', kind: 'leasure', hours: '20h', location: LOC_CHARIBAD, comments: 'Doubles dames, doubles hommes<br />' + TXT_LEASURE },
  { date: '2021-04-01', kind: 'leasure', hours: '20h', location: LOC_ASGU,     comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2021-04-29', kind: 'leasure', hours: '20h', location: LOC_MARZY,    comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2021-05-17', kind: 'leasure', hours: '20h', location: LOC_VDN,      comments: 'Simples hommes, doubles dames<br />' + TXT_LEASURE, warning: 'Pas de séance' },
  { date: '2021-06-03', kind: 'leasure', hours: '20h', location: LOC_ASGU,     comments: 'Tirage au sort des doubles<br />' + TXT_LEASURE },

  // Competition
  { date: '2020-11-22', kind: 'competition', hours: '9h-18h', location: LOC_ASGU, comments: 'Tournoi en double sur la journée.<br />Repas ensemble le midi.' },
  { date: '2021-03-07', kind: 'competition', hours: '9h-18h', location: LOC_VDN,  comments: 'Tournoi en double sur la journée.<br />Repas ensemble le midi.' },

  // Team
  { date: '2020-12-07', kind: 'team', hours: '20h', location: LOC_VDN,      comments: 'Doubles mixtes<br />' + TXT_TEAM + '<br /><br />Espace réduit pour la séance normale.' },
  { date: '2021-01-19', kind: 'team', hours: '20h', location: LOC_CHARIBAD, comments: 'Doubles hommes, doubles dames<br />' + TXT_TEAM },
  { date: '2021-02-25', kind: 'team', hours: '20h', location: LOC_ASGU,     comments: 'Doubles mixtes<br />' + TXT_TEAM },
  { date: '2021-04-05', kind: 'team', hours: '20h', location: LOC_VDN,      comments: 'Doubles hommes, doubles dames<br />' + TXT_TEAM + '<br /><br />Espace réduit pour la séance normale.' },
  { date: '2021-05-06', kind: 'team', hours: '20h', location: LOC_ASGU,     comments: 'Simples hommes, simples dames<br />' + TXT_TEAM },

  // Other
  { date: '2020-09-05', kind: 'friendly', tag: 'Samedi Sports', hours: '10h-18h', location: 'Parc Salengro', comments: 'Le club tiendra un stand toute la journée. Volontaires recherchés !' },
];


// ---------------------------
// Compute all relevant dates
// ---------------------------

var allDates = [];

// Create an empty calendar
var cursor = CALENDAR_START.clone();
while (cursor.isSameOrBefore(CALENDAR_END)) {
  var date = cursor.clone();
  allDates.push({
    date: date,
    kind: 'empty'
  });
  cursor.add(1, 'day');
}

// Training dates
var cursor = REGULAR_TRAINING_START.clone();
while (cursor.isSameOrBefore(REGULAR_TRAINING_END)) {
  var date = cursor.clone();
  if (REGULAR_TRAINING_DAYS.indexOf(date.day()) !== -1) {
    var existingEvent = findDateItem(date);
    existingEvent.kind     = 'training';
    existingEvent.location = REGULAR_TRAINING_LOCATIONS[date.day()];
    existingEvent.hours    = REGULAR_TRAINING_HOURS[date.day()];
  }
  cursor.add(1, 'day');
}

// Apply patches on trainings
for (var i = 0; i < TRAINING_PATCHES.length; i++) {
  var patch  = TRAINING_PATCHES[i];
  var origin = findDateItem(patch.date);
  patchItem(origin, patch);
}

// Add special events
for (var i = 0; i < ADDITIONAL_EVENTS.length; i++) {
  let additionalEvent = ADDITIONAL_EVENTS[i];
  additionalEvent.date = moment(additionalEvent.date);

  var existingEvent = findDateItem(additionalEvent.date);
  if (!!existingEvent && (existingEvent.kind == 'empty' || existingEvent.location === additionalEvent.location)) {
    patchItem(existingEvent, additionalEvent);
  }
  else {
    allDates.push(additionalEvent);
  }
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

function patchItem(origin, patch) {
  origin.kind        = patch.kind     || origin.kind;
  origin.location    = patch.location || origin.location;
  origin.hours       = patch.hours    || origin.hours;
  origin.comments    = patch.comments || origin.comments;
  origin.warning     = patch.warning  || origin.warning;
  origin.tag         = patch.tag      || origin.tag;
  origin.newLocation = patch.newLocation;
}


// -----
// Draw
// -----

setTimeout(drawCalendar, 50);

function drawCalendar() {
  var $calendarArea = $('#calendarArea');

  var $dateMenu = $('<div class="ui one column stackable center aligned grid" style="margin: 10px;"><div class="ui buttons"></div></div>').appendTo(calendarArea);
  var $prevDateBtn = $('<div class="ui icon tiny button"><i class="icon chevron left"></i></div>').appendTo($dateMenu);
  var $dateDisplay = $('<div class="ui basic tiny button"></div>').appendTo($dateMenu);
  var $nextDateBtn = $('<div class="ui icon tiny button"><i class="icon right chevron"></i></div>').appendTo($dateMenu);

  var $monthContent = $('<div class="ui segment">').appendTo($calendarArea);

  var currentMonth = moment().startOf('month');
  drawMonth(currentMonth, $dateDisplay, $monthContent);

  $prevDateBtn.on('click', function() {
    moveMonth(-1);
  });
  $nextDateBtn.on('click', function() {
    moveMonth(1);
  });

  function moveMonth(diff) {
    currentMonth.add(diff, 'month');
    drawMonth(currentMonth, $dateDisplay, $monthContent);
  }
}

function drawMonth(currentMonth, $dateDisplay, $monthContent) {
  $dateDisplay.text(upperFirst(currentMonth.format('MMMM YYYY')));
  $monthContent.empty();

  var monthEvents = allDatesByMonth[currentMonth.format('YYYY-MM')];
  if (!monthEvents) {
    $('<div>En dehors de la saison tu te trouves.</div>').appendTo($monthContent);
    return;
  }

  var $eventTable = $('<table class="ui table">').appendTo($monthContent);
  for (var i = 0; i < monthEvents.length; i++) {
    addEvent($eventTable, monthEvents[i]);
  }
}

function addEvent($eventTable, monthEvent) {
  var date        = upperFirst(monthEvent.date.format('ddd D'));
  var hours       = monthEvent.hours;
  var location    = monthEvent.location;
  var newLocation = monthEvent.newLocation;
  var color       = KIND_COLORS[monthEvent.kind];
  var tag         = monthEvent.tag || KIND_TAGS[monthEvent.kind];
  var comments    = monthEvent.comments || '';
  var warning     = monthEvent.warning;

  if (monthEvent.kind === 'deleted') {
    return;
  }

  if (monthEvent.kind === 'move' || monthEvent.kind === 'canceled' || monthEvent.kind === 'holidays') {
    location = null;
  }

  var $tr = $('<tr>').appendTo($eventTable);

  // Date
  var $dateTd  = $('<td class="collapsing"></td>').appendTo($tr);
  $('<b>' + date + '</b>').appendTo($dateTd);

  // Hours
  var $hoursTd  = $('<td class="collapsing"></td>').appendTo($tr);
  if (!!hours) {
    $('<span><i>' + hours + '</i></span>').appendTo($hoursTd);
  }

  // Tag
  var $tagTd = $('<td class="collapsing"></td>').appendTo($tr);
  if (!!tag) {
    $('<span class="ui ' + color + ' label">' + tag + '</span>').appendTo($tagTd);
  }

  // Location
  var $locationTd  = $('<td></td>').appendTo($tr);
  if (!!location) {
    $('<span>' + location + '</span>').appendTo($locationTd);
  }
  if (!!newLocation) {
    $('<i class="ui blue icon right arrow"></i>').appendTo($locationTd);
    $('<span>' + newLocation + '</span>').appendTo($locationTd);
  }

  // Comments
  var $commentsTd = $('<td>' + comments + '</td>').appendTo($tr);

  if (!!warning) {
    if (!!comments) {
      $('<br />').appendTo($commentsTd);
    }
    $('<i class="ui red icon warning sign"></i>').appendTo($commentsTd);
    $('<span style="color: red;">' + warning + '</span>').appendTo($commentsTd);
  }

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