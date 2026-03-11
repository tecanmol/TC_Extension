import { useEffect, useState } from 'react';
import './App.css'
import Button from './components/Button'
import Loader from './components/Loading';
import AnalysisDisplay from './components/AnalysisDisplay';

function App() {
   const [analysis, setAnalysis] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(null); // NEW: Error state

  const handleAnalyze = () => {
    setIsLoading(true);
    setAnalysis(null); 
    setError(null); // NEW: Clear any previous errors

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "RUN_ANALYZE" });
    });
  };

  useEffect(() => {
    const listener = (msg, sender) => {
      if (msg.action === "ANALYSIS_RESULT") {
        setAnalysis(msg.data); 
        setIsLoading(false);
      } else if (msg.action === "ANALYSIS_ERROR") {
        // NEW: Handle the error message from content.js
        setError(msg.error);
        setIsLoading(false);
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  return (
    <>
      {!isLoading && (
        <Button onClick={handleAnalyze}></Button>
      )}

      {isLoading && (
        <div>
          <div style={{ marginTop: "20px" }}>
            <Loader />
          </div>
        </div>
      )}

      {/* NEW: Render the error message if it exists */}
      {error && (
        <div className="error-message">
           ⚠️ Oops! {error}
        </div>
      )}

      {!isLoading && analysis && !error && (
        <AnalysisDisplay data={analysis} />
      )}
    </>
  )
}

export default App