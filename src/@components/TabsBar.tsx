import { Tab } from "./Tab"
import { useSelector } from "react-redux"
import { RootState } from "../app/store";


export const TabsBar = () => {
    const { tabs } = useSelector((state: RootState) => state.tabs)
    
    return (
        <div className = 'flex items-center bg-gray-800 fixed top-0 left-60 right-0'>
            {
                tabs.map((tab, index) => {
                    return <Tab 
                        key = {index}
                        isSelected = {tab.isSelected}
                        tab = {tab}
                        title = {tab.title}  
                    />
                })
            }
            
        </div>
    )
}