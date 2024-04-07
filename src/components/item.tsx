import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Item as ItemData } from '../App';

type ItemProps = ItemData & {
    addItemToList?: () => void
    toggleSeen?: () => void
    deleteFromList?: () => void
    getProviders?: () => void
}

const Item = ({ title, poster, checked, released, type, addItemToList, toggleSeen, deleteFromList, getProviders }: ItemProps) => {
    const [itemDate, setItemDate] = useState<string>();
    const [menuOpened, setMenuOpened] = useState<boolean>(false);

    useEffect(() => {
        setItemDate(dayjs(released).format('DD/MM/YYYY'));

    }, [released]);

    const handleMenuClicked = (action?: () => void) => {
        setMenuOpened(!menuOpened);
        action?.();
    };

    return (
        <div className='flex flex-col items-center snap-center'>
            <header className='pl-4 flex items-center justify-between max-w-[300px] w-[300px] pb-2 '>
                <p className='text-xl w-full text-center font-bold truncate'>{title}</p>

                <div className='relative'>
                    <details open={menuOpened}>
                        <summary className='list-none cursor-pointer flex p-2 hover:bg-base-200 rounded-box transition-all'>
                            <button onClick={() => handleMenuClicked()}>
                                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' className='fill-current w-4 h-4'>
                                    <path d='M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'/>
                                </svg>
                            </button>
                        </summary>
                        <ul className='absolute right-0 dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
                            {!!addItemToList && <li><button role='button' onClick={() => handleMenuClicked(addItemToList)}>Añadir a la lista</button></li>}
                            {!!toggleSeen && <li><button onClick={() => handleMenuClicked(toggleSeen)}>Marcar como {checked ? 'no vista' : 'vista'}</button></li>}
                            {!!getProviders && <li><button onClick={() => handleMenuClicked(getProviders)}>Ver proveedores</button></li>}
                            {!!deleteFromList && <li><button onClick={() => handleMenuClicked(deleteFromList)}>Borrar de la lista</button></li>}
                        </ul>
                    </details>
                </div>
            </header>
            <img decoding='async' width='300' height='500' className='w-[300px] h-[500px] max-w-[300px] max-h-[500px] rounded-box' src={poster} alt={title} />
            <div className={`flex pt-3 ${type ? 'justify-between' : 'justify-center'} w-full px-1`}>
                <p className='badge h-8 px-4 badge-outline'>{itemDate}</p>
                {!!type &&
                    <p className={`badge h-8 px-4 text-black ${type === 'series' ? 'bg-secondary' : 'bg-primary '}`}>{type === 'series' ? 'Serie' : 'Película'}</p>
                }
            </div>
        </div>
    );
};

export default Item;
