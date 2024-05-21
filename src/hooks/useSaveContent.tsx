import { TabsType } from "../pages/NotePage"


type useSaveContentReturnType = {
  saveContent: (tabs: TabsType[]) => void
}

export const useSaveContent = (previousId: string): useSaveContentReturnType => {

    async function saveContent(tabs: TabsType[]) {

        const previousTab = tabs.find(tab => tab._id === previousId)
        
        if (previousTab){
    
          const res = await fetch('http://localhost:8000/tab/save-content', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({tabId: previousId, content: previousTab?.content})
          })

          try{
            const data = await res.json()
            console.log('After successfully saving content: ', data)  
          }
          catch(error: any){
            console.log(error);
          }
          
        }
        else {
          console.log('previous tab does not exist')
        }
        
    }

    return { saveContent }
}