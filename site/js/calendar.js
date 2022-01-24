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
var LOC_ISAT     = 'Nevers - Maison des Sports (ISAT)';
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
  4: '20h30-22h30',
  5: '19h30-22h30'
};
var CALENDAR_START = moment('2021-09-06');
var CALENDAR_END = moment('2022-07-01');
var REGULAR_TRAINING_START = moment('2021-09-06');
var REGULAR_TRAINING_END   = moment('2022-07-01');
var REGULAR_TRAINING_DAYS  = [1, 4, 5]; // Monday, Thursday, Friday

var TXT_LEASURE = 'Tournoi amical avec les joueurs des clubs locaux.<br />'
                + 'Priorité aux débutants.';
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

/** Patches on training events */
var TRAINING_PATCHES = [
  // Moved trainings
  { date: '2021-11-01', kind: 'move', hours: '20h-22h30',   warning: 'Maison des Sports fermée (jour férié)',    newLocation: LOC_VDN2 },
  { date: '2021-12-06', kind: 'move', hours: '19h30-22h30', warning: 'Maison des Sports réservée par la mairie', newLocation: LOC_VDN2 },
  { date: '2022-01-24', kind: 'move', hours: '19h30-22h30', warning: 'Maison des Sports réservée par la mairie', newLocation: LOC_VDN2 },
  { date: '2022-01-31', kind: 'move', hours: '19h30-22h30', warning: 'Maison des Sports réservée par la mairie', newLocation: LOC_VDN2 },

  // Christmas holidays
  { date: '2021-12-20', kind: 'move', hours: '19h30-22h30', warning: 'Maison des Sports fermée pour les vacances', newLocation: LOC_VDN2 },
  { date: '2021-12-27', kind: 'move', hours: '19h30-22h30', warning: 'Maison des Sports fermée pour les vacances', newLocation: LOC_VDN2 },
  { date: '2021-12-23', kind: 'canceled', warning: 'Vacances' },
  { date: '2021-12-24', kind: 'canceled', warning: 'Vacances' },
  { date: '2021-12-30', kind: 'canceled', warning: 'Vacances' },
  { date: '2021-12-31', kind: 'canceled', warning: 'Vacances' },

  // Internal events
  { date: '2021-09-06', kind: 'friendly', tag: 'Rentrée',           comments: 'De retour pour une nouvelle année !' },
  { date: '2021-11-15', kind: 'internal',                           comments: 'Constituez les doubles de votre choix (hommes, dames, mixtes) et affrontez les autres au cours d\'un tournoi amical.' },
  { date: '2021-12-13', kind: 'friendly', tag: 'Soirée de Noël',    comments: 'Entraînement et quelques surprises !' },
  { date: '2021-12-16',                                             comments: 'Double soirée, voir ci-dessus' },
  { date: '2022-01-10', kind: 'friendly', tag: 'Soirée Handisport', comments: '<i>Date à confirmer</i>' },
  { date: '2022-01-13',                                             comments: 'Double soirée, voir ci-dessus' },
  { date: '2022-02-07', kind: 'friendly', tag: 'Soirée crêpes',     comments: 'Entraînement et... crêpes. ' },
  { date: '2022-02-28', kind: 'friendly', tag: 'Carnaval',          comments: 'Entraînement en tenue adaptée' },
  { date: '2022-03-03',                                             comments: 'Double soirée, voir ci-dessus' },
  { date: '2022-03-14', kind: 'internal',                           comments: 'Tournoi en simple par groupes de niveau' },
  { date: '2022-03-17',                                             comments: 'Double soirée, voir ci-dessus' },
  { date: '2022-04-25', kind: 'internal',                           comments: 'Constituez les doubles de votre choix (hommes, dames, mixtes) et affrontez les autres au cours d\'un tournoi amical.' },
  { date: '2022-06-16',                                             comments: 'Double soirée, voir ci-dessus' },

  // Leasures
  { date: '2022-03-28', kind: 'leasure', comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2022-05-09', kind: 'leasure', comments: 'Doubles hommes et dames<br />' + TXT_LEASURE },

  // Team
  //{ date: '2021-11-29', kind: 'team', comments: 'Doubles hommes et dames.<br />Séance délocalisée.' },
  //{ date: '2022-01-24', kind: 'team', comments: 'Doubles mixtes.<br />Espace réduit pour la séance normale.' }
];

/** Events added to the calendar */
var ADDITIONAL_EVENTS = [

  // Leasures
  { date: '2021-11-18', kind: 'leasure', hours: '20h', location: LOC_ASGU,  comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2021-12-08', kind: 'leasure', hours: '20h', location: LOC_ISAT,  comments: 'Doubles hommes et dames<br />' + TXT_LEASURE },
  { date: '2022-01-13', kind: 'leasure', hours: '20h', location: LOC_MARZY, warning:  'Annulé (COVID)',  },
  { date: '2022-03-03', kind: 'leasure', hours: '20h', location: LOC_MARZY, comments: 'Doubles mixtes<br />' + TXT_LEASURE },
  { date: '2022-03-17', kind: 'leasure', hours: '20h', location: LOC_ASGU,  comments: 'Doubles hommes et dames<br />' + TXT_LEASURE },
  { date: '2022-06-16', kind: 'leasure', hours: '20h', location: LOC_ASGU,  comments: 'Doubles tirés au sort<br />' + TXT_LEASURE },
  { date: '2021-12-16', kind: 'leasure', hours: '20h', location: LOC_ASGU,  comments: 'Doubles mixtes<br />' + TXT_LEASURE },

  // Internal
  { date: '2022-06-26', kind: 'friendly', tag: 'Repas de fin d\'année', comments: 'Lieu et horaire à confirmer' },

  // Team
  //{ date: '2022-02-02', kind: 'team', hours: '20h', location: LOC_ISAT, comments: 'Doubles hommes et dames' },
  //{ date: '2022-04-06', kind: 'team', hours: '20h', location: LOC_ISAT, comments: 'Doubles mixtes' },
  //{ date: '2022-05-18', kind: 'team', hours: '20h', location: LOC_ISAT, comments: 'Doubles hommes et dames' },

  // Competitions
  { date: '2021-11-28', kind: 'competition', hours: '9h-18h', location: LOC_ASGU, tag: 'Tournoi Guérigny', comments: 'Double mixte et double homme<br />Participation de 5€ (le paiement se fera sur place)<br /> Le repas du midi est offert par le club.' },
  { date: '2022-05-22', kind: 'competition',                  location: LOC_VDN,  tag: 'Tournoi du club',  comments: 'Format à préciser<br />En général, participation de 4€, démarrage à 9h, tournoi en doubles hommes et doubles mixtes' },

  // Moved trainings when there also are events in main location
  { date: '2021-11-29', kind: 'move', hours: '20h-22h30', warning: 'Maison des Sports réservée pour la compétition', newLocation: LOC_VDN2 },
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
  var $locationTd  = $('<td class="collapsing"></td>').appendTo($tr);
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