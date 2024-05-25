import { TabsType } from "./pages/NotePage";

export interface User {
    username: string;
    email?: string;
    password: string
}

export const getNextTab = (tabs: TabsType[], tabId: string): TabsType => {
    const tab = tabs.find(tab => tab._id === tabId);
    const indexOfTab = tabs.indexOf(tab!);
    // if (indexOfTab == 0 && tabs.length === 1){
    //     // mark previous selected tab (that we have only one tab) as false
    //     // setTabs(tabs.map(tab => tab._id === tabId ? {...tab, selectedTab: false} : tab))
    //     // setSelected tab properties
    //     const nullValues:TabsType = {
    //       _id: '',
    //       title: '',
    //       selectedTab: false,
    //       content: '',
    //       noteId: ""
    //     }
    //     // setSelectedTab(nullValues)
    //     return nullValues;
    // }
    if(indexOfTab == 0 && tabs.length > 1) {
    // selectNextTab(tabs[indexOfTab + 1], previousId);
        return tabs[indexOfTab + 1];
    }
    else if ((indexOfTab == tabs.length - 1 && tabs.length > 1) || tabs.length > 2){
    // selectNextTab(tabs[indexOfTab - 1], previousId);
        return tabs[indexOfTab - 1];
    }
    else {
        const nullValues:TabsType = {
                  _id: '',
                  title: '',
                  selectedTab: false,
                  content: '',
                  noteId: ""
        }
        // setSelectedTab(nullValues)
        return nullValues;
             
    }

    //   else if(tabs.length > 2) {
    //     // selectNextTab(tabs[indexOfTab - 1], previousId);

    //   }
      

}