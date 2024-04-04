// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { child, getDatabase, onValue, ref, remove, set } from 'firebase/database';
import { useEffect, useState } from 'react';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDBINVo16FMd_AfWBg0EnaFRAc5mjzAE_g',
    authDomain: 'lists-fa5ab.firebaseapp.com',
    databaseURL:
    'https://lists-fa5ab-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'lists-fa5ab',
    storageBucket: 'lists-fa5ab.appspot.com',
    messagingSenderId: '262332809341',
    appId: '1:262332809341:web:562be1af757f31cebbf114',
};

// Initialize Firebase
initializeApp(firebaseConfig);

const dbRef = ref(getDatabase());

const APIKEY = 'aad5022409e17987784fbb6f1e0d6ccb';

type Item = {
    themoviedbId: number,
    title: string;
    checked: boolean;
    imdbID: string;
    poster: string;
    type: 'movies' | 'series';
    released: string;
}

export interface ThemoviedbItem {
    adult: boolean
    backdrop_path: string
    id: number
    title?: string
    name?: string
    original_language: string
    original_name: string
    overview: string
    poster_path: string
    media_type: string
    genre_ids: number[]
    popularity: number
    release_date?: string
    first_air_date?: string
    vote_average: number
    vote_count: number
    origin_country: string[]
  }


type Tab = 'movies' | 'series' | 'popular';

export interface OmdbapiItem {
    Title: string
    Year: string
    Rated: string
    Released: string
    Runtime: string
    Genre: string
    Director: string
    Writer: string
    Actors: string
    Plot: string
    Language: string
    Country: string
    Awards: string
    Poster: string
    Ratings: Rating[]
    Metascore: string
    imdbRating: string
    imdbVotes: string
    imdbID: string
    Type: string
    totalSeasons: string
    Response: string
}

export interface Rating {
    Source: string
    Value: string
}
const parseItemsFromApi = (data: ThemoviedbItem[]) => {
    const _items = data.map(item => ({
        themoviedbId: item.id,
        title: item.title || item.name,
        poster: item.poster_path ? `https://image.tmdb.org/t/p/original${item.poster_path}` : 'item-placeholder.png',
        released: item.release_date || item.first_air_date,
        type: item.media_type === 'tv' ? 'series' : (item.media_type === 'movie' ? 'movies' : ''),
        checked: false
    } as Item)).filter(item => !!item.type);

    return _items;
};

type ItemProps = Item & {
    addItemToList?: () => void
    toggleSeen?: () => void
    deleteFromList?: () => void
}

const Item = ({ title, poster, checked, released, type, addItemToList, toggleSeen, deleteFromList }: ItemProps) => (
    <div className='flex flex-col items-center gap-4 snap-center'>
        <header className='pl-4 flex items-center justify-between max-w-[300px] w-[300px]'>
            <p className='text-xl w-full text-center font-bold truncate'>{title}</p>
            <div className='dropdown dropdown-end'>
                <div tabIndex={0} role='button' className='pl-2'>
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='#ffffff' className='w-4 h-4'>
                        <path d='M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'/>
                    </svg>
                </div>
                <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
                    {!!addItemToList && <li><a onClick={addItemToList}>Añadir a la lista</a></li>}
                    {!!toggleSeen && <li><a onClick={toggleSeen}>Marcar como {checked ? 'no vista' : 'vista'}</a></li>}
                    {!!deleteFromList && <li><a onClick={deleteFromList}>Borrar de la lista</a></li>}
                </ul>
            </div>
        </header>
        <img className='w-[300px] h-[500px] max-w-[300px] max-h-[500px] rounded-box' src={poster} alt={title} />
        <div className={`flex ${type ? 'justify-between' : 'justify-center'}  w-full px-2`}>
            <p>{released}</p>
            {!!type &&
                <p>{type === 'series' ? 'Serie' : 'Película'}</p>
            }
        </div>
    </div>
);

const List = ({ items, addItemToList, toggleSeen, deleteFromList }: { items: Item[]; addItemToList?: (item: Item) => void; toggleSeen?: (item: Item) => void; deleteFromList?: (item: Item) => void }) => (
    !items.length ? <p className='text-center'>No hay elementos todavía.</p> :
        <div className='px-10 h-full flex gap-10 overflow-x-auto snap-x snap-mandatory pb-20'>
            {items.map((item, index) => (
                <Item
                    key={index}
                    {...item}
                    addItemToList={addItemToList ? () => addItemToList(item) : undefined}
                    toggleSeen={toggleSeen ? () => toggleSeen(item) : undefined}
                    deleteFromList={deleteFromList ? () => deleteFromList(item) : undefined}
                />
            ))}
        </div>
);

