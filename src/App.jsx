import "./App.css";
import React, {createContext, useEffect, useState} from "react";
import Homepage from "./views/Homepage.jsx";
import {Route, Routes} from "react-router";
import Settings from "./views/Settings.jsx";
import FooterComponent from "./components/global/FooterComponent.jsx";
import Database from '@tauri-apps/plugin-sql';
import TutorialPage from "./components/home/Tutorial.jsx"


export const DataContext = createContext();

function App() {
    const [downloadListArr,setDownloadListArr] = useState([]);
    const [showDialogBox, setShowDialogBox] = useState(false);
   
  // Right click disable
  useEffect(() => {
    const disableRightClick = (e) => {
      e.preventDefault();
    };

    // Adding event listener to  the main document
    document.addEventListener("contextmenu", disableRightClick);

    // Cleanup to remove memory leaks....
    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []); 





    
    //load database....
    useEffect(()=>{
        (async ()=>{

            try {

                const db = await Database.load('sqlite:test.db');
           await db.execute("CREATE TABLE IF NOT EXISTS DownloadList (id VARCHAR(255) UNIQUE NOT NULL,videoTitle VARCHAR(255) NOT NULL,downloadStatus VARCHAR(255) NOT NULL,downloadTrackingMessage VARCHAR(255) NOT NULL,selectedFileFormat VARCHAR(255) NOT NULL);");
           const allDownloads = await db.select("SELECT * FROM DownloadList");
            setDownloadListArr(await allDownloads);
            } catch (e) {
                console.log(e)
            }
            


        })();
    },[]);






  return(
    
        <DataContext.Provider value={{
          downloadListArr,
           setDownloadListArr,
           showDialogBox,
            setShowDialogBox,
            
          }}>
          <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="tutorial" element={<Settings />} />
          </Routes>
          <FooterComponent/>
      </DataContext.Provider>
    
      
  );


}

export default App;
