import { RxCross2 } from "react-icons/rx";
import { TabsType } from '../pages/NotePage'


interface TabProps {
    id: string;
    title: string;
    tab: TabsType;
    selectedTab: TabsType;
    onSelect: (tab: TabsType) => void;
    onRemove: (id: string) => void
}
export const Tab = ({id, title, tab, selectedTab, onSelect, onRemove}: TabProps) => {

    return (
        <div className={`${selectedTab && selectedTab._id === id ? " bg-gray-900" : "bg-gray-700 "} flex items-center gap-2 px-2  justify-between h-9 cursor-pointer`}>
            <span 
                className="text-white h-full flex items-center text-[16px]  px-4"
                onClick={() => onSelect(tab)}
                >
                    {title}
                </span>
            <div className="flex items-center hover:bg-gray-500 px-0.5 py-0.5 hover:rounded-sm cursor-pointer  ">
                <RxCross2  onClick = {() => onRemove(id)}/> 
            </div>

        </div>
    )
}