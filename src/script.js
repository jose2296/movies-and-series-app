import fs from 'fs';

const series = [
    {
        'checked': false,
        'title': 'Breaking bad'
    },
    {
        'checked': false,
        'title': 'The following'
    },
    {
        'checked': false,
        'title': 'Dexter'
    },
    {
        'checked': false,
        'title': 'Prison break'
    },
    {
        'checked': false,
        'title': 'Perdidos'
    },
    {
        'checked': false,
        'title': 'Homeland'
    },
    {
        'checked': false,
        'title': 'The punisher'
    },
    {
        'checked': false,
        'title': 'The blacklist'
    },
    {
        'checked': true,
        'title': 'Vikings'
    },
    {
        'checked': true,
        'title': 'Merlí'
    },
    {
        'checked': false,
        'title': 'Rick and Morty'
    },
    {
        'checked': false,
        'title': 'Sex education'
    },
    {
        'checked': false,
        'title': 'Trailer Park Boys'
    },
    {
        'checked': false,
        'title': 'Santa clarita diet'
    },
    {
        'checked': false,
        'title': 'You'
    },
    {
        'checked': true,
        'title': 'Peaky blinders'
    },
    {
        'checked': false,
        'title': 'The wire'
    },
    {
        'checked': false,
        'title': 'The Photographer of Mauthausen'
    },
    {
        'checked': false,
        'title': 'The witcher'
    },
    {
        'checked': false,
        'title': 'Titans'
    },
    {
        'checked': false,
        'title': 'Suits'
    },
    {
        'checked': false,
        'title': 'Shameless'
    }
];

const movies = [
    {
        'checked': false,
        'title': 'Trainspotting'
    },
    {
        'checked': true,
        'title': 'The Prestige'
    },
    {
        'checked': false,
        'title': 'Rounders'
    },
    {
        'checked': true,
        'title': 'The italian job'
    },
    {
        'checked': true,
        'title': 'V for Vendetta'
    },
    {
        'checked': false,
        'title': 'Victory'
    },
    {
        'checked': false,
        'title': 'American history x'
    },
    {
        'checked': false,
        'title': 'Project x'
    },
    {
        'checked': false,
        'title': 'Mystic River'
    },
    {
        'checked': true,
        'title': 'Spirited Away'
    },
    {
        'checked': false,
        'title': 'Léon: The Professional'
    },
    {
        'checked': false,
        'title': 'Little Miss Sunshine'
    },
    {
        'checked': false,
        'title': 'Haine 924'
    },
    {
        'checked': false,
        'title': 'The Truman Show'
    },
    {
        'checked': false,
        'title': 'American psycho'
    },
    {
        'checked': false,
        'title': 'Three Billboards Outside Ebbing, '
    },
    {
        'checked': false,
        'title': 'City of God'
    },
    {
        'checked': false,
        'title': 'Wild Tales'
    },
    {
        'checked': false,
        'title': 'Her'
    },
    {
        'checked': false,
        'title': 'Little White Lies'
    },
    {
        'checked': false,
        'title': 'I origins'
    },
    {
        'checked': false,
        'title': 'Eternal Sunshine of the Spotless Mind'
    },
    {
        'checked': true,
        'title': 'Origen'
    },
    {
        'checked': false,
        'title': 'Shutter Island'
    },
    {
        'checked': true,
        'title': 'El club de la lucha'
    },
    {
        'checked': true,
        'title': 'The Boy in the Striped Pajamas'
    },
    {
        'checked': true,
        'title': 'Life Is Beautiful'
    },
    {
        'checked': false,
        'title': 'True detective'
    },
    {
        'checked': false,
        'title': 'Life of Pi'
    },
    {
        'checked': false,
        'title': 'Paprika'
    },
    {
        'checked': false,
        'title': 'Los cronocrimenes'
    },
    {
        'checked': false,
        'title': 'Donnie Darko'
    },
    {
        'checked': false,
        'title': '12 Monkeys'
    },
    {
        'checked': false,
        'title': 'Being John Malkovich'
    },
    {
        'checked': false,
        'title': 'A Few Good Men'
    },
    {
        'checked': false,
        'title': 'Scarface'
    },
    {
        'checked': false,
        'title': 'El gran truco'
    },
    {
        'checked': true,
        'title': 'Red Sparrow'
    },
    {
        'checked': false,
        'title': 'Snatch'
    },
    {
        'checked': false,
        'title': 'Infiltrados'
    },
    {
        'checked': false,
        'title': 'The Bourne Identity'
    },
    {
        'checked': false,
        'title': 'Minority report'
    },
    {
        'checked': false,
        'title': 'Million Dollar Baby'
    },
    {
        'checked': false,
        'title': 'Milk'
    },
    {
        'checked': false,
        'title': 'The Theory of Everything'
    },
    {
        'checked': false,
        'title': 'There will be blood'
    },
    {
        'checked': false,
        'title': 'Dallas buyers club'
    },
    {
        'checked': false,
        'title': 'Darkest hour'
    },
    {
        'checked': true,
        'title': 'Cadena perpetua'
    },
    {
        'checked': false,
        'title': 'Memento'
    },
    {
        'checked': false,
        'title': 'Glass'
    },
    {
        'checked': false,
        'title': 'Big fish'
    },
    {
        'checked': false,
        'title': 'Schindler\'s List'
    },
    {
        'checked': false,
        'title': 'Slumdog Millionaire'
    },
    {
        'checked': false,
        'title': 'En tierra hostil'
    },
    {
        'checked': false,
        'title': 'Mad max fury road'
    },
    {
        'checked': false,
        'title': 'Full monty'
    },
    {
        'checked': false,
        'title': 'Tok tok'
    },
    {
        'checked': false,
        'title': 'The Bone Collector'
    },
    {
        'checked': false,
        'title': 'The Hateful Eight'
    },
    {
        'checked': false,
        'title': 'The Machinist'
    },
    {
        'checked': false,
        'title': 'Enemy'
    },
    {
        'checked': true,
        'title': 'Joker'
    },
    {
        'checked': true,
        'title': 'Now You See Me'
    },
    {
        'checked': false,
        'title': 'Oppenheimer'
    },
    {
        'checked': true,
        'title': 'Uncharted'
    }
];


const seriesJson = {};
const moviesJson = {};



const aaa = async () => {
    movies.forEach(async serie => {
        console.log(serie.title);

        const response = await fetch(`http://www.omdbapi.com/?apikey=dca9b955&t=${serie.title}`);
        const { imdbID, Poster, Title, Type, Released } = await response.json();
        if (imdbID) {
            console.log(imdbID, serie.title);
            seriesJson[imdbID] = {
                imdbID,
                poster: Poster,
                title: Title,
                type: Type,
                released: Released,
                checked: serie.checked
            };
        } else {
            console.log('no exits', serie.title);
        }
    });
};


aaa().then((a) => {
    setTimeout(() => {
        console.log('writing file...' ,a);
        fs.writeFile('movies.json', JSON.stringify(seriesJson), 'utf8', (response) => {
            console.log(response);
        });
    }, 2000);
});
