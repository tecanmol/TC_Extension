import { useEffect,useState} from 'react';
import './App.css'
import Button from './components/Button'
import Loader from './components/Loading';
import AnalysisDisplay from './components/AnalysisDisplay';


function App() {
   const [analysis, setAnalysis] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = () => {
   setIsLoading(true);
   setAnalysis(null); 
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "RUN_ANALYZE" });
  });
};

useEffect(() => {
    // Listen for analysis result coming from content.js
    const listener = (msg, sender) => {
      if (msg.action === "ANALYSIS_RESULT") {
        console.log("Received analysis in popup:", msg.data);
        console.log("Type of data:", typeof msg.data);
        setAnalysis(msg.data); // Save to React 
        setIsLoading(false);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    // Cleanup on unmount
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  return (
    <>
     {!isLoading && (
      <Button onClick={handleAnalyze}></Button>
    )}

      {isLoading &&(
        <div>
          <div style={{ marginTop: "20px" }}>
          <Loader />
        </div>
        </div>
      )}

      {!isLoading && analysis && (
        <AnalysisDisplay data={analysis} />
      )}
    </>
  )
}

export default App
