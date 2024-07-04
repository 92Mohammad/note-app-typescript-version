import { RxCross2 } from "react-icons/rx";
import { TabsType } from '../utils'
import { selectNextTab, removeTab } from "../features/TabSlice";
import { RootState, useAppDispatch } from "../app/store";
import { useSelector } from "react-redux";

interface TabProps {
    title: string;
    tab: TabsType;
    isSelected: boolean 
}

export const Tab = ({ title, tab, isSelected}: TabProps) => {
    const dispatch = useAppDispatch();
    const { tabs } = useSelector((state: RootState) => state.tabs);

    const handleSelectTab = () => {
        const previousSelectedTab = tabs.find(tab => tab.isSelected);
        console.log('previous selected tab:  ' , previousSelectedTab)
        if(previousSelectedTab){
            dispatch(selectNextTab({
                nextTab: tab,
                previousTabId: previousSelectedTab._id,
                previousTabContent: previousSelectedTab?.content 
            }))
        }
    }


    return (
        <div className={`${isSelected ? " bg-gray-900" : "bg-gray-700 "} flex items-center gap-2 px-2  justify-between h-9 cursor-pointer  border-r`} >
            <span 
                className="text-white h-full flex items-center text-[16px]  px-4"
                onClick={() => handleSelectTab()}
                >
                    {title}
                </span>
            <div className="flex items-center hover:bg-gray-500 px-0.5 py-0.5 hover:rounded-sm cursor-pointer  ">
                <RxCross2  onClick = {() => dispatch(removeTab(tab))}/> 
            </div>

        </div>
    )
}