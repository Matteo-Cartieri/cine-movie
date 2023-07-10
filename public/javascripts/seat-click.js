'use strict';

var seatClick = function () {
  var seats = document.querySelectorAll('.seat');
  var button = document.getElementById('buy-ticket');
  var ticketMessage = document.getElementById('ticket-message');

  ticketMessage.innerText = 'Selezionare solo 1 posto';

  //attribuisce la classe .selected ai sedili selezionati, e inizializza un messaggio di errore 
  //se sono stati selezioni più di un sedile o nessuno
  seats.forEach(function (seat) {
    seat.addEventListener('click', function () {
      var id = seat.getAttribute('id');
      var seatElement = document.getElementById(id);
      seatElement.classList.toggle('selected');
      ticketMessage.innerText = 'Hai selezionato il posto ' + id + '.\n Vuoi confermare l\'acquisto?';

      var selectedSeats = document.querySelectorAll('.selected');
      if (selectedSeats.length !== 2) {
        ticketMessage.innerText = 'Selezionare solo 1 posto';
      }
    });
  });

  button.addEventListener('click', function () {
    var selectedSeats = document.querySelectorAll('.selected');
    var seatId = selectedSeats[0].getAttribute('id');
    var idFilm = button.getAttribute('value');

    var errorMsg = document.createElement('span');
    errorMsg.className = 'error-msg';
    errorMsg.innerText = 'ERRORE: ';
    var msg = document.createElement('div');

    //se è stato selezionato solo un sedile, viene effettuata la fetch alla funzione che salva
    //il biglietto sul database, altrimenti visualizza il modal con un messaggio di errore
    if (selectedSeats.length === 2) {
      fetch(idFilm + '/' + seatId + '/' + 1, { method: 'POST' })
        .then((response) => {
          if (response.ok) {
            window.location = '/user';
          } else if (response.status === 400) {
            response.json().then((data) => {
              msg.innerText = data.message;
              ticketMessage.innerText = '';
              ticketMessage.appendChild(errorMsg);
              ticketMessage.appendChild(msg);
            }).catch((error) => {
              ticketMessage.innerText = 'Errore: ' + error;
            });
            var ticketModal = new bootstrap.Modal(document.getElementById('ticketModal'));
              ticketModal.show();
          } else {
            ticketMessage.innerText = 'Errore';
            var ticketModal = new bootstrap.Modal(document.getElementById('ticketModal'));
            ticketModal.show();
          }
        })
        .catch((error) => {
          ticketMessage.innerText = 'Errore: ' + error;
          var ticketModal = new bootstrap.Modal(document.getElementById('ticketModal'));
          ticketModal.show();
        });
    } else {
      fetch(idFilm + '/' + seatId + '/' + 0, { method: 'POST' })
        .then((response) => {
          if (response.status === 400) {
            response.json().then((data) => {
              msg.innerText = data.message;
              ticketMessage.innerText = '';
              ticketMessage.appendChild(errorMsg);
              ticketMessage.appendChild(msg);
            }).catch((error) => {
              ticketMessage.innerText = 'Errore: ' + error;
            });            
          } else {
            ticketMessage.innerText = 'Errore';
          }
          var ticketModal = new bootstrap.Modal(document.getElementById('ticketModal'));
              ticketModal.show();
        })
        .catch((error) => {
          ticketMessage.innerText = 'Errore: ' + error;
          var ticketModal = new bootstrap.Modal(document.getElementById('ticketModal'));
          ticketModal.show();
        });

    }
  });
}

seatClick();