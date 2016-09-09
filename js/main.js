var _endpoint = 'https://app.asana.com/api/1.0/projects'
var _api_key    = '0/21babde74944ce2245756d19855c991d';

/*
Members
*/

var projects = []

document.addEventListener('click', rotateScreen)

/*
DOM Stuff
*/

function rotateScreen() {
  var main = document.querySelector('.layout')
  main.classList.toggle('layout--rotated')
}

/*
Call Asana
*/

function getProjects(callback) {
  var asyncCalls = []
  var res = Promise.resolve( getdata(_endpoint).done(function(response) { var items = response.data; }))

  return new Promise(function() {
    res
    .then(function(response) {
      response.data.forEach(function(item) {
        asyncCalls.push(getdata(_endpoint+'/'+item.id))
      })
    })
    .then(function() {
      Promise.all(asyncCalls)
      .then(function(res) {
        callback(res)
      })
    })
  })
}

/*
Data functions
*/

function getdata(url) {
  return (
    $.ajax({
      type: 'GET',
      url: url,
      contentType: 'application/json',
      dataType: 'json',
      beforeSend : function(xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(_api_key + ":"));
      }
    })
  )
}

function getDueDate(d) {
  var timeTilDue = 1 / ( ( moment(d.due_date) - moment() ) * ( 1 / (10 ^ 100000000) ) ) * 1000 * 2
  if ( timeTilDue && timeTilDue > 0 ) {

    /* set some max and min values */
    var max = 750,
        min = 50;
        if ( timeTilDue < min) console.log('less than min',d.name);
        if ( timeTilDue > max) console.log('bigger than max',d.name);
    return timeTilDue < min ? timeTilDue * 2 : timeTilDue * 0.75
    // return timeTilDue < 100 ?
  } else {
    return 0
  }
}

/*
Populate DOM with data
*/

function populateData(data) {
  var defaultContact = 'Harry',
      defaultMessage = '"' + defaultContact + '. come on mate."',
      defaultTitle   = '' + defaultContact + ' of the Aznavoor, First of his name',
      defaultBgImages = ['http://www.stevensegallery.com/600/300', 'http://www.placecage.com/gif/600/300']

  data.forEach(function(datum, i, arr) {

    var $item = $('.box').eq(i);
    var daysUntilDue = { daysTilDue: moment(datum.due_date).diff(moment(), 'days') },
        client       = { client: client || defaultMessage },
        contact      = { contact: contact || defaultContact },
        contactTitle = { contactTitle: contactTitle || defaultTitle },
        bgImage      = { bgImage: bgImage || defaultBgImages[Math.floor(Math.random()*2)] }

    datum.notes.split('\n').forEach(function(item, i, arr) {
      if (item.indexOf('client') > -1)
        client.client = item.split('client:')[1].replace(/,/,'')
        Object.assign(datum, client);

      if (item.indexOf('contact') > -1)
        contact.contact = item.split('contact:')[1].replace(/,/,'')
        Object.assign(datum, contact);

      if (item.indexOf('title') > -1)
        contactTitle.contactTitle = item.split('title:')[1].replace(/,/,'')
        Object.assign(datum, contactTitle);

      if (item.indexOf('background') > -1)
        bgImage.bgImage = item.split('background:')[1].replace(/,/,'')
        Object.assign(datum, bgImage);
    })

    // Assign to original object
    Object.assign(datum, daysUntilDue)

    // populate data fields
    $item.find('[data-job-name]').html(datum.name)
    $item.find('[data-job-countdown]').html(datum.daysTilDue)
    $item.find('[data-job-contact-name]').html(datum.contact)
    $item.find('[data-job-contact-department]').html(datum.contactTitle)
    console.log($item.find('.box__image img'))
    $item.find('.box__image img').attr('src',datum.bgImage)

    // show element
    $item.fadeIn();
  })
}

function init() {
  $('.box').hide()
}

/* Function calls */

// initialise DOM elements and anything else
init();

// make API call and transform data, populate it in the DOM
getProjects(function(data) {
  var projects = data
  .map(function(item) {
    return item.data
  })
  .filter(function(item) {
    if ( getDueDate(item) > 0 ) return item ;
  })
  .map(function(item) {
    if ( item.name.indexOf('_') > 0 ) {
      /* Just got rid of the job number with splice: */
      item.name = item.name.split('_').splice(1,item.name.length).join(' ')
    }
    return item
  })
  .sort(function(a, b) {
    return getDueDate(a) < getDueDate(b)
  })
  populateData(projects)
});
