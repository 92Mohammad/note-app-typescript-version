import { TabsType } from "./pages/NotePage";

export interface User {
    username: string;
    email?: string;
    password: string
}

export const getNextTab = (tabs: TabsType[], tabId: string): TabsType => {
    const tab = tabs.find(tab => tab._id === tabId);
    const indexOfTab = tabs.indexOf(tab!);
    const nullValues:TabsType = {
        _id: '',
        title: '',
        selectedTab: false,
        content: '',
        noteId: ""
    } 
    if (tab && tab.selectedTab){
        if(indexOfTab == 0 && tabs.length > 1) {
            // selectNextTab(tabs[indexOfTab + 1], previousId);
                return tabs[indexOfTab + 1];
            }
            else if ((indexOfTab == tabs.length - 1 && tabs.length > 1) || tabs.length > 2){
            // selectNextTab(tabs[indexOfTab - 1], previousId);
                return tabs[indexOfTab - 1];
            }
        }
    return nullValues;
}