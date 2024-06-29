import { RxCross2 } from "react-icons/rx";
import { TabsType } from '../utils'
import { selectNextTab, removeTab } from "../features/TabSlice";
import { RootState, useAppDispatch } from "../app/store";
import { useSelector } from "react-redux";




interface TabProps {
    id: string;
    title: string;
    tab: TabsType;
}

export const Tab = ({id, title, tab}: TabProps) => {
    const dispatch = useAppDispatch();
    const { previousId } = useSelector((state: RootState) => state.notes);
    const { selectedTab } = useSelector((state: RootState) => state.tabs);
    console.log('this is selected tab: ', selectedTab);
    

    return (
        <div className={`${selectedTab && selectedTab._id === id ? " bg-gray-900" : "bg-gray-700 "} flex items-center gap-2 px-2  justify-between h-9 cursor-pointer  border-r`} >
            <span 
                className="text-white h-full flex items-center text-[16px]  px-4"
                onClick={() => dispatch(selectNextTab({nextTab: tab, previousId}))}
                >
                    {title}
                </span>
            <div className="flex items-center hover:bg-gray-500 px-0.5 py-0.5 hover:rounded-sm cursor-pointer  ">
                <RxCross2  onClick = {() => dispatch(removeTab(id))}/> 
            </div>

        </div>
    )
}