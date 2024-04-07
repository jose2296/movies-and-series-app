import { Item as ItemData } from '../App';
import Item from './item';

const List = ({ items, addItemToList, toggleSeen, deleteFromList, getProviders }: { items: ItemData[]; addItemToList?: (item: ItemData) => void; toggleSeen?: (item: ItemData) => void; deleteFromList?: (item: ItemData) => void; getProviders?: (item: ItemData) => void }) => (
    !items.length ? <p className='flex h-full justify-center items-center pb-[100px]'>No hay elementos todavía.</p> :
        <div className='px-10 h-full flex gap-10 overflow-x-auto snap-x snap-center snap-mandatory pb-20 md:items-center'>
            {items.map((item, index) => (
                <Item
                    key={index}
                    {...item}
                    addItemToList={addItemToList ? () => addItemToList(item) : undefined}
                    toggleSeen={toggleSeen ? () => toggleSeen(item) : undefined}
                    deleteFromList={deleteFromList ? () => deleteFromList(item) : undefined}
                    getProviders={getProviders ? () => getProviders(item) : undefined}
                />
            ))}
        </div>
);

export default List;
