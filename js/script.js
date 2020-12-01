/* Задания на урок:

1) Удалить все рекламные блоки со страницы (правая часть сайта)

2) Изменить жанр фильма, поменять "комедия" на "драма"

3) Изменить задний фон постера с фильмом на изображение "bg.jpg". Оно лежит в папке img.
Реализовать только при помощи JS

4) Список фильмов на странице сформировать на основании данных из этого JS файла.
Отсортировать их по алфавиту 

5) Добавить нумерацию выведенных фильмов */

'use strict';

const movieDB = {
    movies: [
        "Логан",
        "Лига справедливости",
        "Ла-ла лэнд",
        "Одержимость",
        "Скотт Пилигрим против..."
    ]
};


const reklam = document.querySelectorAll('.promo__adv img');
reklam.forEach(el => el.remove());

const genre = document.querySelector('.promo__genre');
genre.textContent = 'ДРАМА';

const background = document.querySelector('.promo__bg');
background.style.backgroundImage = "url(img/bg.jpg)";

const watchedFilms = document.querySelector('.promo__interactive-list');
movieDB.movies.sort();
watchedFilms.innerHTML = '';
movieDB.movies.forEach( (el, idx) => {
    watchedFilms.innerHTML += `
    <li class="promo__interactive-item"> #${idx+1} ${el}
        <div class="delete"></div>
            </li> 
    `;
});
