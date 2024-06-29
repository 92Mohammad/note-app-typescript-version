import { setSelectedTab, setTabs } from '../features/TabSlice';
import { useAppDispatch, RootState } from '../app/store';
import { useSelector } from 'react-redux';
import { setPreviousId } from '../features/NoteSlice';


// interface EditorProps {
//     selectedTab: TabsType;
//     setSelectedTab: React.Dispatch<React.SetStateAction<TabsType>>
//     tabs: TabsType[];
//     setTabs: React.Dispatch<React.SetStateAction<TabsType[]>>
//     setPreviousId:  React.Dispatch<React.SetStateAction<string>>
// }


export const Editor = () => {
    const dispatch = useAppDispatch();
    const { tabs , selectedTab} = useSelector((state: RootState) => state.tabs)

    const handleContent = (content: string)=> {
        dispatch(setPreviousId(selectedTab._id))
        // 1. first set the content of tabs 
        const updatedTabArray = tabs.map(tab => tab._id === selectedTab._id ? {...tab, content: content}: tab);
        dispatch(setTabs(updatedTabArray));

        // 2. set the selectedTab content property over here
        dispatch(setSelectedTab({...selectedTab, content: content}));

    }
    
    return (
        <div>
            <textarea 
                value= { selectedTab &&  selectedTab.content }
                name="textarea" 
                id="textarea" 
                cols= {50}
                rows= {30} 
                className="w-full bg-gray-900 px-2 py-2 border-2 outline-none rounded-md"
                onChange = {(e) => handleContent(e.target.value) }
            >
            </textarea>
        </div>
    )
}