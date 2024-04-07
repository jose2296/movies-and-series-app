import { Item, ThemoviedbItem } from '../App';

const API_KEY = import.meta.env.VITE_THEMOVIEDB_API_KEY;
const API_URL = 'https://api.themoviedb.org/3/';

export const getPopularItems = async () => {

    const url = `${API_URL}/trending/all/day?language=es-ES&api_key=${API_KEY}`;
    const items = (await (await fetch(url)).json()).results;

    return parseItemsFromApi(items);
    // fetch(url).then(response => response.json()).then(data => {
    //     const _items = parseItemsFromApi(data.results);
    //     setPopularItems(_items);
    // });
};

export const searchItem = async (search: string) => {
    if (!search) {
        return;
    }

    const url = `${API_URL}/search/multi?api_key=${API_KEY}&query=${search}&language=es-ES`;
    const items = (await (await fetch(url)).json()).results;

    return parseItemsFromApi(items);
    // fetch(url).then(response => response.json().then(data => {
    //     const _items = parseItemsFromApi(data.results);

    //     setSearchItems(_items);
    //     setSearching(false);
    // }));
};

export const getMovieProviders = async (item: Item) => {
    const type = item.type === 'series' ? 'tv' : 'movie';
    const url = `${API_URL}/${type}/${item.themoviedbId}/watch/providers?api_key=${API_KEY}`;

    const data = (await (await fetch(url)).json()).results;

    return data?.ES?.flatrate.map((flatrate: { logo_path: string; provider_name: string; }) => ({
        logo: `https://image.tmdb.org/t/p/original${flatrate.logo_path}`,
        name: flatrate.provider_name
    })) ?? [];
    // fetch(url).then(response => response.json().then(data => {
    //     if (data.results?.ES?.flatrate) {
    //         const providers = data.results.ES.flatrate.map((flatrate: { logo_path: string; provider_name: string; }) => ({
    //             logo: `https://image.tmdb.org/t/p/original${flatrate.logo_path}`,
    //             name: flatrate.provider_name
    //         }));
    //         (document.getElementById('providers-modal') as HTMLDialogElement).showModal?.();
    //         setCurrentProviders(providers);
    //     }
    // }));
};

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
