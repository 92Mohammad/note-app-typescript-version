import { Tab } from "./Tab"
import { TabsType } from "../pages/NotePage"


interface TabBarProps {
    tabs: TabsType[],
    selectedTab: TabsType;
    selectNextTab: (tab: TabsType, previousId: string) => Promise<void>
    removeTab: (id: string) => Promise<void>,
    previousId: string

}



export const TabsBar = ({tabs, selectedTab,  selectNextTab, removeTab, previousId }: TabBarProps) => {
  
    
    return (
        <div className = 'flex items-center bg-gray-800 fixed top-0 left-60 right-0'>
            {
                tabs.map((tab, index) => {
                    return <Tab 
                        key = {index}
                        id = {tab._id}
                        tab = {tab}
                        selectedTab = {selectedTab}
                        onSelect = {() => selectNextTab(tab, previousId)}
                        title = {tab.title}
                        onRemove = {removeTab}
                    />
                })
            }
            
        </div>
    )
}