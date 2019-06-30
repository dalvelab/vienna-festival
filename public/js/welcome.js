function getTimeRemaining(endtime) {
  let newTime, dateParts, timePart;
  let currentTime = new Date().toString();
  function convertPlain() {
    dateParts = currentTime.substring(4, 15).split(' ');
    timePart = currentTime.substring(16);
    newTime = dateParts[1] + ' ' + dateParts[0] + ' ' + dateParts[2] + ' ' + timePart;
    newTime.toString();
    return newTime, dateParts, timePart;
  }
  convertPlain(); 
  var t = Date.parse(endtime) - Date.parse(newTime); 
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));

  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime) {
  let clock = document.getElementById(id);
  let daysSpan = clock.querySelector('.days');
  let hoursSpan = clock.querySelector('.hours');
  let minutesSpan = clock.querySelector('.minutes');
  let secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    let t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2); 

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  let timeinterval = setInterval(updateClock, 1000);
}

let deadline = document.querySelector('.welcome-counter').getAttribute('time');

initializeClock('clockdiv', deadline);