import { TabsType } from "../pages/NotePage"


type useSaveContentReturnType = {
  saveContent: (tabs: TabsType[]) => void
}

export const useSaveContent = (previousId: string): useSaveContentReturnType => {

    async function saveContent(tabs: TabsType[]) {
        try {
          const previousTab = tabs.find(tab => tab._id === previousId)
          if (previousTab){
      
            await fetch('http://localhost:8000/tab/save-content', {
              method: 'POST',
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({tabId: previousId, content: previousTab?.content})
            })            
          }
          else {
            console.log('previous tab does not exist')
          }
          
        }
        catch(error: any){
          console.log(error.message);
        }
        
    }

    return { saveContent }
}