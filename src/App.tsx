// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { child, getDatabase, onValue, ref, remove, set } from 'firebase/database';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import List from './components/list';
import { getMovieProviders, getPopularItems, searchItem } from './services/themoviedb';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDBINVo16FMd_AfWBg0EnaFRAc5mjzAE_g',
    authDomain: 'lists-fa5ab.firebaseapp.com',
    databaseURL: 'https://lists-fa5ab-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'lists-fa5ab',
    storageBucket: 'lists-fa5ab.appspot.com',
    messagingSenderId: '262332809341',
    appId: '1:262332809341:web:562be1af757f31cebbf114',
};

// Initialize Firebase
initializeApp(firebaseConfig);

const dbRef = ref(getDatabase());

export type Item = {
    themoviedbId: number,
    title: string;
    checked: boolean;
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

type Tab = 'movies' | 'series' | 'popular' | 'search';

export interface Rating {
    Source: string
    Value: string
}

const App = () => {
    const [currentTheme, setCurrentTheme] = useState<'dark' | 'custom'>('custom');
    const [activeTab, setActiveTab] = useState<'movies' | 'series' | 'search' | 'popular'>('movies');
    const [allMovies, setAllMovies] = useState<{seen: Item[]; notSeen: Item[]}>({ seen: [], notSeen: [] });
    const [movies, setMovies] = useState<Item[]>([]);
    const [allSeries, setAllSeries] = useState<{seen: Item[]; notSeen: Item[]}>({ seen: [], notSeen: [] });
    const [series, setSeries] = useState<Item[]>([]);
    const [searchItems, setSearchItems] = useState<Item[]>([]);
    const [popularItems, setPopularItems] = useState<Item[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchActiveTabValue, setSearchActiveTabValue] = useState<string>('');
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
    const [searching, setSearching] = useState(false);
    const [seenFilter, setSeenFilter] = useState(false);
    const [currentProviders, setCurrentProviders] = useState<{ logo: string; name: string }[]>([]);
    const [itemToRemove, setItemToRemove] = useState<Item>();

    useEffect(() => {
        getTheme();
        getMovies();
        getSeries();
        _getPopularItems();
    }, []);

    const getTheme = () => {
        const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'custom';
        setCurrentTheme(theme);
    };

    useEffect(() => {
        document.querySelector('html')?.setAttribute('data-theme', currentTheme);
    }, [currentTheme]);

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
        _searchItem(debouncedSearchValue);

    }, [debouncedSearchValue]);

    useEffect(() => {
        const _movies = seenFilter ? allMovies.seen : allMovies.notSeen;
        setMovies(_movies);

        const _series = seenFilter ? allSeries.seen : allSeries.notSeen;
        setSeries(_series);

    }, [seenFilter, allMovies, allSeries]);

    useEffect(() => {
        if (activeTab === 'movies') {
            const _movies = seenFilter ? allMovies.seen : allMovies.notSeen;
            const newMovies = _movies.filter(item => item.title.toLowerCase().includes(searchActiveTabValue.toLowerCase()));
            setMovies(newMovies);
        }

        if (activeTab === 'series') {
            const _series = seenFilter ? allSeries.seen : allSeries.notSeen;
            const newSeries = _series.filter(item => item.title.toLowerCase().includes(searchActiveTabValue.toLowerCase()));
            setSeries(newSeries);
        }
    }, [searchActiveTabValue]);

    const getMovies = () => {
        onValue(child(dbRef, 'movies'), (snapshot) => {
            if (snapshot.exists()) {
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
            }
        });
    };

    const getSeries = () => {
        onValue(child(dbRef, 'series'), (snapshot) => {
            if (snapshot.exists()) {
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
            }
        });
    };

    const _getPopularItems = async () => {
        const _items = await getPopularItems();

        setPopularItems(_items);
    };

    const _searchItem = async (search: string) => {
        if (!search) {
            return;
        }

        const _items = await searchItem(search) as Item[];

        setSearchItems(_items);
        setSearching(false);
    };

    const _getMovieProviders = async (item: Item) => {
        const providers = await getMovieProviders(item);

        (document.getElementById('providers-modal') as HTMLDialogElement).showModal?.();
        setCurrentProviders(providers);
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
        const canAddItem = checkCanAddItem(item);
        const type = item.type === 'series' ? 'serie' : 'película';

        if (!canAddItem) {
            toast.error(`Esa ${type} ya está en tu lista.`);
            // alert('Esa pelicula esta añadida ya');
            return;
        }

        set(ref(db, `${item.type}/${item.themoviedbId}`), {
            themoviedbId: item.themoviedbId,
            title: item.title,
            poster: item.poster,
            released: item.released,
            checked: false,
            type: item.type
        });
        toast.success(`<span class="font-bold underline">${item.title}</span> añadida a tu lista de ${type}s.`);
    };

    const checkCanAddItem = (item: Item) => {
        const arrayToSearch = item.type === 'series' ? [...allMovies.notSeen, ...allSeries.seen] : [...allMovies.notSeen, ...allMovies.seen];
        const itemFounded = arrayToSearch.find(movie => movie.themoviedbId === item.themoviedbId);

        return !itemFounded;
    };

    const toggleSeen = (item: Item) => {
        const db = getDatabase();
        const type = item.type === 'series' ? 'series' : 'películas';
        set(ref(db, `${activeTab}/${item.themoviedbId}/checked`), !item.checked);
        const message = !item.checked ?
            `se ha añadido a la lista de ${type} vistas.` :
            `se ha eliminado de la lista de ${type} vistas.`;
        toast.success(`<span class="font-bold underline">${item.title}</span> ${message}`);
    };

    const openModalToDeleteItem = (item: Item) => {
        setItemToRemove(item);
        (document.getElementById('remove-item-modal') as HTMLDialogElement).showModal?.();
    };

    const deleteFromList = (item: Item) => {
        const db = getDatabase();
        remove(ref(db, `${activeTab}/${item.themoviedbId}`));
        const type = item.type === 'series' ? 'series' : 'películas';
        toast.success(`<span class="font-bold underline">${item.title}</span> se ha eliminado de la lista de ${type}.`);
        (document.getElementById('remove-item-modal') as HTMLDialogElement).close?.();
        setItemToRemove(undefined);
    };

    const handleActiveTab = (tab: Tab) => {
        setSearchActiveTabValue('');
        setActiveTab(tab);
        handleClearSearch();
        if (tab === 'search') {
            setTimeout(() => {
                (document.getElementById('search-input') as HTMLInputElement).focus();

            }, 100);
        }
    };

    const toggleTheme = () => {
        const newTheme = currentTheme === 'custom' ? 'dark' : 'custom';
        setCurrentTheme(newTheme);
    };

    return (
        <div className='drawer'>
            <input id='my-drawer' type='checkbox' className='drawer-toggle' />
            <div className='drawer-content'>
                <div className='py-4 flex flex-col justify-stretch gap-4 md:gap-10 h-[100vh]'>
                    <header className='pr-4 flex w-full items-center border-b-2 pb-2 border-slate-500'>
                        <label htmlFor='my-drawer' className='transition-all drawer-button p-2 cursor-pointer hover:bg-base-200 rounded-box'>
                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
                            </svg>

                        </label>
                        {activeTab === 'search' &&
                            <label className={`group w-full max-w-96 h-[40px] min-h-[40px] input border-2 border-base-content border-opacity-40 flex items-center gap-2 focus-within:outline-none focus:outline-none focus:border-base-content focus-within:border-base-content ${searchValue ? 'border-opacity-100' : ''}`}>
                                <input id='search-input' type='text' className='w-full text-md text-base-content placeholder:text-base-content placeholder:text-opacity-90 font-bold placeholder:font-normal' placeholder='Busca películas o series' value={searchValue} onChange={({ target: { value } }) => setSearchValue(value)} />
                                {!searchValue &&
                                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className={'w-6 h-6 group-focus-within:stroke-[3]'}>
                                        <path strokeLinecap='round' strokeLinejoin='round' d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z' />
                                    </svg> }
                                {!!searchValue && !searching &&
                                    <svg onClick={handleClearSearch} xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2.5} stroke='currentColor' className='w-6 h-6'>
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
                                    </svg>
                                }
                                {!!searchValue && !!searching &&
                                    <span className='loading loading-spinner w-6 h-6'></span>
                                }
                            </label>
                        }

                        {activeTab !== 'search' &&
                            <div className='flex items-center w-full gap-1 h-[40px]'>
                                {activeTab === 'popular' &&
                                    <h1 className='text-lg w-full font-semibold'>Series y películas populares</h1>
                                }
                                {['movies', 'series'].includes(activeTab) &&
                                    <>
                                        <h1 className='text-lg w-full font-semibold'>{activeTab === 'series' ? 'Series' : 'Películas'} {seenFilter ? 'vistas' : 'pendientes de ver'}</h1>
                                        <label className='btn btn-circle swap max-h-[48px] h-[48px]'>
                                            {/* this hidden checkbox controls the state */}
                                            <input type='checkbox' onChange={toggleSeenFilter} checked={seenFilter} />

                                            {/* OFF */}
                                            <svg className='swap-on w-5 h-w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2.5} stroke='currentColor'>
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z' />
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' />
                                            </svg>

                                            {/* ON */}
                                            <svg className='swap-off w-5 h-w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2.5} stroke='currentColor'>
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88' />
                                            </svg>
                                        </label>
                                    </>
                                }
                            </div>
                        }
                    </header>

                    <main className='flex-1'>
                        <>
                            {['movies', 'series'].includes(activeTab) &&
                                <>
                                    <div className='pl-10 pr-12 pb-6'>
                                        <label className={`group h-[40px] min-h-[40px] input border-2 border-base-content border-opacity-40 flex items-center gap-2 focus-within:outline-none focus:outline-none focus:border-base-content focus-within:border-base-content ${searchActiveTabValue ? 'border-opacity-100' : ''}`}>
                                            <input
                                                id='search-input'
                                                type='text'
                                                className={'w-full text-md text-base-content placeholder:text-base-content placeholder:text-opacity-90 font-bold placeholder:font-normal'}
                                                placeholder={`Busca ${activeTab === 'movies' ? 'película' : 'serie' }`}
                                                value={searchActiveTabValue}
                                                onChange={({ target: { value } }) => setSearchActiveTabValue(value)}
                                            />
                                            {!searchActiveTabValue &&
                                                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className={'w-6 h-6 group-focus-within:stroke-[3]'}>
                                                    <path strokeLinecap='round' strokeLinejoin='round' d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z' />
                                                </svg> }
                                            {!!searchActiveTabValue &&
                                                <svg onClick={() => setSearchActiveTabValue('')} xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2.5} stroke='currentColor' className='w-6 h-6'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
                                                </svg>
                                            }
                                        </label>
                                    </div>
                                    <List
                                        items={activeTab === 'movies' ? movies : series}
                                        toggleSeen={toggleSeen}
                                        deleteFromList={openModalToDeleteItem}
                                        getProviders={_getMovieProviders}
                                    />
                                </>
                            }

                            {activeTab === 'popular' &&
                                <>
                                    <List
                                        items={popularItems}
                                        addItemToList={addItemToList}
                                        getProviders={_getMovieProviders}
                                    />
                                </>
                            }
                        </>

                        {activeTab === 'search' &&
                            <>
                                {!!searchItems.length &&
                                    <List
                                        items={searchItems}
                                        addItemToList={addItemToList}
                                        getProviders={_getMovieProviders}
                                    />
                                }
                                {!searchItems.length && !searching &&
                                    <p className='flex h-full justify-center items-center pb-[100px] max-full px-10 text-center'>
                                        {!!searchValue &&
                                            <span>No hemos encontrado nada para "{searchValue}"</span>
                                        }
                                        {!searchValue &&
                                            <span>Escribe en el buscador para encontrar tus series y películas favoritas.</span>
                                        }
                                    </p>
                                }
                            </>
                        }

                    </main>

                    <dialog id='providers-modal' className='modal'>
                        <div className='modal-box flex flex-col gap-2 max-w-[500px] w-4/5 pt-10'>
                            <div className='flex flex-wrap gap-4 justify-center items-center'>
                                {currentProviders?.map(provider => (
                                    <div key={provider.name} className='flex flex-col w-[100px]'>
                                        <img width='100' height='100' className='w-full h-[100px]' src={provider.logo} alt='' />
                                        <p className='text-center pt-2 truncate w-full'>{provider.name}</p>
                                    </div>
                                ))}

                                {!currentProviders.length &&
                            <p className='pb-2'>No hay proveedores disponibles todavía.</p>
                                }

                            </div>
                            <div className='modal-action m-0'>
                                <form method='dialog'>
                                    {/* if there is a button in form, it will close the modal */}
                                    <button className='btn'>Cerrar</button>
                                </form>
                            </div>
                        </div>
                    </dialog>

                    <dialog id='remove-item-modal' className='modal'>
                        {!!itemToRemove &&
                            <div className='modal-box flex flex-col gap-2 max-w-[500px] w-4/5 pt-10'>
                                <div className='flex flex-wrap gap-4 justify-center items-center'>
                                    <p>¿Estás seguro que quieres borrar <span className='font-bold underline'>{itemToRemove.title}</span> de tu lista de {itemToRemove.type === 'series' ? 'series' : 'películas'}?</p>
                                </div>
                                <div className='modal-action m-0 pt-4'>
                                    <form method='dialog' className='flex justify-end gap-4' onSubmit={() => deleteFromList(itemToRemove)}>
                                        {/* if there is a button in form, it will close the modal */}
                                        <button type='button' onClick={() => (document.getElementById('remove-item-modal') as HTMLDialogElement)?.close()} className='btn'>Cancelar</button>
                                        <button type='submit' className='btn btn-error'>Borrar</button>
                                    </form>
                                </div>
                            </div>
                        }
                    </dialog>
                </div>
            </div>
            <div className='drawer-side'>
                <label htmlFor='my-drawer' aria-label='close sidebar' className='drawer-overlay'></label>
                <div className='menu p-0 max-w-[70%] w-96 min-h-full bg-base-200 text-xl'>
                    <h1 className='text-2xl px-6 pt-4 pb-2'>Menu</h1>
                    <div className='divider mt-0 mb-4'></div>
                    <ul className='flex flex-col gap-2 items-start pl-2 pr-6'>
                        {(['movies', 'series', 'popular', 'search'] as Tab[]).map(tab => (
                            <li key={tab} className={`w-full transition-all ${activeTab === tab ? 'rounded-box text-base-100 font-semibold bg-base-content' : ''}`}>
                                <label htmlFor='my-drawer' onClick={() => handleActiveTab(tab)}>
                                    <a>
                                        {
                                            tab === 'movies' ? 'Películas' :
                                                tab === 'series' ? 'Series' :
                                                    tab === 'popular' ? 'Popular' :
                                                        <span className='flex items-center gap-2'>
                                                        Buscar
                                                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className={'w-6 h-6'}>
                                                                <path strokeLinecap='round' strokeLinejoin='round' d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z' />
                                                            </svg>
                                                        </span>
                                        }
                                    </a>
                                </label>
                            </li>
                        ))}
                        <li className='w-full items-start'>
                            <label className='w-full swap swap-rotate place-content-start'>
                                {/* this hidden checkbox controls the state */}
                                <input type='checkbox' onChange={() => toggleTheme()} />

                                {/* sun icon */}
                                <svg className='swap-on fill-current w-8 h-8' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z'/></svg>

                                {/* moon icon */}
                                <svg className='swap-off fill-current w-8 h-8' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z'/></svg>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default App;