const App = () => {
    const [activeTab, setActiveTab] = useState<'movies' | 'series' | 'search' | 'popular'>('movies');
    const [allMovies, setAllMovies] = useState<{seen: Item[]; notSeen: Item[]}>({ seen: [], notSeen: [] });
    const [movies, setMovies] = useState<Item[]>([]);
    const [allSeries, setAllSeries] = useState<{seen: Item[]; notSeen: Item[]}>({ seen: [], notSeen: [] });
    const [series, setSeries] = useState<Item[]>([]);
    const [searchItems, setSearchItems] = useState<Item[]>([]);
    const [popularItems, setPopularItems] = useState<Item[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
    const [searching, setSearching] = useState(false);
    const [seenFilter, setSeenFilter] = useState(false);

    useEffect(() => {

        onValue(child(dbRef, 'movies'), (snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                const _movies = (Object.values(snapshot.val()) as Item[]).sort((a, b) => a.title < b.title ? -1 : 1);
                const allMovies = _movies.reduce((acc, item) => {
                    if (item.checked) {
                        return {
                            ...acc,
                            seen: [
                                ...acc.seen,
                                item
                            ],
                        };
                    }

                    return {
                        ...acc,
                        notSeen: [
                            ...acc.notSeen,
                            item
                        ]
                    };
                }, {
                    seen: [] as Item[],
                    notSeen: [] as Item[]
                });
                setAllMovies(allMovies);
            } else {
                setAllMovies({ notSeen: [], seen: [] });
                console.log('No data available');
            }
        });
        onValue(child(dbRef, 'series'), (snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                const _series = (Object.values(snapshot.val()) as Item[]).sort((a, b) => a.title < b.title ? -1 : 1);
                const allSeries = _series.reduce((acc, item) => {
                    if (item.checked) {
                        return {
                            ...acc,
                            seen: [
                                ...acc.seen,
                                item
                            ],
                        };
                    }

                    return {
                        ...acc,
                        notSeen: [
                            ...acc.notSeen,
                            item
                        ]
                    };
                }, {
                    seen: [] as Item[],
                    notSeen: [] as Item[]
                });
                setAllSeries(allSeries);
            } else {
                setAllSeries({ notSeen: [], seen: [] });
                console.log('No data available');
            }
        });

        getPopularItems();
    }, []);

    useEffect(() => {
        if (!searchValue) {
            setSearching(false);
            setSearchItems([]);
        } else {
            setSearching(true);
        }
        const delayInputTimeoutId = setTimeout(() => {
            setDebouncedSearchValue(searchValue);
        }, 600);

        return () => clearTimeout(delayInputTimeoutId);
    }, [searchValue]);

    useEffect(() => {
        searchItem(debouncedSearchValue);

    }, [debouncedSearchValue]);

    useEffect(() => {
        const _movies = seenFilter ? allMovies.seen : allMovies.notSeen;
        setMovies(_movies);

        const _series = seenFilter ? allSeries.seen : allSeries.notSeen;
        setSeries(_series);

    }, [seenFilter, allMovies, allSeries]);

    const getPopularItems = () => {

        const url = `https://api.themoviedb.org/3/trending/all/day?language=es-ES&api_key=${APIKEY}`;
        fetch(url).then(response => response.json()).then(data => {
            const _items = parseItemsFromApi(data.results);
            setPopularItems(_items);
        });
    };

    const searchItem = (search: string) => {
        if (!search) {
            return;
        }

        const url = `https://api.themoviedb.org/3/search/multi?api_key=${APIKEY}&query=${search}&language=es-ES`;
        fetch(url).then(response => response.json().then(data => {
            const _items = parseItemsFromApi(data.results);

            setSearchItems(_items);
            setSearching(false);
        }));
    };

    const handleClearSearch = () => {
        setSearchValue('');
        setSearching(false);
    };

    const toggleSeenFilter = () => {
        setSeenFilter(!seenFilter);
    };

    const addItemToList = (item: Item) => {
        const db = getDatabase();
        set(ref(db, `${item.type}/${item.themoviedbId}`), {
            themoviedbId: item.themoviedbId,
            title: item.title,
            poster: item.poster,
            released: item.released,
            checked: false
        });
    };

    const toggleSeen = (item: Item) => {
        const db = getDatabase();
        set(ref(db, `${activeTab}/${item.themoviedbId}/checked`), !item.checked);
    };

    const deleteFromList = (item: Item) => {
        console.log(item);
        const db = getDatabase();
        remove(ref(db, `${activeTab}/${item.themoviedbId}`));
    };

    const handleActiveTab = (tab: Tab) => {
        setActiveTab(tab);
        handleClearSearch();
    };

    return (
        <div className='p-4 md:p-14 flex flex-col justify-stretch gap-10 h-full'>
            <header className='flex w-full justify-between gap-5 items-center'>
                <label className='w-full h-[48px] min-h-[48px] input input-bordered flex items-center gap-2 focus-within:outline-none'>
                    <input type='text' className='grow' placeholder='Buscar' value={searchValue} onChange={({ target: { value } }) => setSearchValue(value)} />
                    {!searchValue &&
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor' className='w-6 h-6 opacity-70'><path fillRule='evenodd' d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z' clipRule='evenodd' /></svg>
                    }
                    {!!searchValue && !searching &&
                        <svg onClick={handleClearSearch} xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
                        </svg>
                    }
                    {!!searchValue && !!searching &&
                    // <div className='flex justify-center items-center flex-1'>
                            <span className='loading loading-spinner w-6 h-6'></span>
                        // </div>
                    }
                </label>

                {activeTab !== 'popular' &&
                    <label className='btn btn-circle swap max-h-[48px] h-[48px]'>
                        {/* this hidden checkbox controls the state */}
                        <input type='checkbox' onChange={toggleSeenFilter} checked={seenFilter} />

                        {/* OFF */}
                        <svg className='swap-on w-5 h-w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z' />
                            <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' />
                        </svg>

                        {/* ON */}
                        <svg className='swap-off w-5 h-w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88' />
                        </svg>

                    </label>
                }
            </header>

            <main>
                {!searchValue &&
                    <>
                        {['movies', 'series'].includes(activeTab) &&
                            <List items={activeTab === 'movies' ? movies : series} toggleSeen={toggleSeen} deleteFromList={deleteFromList} />
                        }

                        {activeTab === 'popular' &&
                            <List items={popularItems} addItemToList={addItemToList} />
                        }
                    </>
                }

                {!!searchValue && !searching &&
                    <>
                        {!!searchItems.length &&
                            <List items={searchItems} addItemToList={addItemToList} />
                        }
                        {!searchItems.length &&
                            <p className='text-center'>No hemos encontrado nada para "{searchValue}".</p>
                        }
                    </>
                }
            </main>
            <footer role='tablist' className='tabs tabs-bordered fixed bottom-0 left-0 bg-base-100 w-full py-2'>
                {/* <a role='tab' className={`tab text-xl ${activeTab === 'search' ? 'tab-active' : ''}`} onClick={() => setActiveTab('search')}>Search</a> */}
                {/* <a role='tab' className={`tab text-xl ${activeTab === 'movies' ? 'tab-active' : ''}`} onClick={() => setActiveTab('movies')}>Películas</a>
                <a role='tab' className={`tab text-xl ${activeTab === 'series' ? 'tab-active' : ''}`} onClick={() => setActiveTab('series')}>Series</a>
                <a role='tab' className={`tab text-xl ${activeTab === 'popular' ? 'tab-active' : ''}`} onClick={() => setActiveTab('popular')}>Popular</a> */}

                <div className='btm-nav'>
                    {(['movies', 'series', 'popular'] as Tab[]).map(tab => (
                        <button className={`border-t-4 ${activeTab === tab ? 'text-secondary font-bold border-secondary' : 'border-transparent'}`} onClick={() => handleActiveTab(tab)}>
                            {
                                tab === 'movies' ? 'Películas' :
                                    tab === 'series' ? 'Series' :
                                        'Popular'
                            }
                        </button>
                    ))}
                    {/* <button className={`border-t-4 ${activeTab === 'series' ? 'text-secondary font-bold border-secondary' : 'border-transparent'}`} onClick={() => handleActiveTab('series')}>
                        Series
                    </button>
                    <button className={`border-t-4 ${activeTab === 'popular' ? 'text-secondary font-bold border-secondary' : 'border-transparent'}`} onClick={() => handleActiveTab('popular')}>
                        Popular
                    </button> */}
                </div>
            </footer>
        </div>
    );
};

export default App;
