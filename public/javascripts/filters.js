'use strict';

var filter = document.querySelector('#filter');
filter.addEventListener('click', function () {
    const dateFilter = document.querySelector('#date-filter');
    var selectedDate = dateFilter.options[dateFilter.selectedIndex].text;
    const hourFilter = document.querySelector('#hour-filter');
    var selectedHour = hourFilter.options[hourFilter.selectedIndex].text;
    const genreFilter = document.querySelector('#genre-filter');
    var selectedGenre = genreFilter.options[genreFilter.selectedIndex].text;

    var filmCards = document.querySelectorAll('.film-card');

    var showed = 0;
    filmCards.forEach(function (filmCard) {
        const filmDate = filmCard.getAttribute('date');
        const filmHour = filmCard.getAttribute('hour');
        const filmGenre = filmCard.getAttribute('genre');

        //se il film corrisponde ai parametri selezionati dai filtri, viene visualizzato
        if ((selectedDate !== '' && filmDate !== selectedDate) ||
            (selectedHour !== '' && filmHour !== selectedHour) ||
            (selectedGenre !== '' && filmGenre !== selectedGenre)) {
            filmCard.style.display = 'none';
        } else {
            showed += 1;
            filmCard.style.display = 'block';
        }
    });

    //se nessun film è stato visualizzato, stampa un messaggio
    var noResults = document.querySelector('#no-results');
    if (showed === 0) {
        if (!noResults) {
            noResults = document.createElement('h4');
            noResults.className = 'white-text';
            noResults.id = 'no-results';
            noResults.textContent = 'Nessun risultato trovato';
            var main = document.querySelector('#film-list');
            main.appendChild(noResults);
        }
    } else {
        if (noResults)
            noResults.remove();
    }
});
