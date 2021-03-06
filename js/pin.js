'use strict';

window.pin = (function () {
  var X_SHIFT = 570;
  var Y_SHIFT = 350;
  var MAIN_PIN_SIZE = 62;
  var MAIN_PIN_X = X_SHIFT + MAIN_PIN_SIZE / 2;
  var MAIN_PIN_Y = Y_SHIFT + MAIN_PIN_SIZE / 2;
  var MAIN_PIN_POINTER_Y = 22;
  var TICKETS_LIMIT = 5;
  var tickets = [];

  var currentOfferLocation = {
    x: MAIN_PIN_X,
    y: MAIN_PIN_Y
  };

  var map = document.querySelector('.map');

  var houseType = document.querySelector('#housing-type');
  var housePrice = document.querySelector('#housing-price');
  var houseRooms = document.querySelector('#housing-rooms');
  var houseGuests = document.querySelector('#housing-guests');
  var featuresFieldset = document.querySelector('#housing-features');


  function onError() {

  }

  function onSuccess(data) {
    tickets = data.
    filter(function (it) {
      return it.offer !== undefined;
    });

    var limitedTickets = [];
    for (var i = 0; i < tickets.length && i < TICKETS_LIMIT; i++) {
      limitedTickets.push(data[i]);
    }

    window.map.renderPins(limitedTickets);
  }

  function filterByHouseType(ticket) {
    var housingType = houseType.value;
    return (housingType === 'any') || (housingType === ticket.offer.type);
  }

  function filterByHousePrice(ticket) {
    var housingPrice = housePrice.value;
    if (housingPrice === 'any') {
      return true;
    }
    if (housingPrice === 'middle' && ticket.offer.price >= 10000 && ticket.offer.price < 50000) {
      return true;
    }
    if (housingPrice === 'low' && ticket.offer.price < 10000) {
      return true;
    }
    if (housingPrice === 'high' && ticket.offer.price >= 50000) {
      return true;
    }
    return false;
  }

  function filterByRoomNumber(ticket) {
    if (houseRooms.value !== 'any') {
      var housingRooms = parseInt(houseRooms.value, 10);
    } else {
      return true;
    }

    return (housingRooms === 'any') || (housingRooms === ticket.offer.rooms);
  }

  function filterByGuestNumber(ticket) {
    if (houseGuests.value !== 'any') {
      var housingGuests = parseInt(houseGuests.value, 10);
    } else {
      return true;
    }
    return (housingGuests === 'any') || (housingGuests === ticket.offer.guests);
  }


  function filterByFeatures(ticket) {
    var houseFeatures = featuresFieldset.querySelectorAll('input[type=checkbox]');
    var checkedHouseFeatures = [];
    houseFeatures.forEach(function (houseFeature) {
      if (houseFeature.checked) {
        checkedHouseFeatures.push(houseFeature.value);
      }
    });

    for (var i = 0; i < checkedHouseFeatures.length; i++) {
      var checkedHouseFeature = checkedHouseFeatures[i];
      if (!ticket.offer.features.includes(checkedHouseFeature)) {
        return false;
      }
    }
    return true;
  }

  function filterTickets(ticketsToFilter) {
    var filteredTickets = [];
    for (var i = 0; i < ticketsToFilter.length && filteredTickets.length < TICKETS_LIMIT; i++) {
      var offer = ticketsToFilter[i];
      if (filterByHouseType(offer) && filterByHousePrice(offer) && filterByRoomNumber(offer) && filterByGuestNumber(offer) && filterByFeatures(offer)) {
        filteredTickets.push(offer);
      }
    }
    return filteredTickets;
  }


  function onFilterChange() {
    var filteredTickets = filterTickets(tickets);
    window.map.removePins();
    window.card.removeCard();
    window.map.renderPins(filteredTickets);
  }


  function activateMap(evt) {
    if (evt.button !== 0) {
      return;
    }
    evt.preventDefault();

    window.request.get(onSuccess, onError);

    window.map.enableMapFilters();
    window.form.enableAdForm();

    window.form.onRoomsAndGuestsChange(evt);
    window.form.onPriceAndTypesChange(evt);
    currentOfferLocation.y += MAIN_PIN_SIZE / 2 + MAIN_PIN_POINTER_Y;
    window.form.updateCurrentOfferLocation(currentOfferLocation);

    window.pin.map.classList.remove('map--faded');
    window.form.form.classList.remove('ad-form--disabled');
  }

  return {
    MAIN_PIN_SIZE: MAIN_PIN_SIZE,
    MAIN_PIN_POINTER_Y: MAIN_PIN_POINTER_Y,
    map: map,
    currentOfferLocation: currentOfferLocation,
    activateMap: activateMap,
    onFilterChange: onFilterChange
  };
})();

