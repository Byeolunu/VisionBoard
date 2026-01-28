import React, { useState, useEffect } from 'react';
import { Menu, Sparkles, Loader2, Brain, PanelsRightBottom, Moon, Sun } from 'lucide-react';

import UploadArea from './components/UploadArea';
import CodeDisplay from './components/CodeDisplay';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import FlashcardReview from './components/FlashcardReview';
import { FileUpload, ProgrammingLanguage, AnalysisResult, ChatMessage, HistoryItem, OutputMode, SavedFlashcard } from './types';
import { analyzeWhiteboard, sendFollowUpMessage, generateQuiz } from './services/geminiService';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('boardvision_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'light';
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showReviewOverlay, setShowReviewOverlay] = useState(false);
  
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [savedFlashcards, setSavedFlashcards] = useState<SavedFlashcard[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatSending, setIsChatSending] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  
  const [outputMode, setOutputMode] = useState<OutputMode>('auto');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('Auto');

  useEffect(() => {
    localStorage.setItem('boardvision_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const savedHist = localStorage.getItem('boardvision_history');
    if (savedHist) setHistory(JSON.parse(savedHist));
    const savedCards = localStorage.getItem('boardvision_flashcards');
    if (savedCards) setSavedFlashcards(JSON.parse(savedCards));
  }, []);

  const handleClear = () => {
    setUploadedFiles([]);
    setResult(null);
    setChatMessages([]);
    setChatOpen(false);
  };

  const updateHistory = (res: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      thumbnail: uploadedFiles[0]?.previewUrl || '',
      language: selectedLanguage,
      mode: outputMode,
      result: res,
    };
    const newHist = [newItem, ...history.filter(h => h.result.title !== res.title).slice(0, 19)];
    setHistory(newHist);
    localStorage.setItem('boardvision_history', JSON.stringify(newHist));
  };

  const handleAnalysis = async (refinement?: string) => {
    if (uploadedFiles.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await analyzeWhiteboard(
        uploadedFiles.map(f => ({ base64: f.base64, mimeType: f.mimeType })),
        selectedLanguage, outputMode, refinement
      );
      setResult(res);
      updateHistory(res);
    } catch (err) {
      console.error(err);
      alert("Analysis engine failure.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!result) return;
    setIsChatSending(true);
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);
    try {
      const reply = await sendFollowUpMessage(
        [...chatMessages, userMsg], 
        text, 
        result.explanation + (result.code || ""), 
        uploadedFiles.map(f => ({ base64: f.base64, mimeType: f.mimeType }))
      );
      setChatMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: reply, timestamp: Date.now() }]);
    } catch (e) { console.error(e); }
    finally { setIsChatSending(false); }
  };

  const handleGenerateQuiz = async () => {
    if (!result) return;
    setIsGeneratingQuiz(true);
    try {
      const quiz = await generateQuiz(result.explanation);
      const updatedResult = { ...result, quiz };
      setResult(updatedResult);
      updateHistory(updatedResult);
    } catch (e) { alert("Quiz failed."); }
    finally { setIsGeneratingQuiz(false); }
  };

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-vintage-cream text-vintage-teal'} transition-all duration-500 overflow-hidden font-sans relative`}>
      
      {showReviewOverlay && (
        <FlashcardReview cards={savedFlashcards} onClose={() => setShowReviewOverlay(false)} theme={theme} />
      )}

      <Sidebar 
        history={history} 
        savedFlashcards={savedFlashcards}
        isOpen={sidebarOpen} 
        onSelectHistory={(item) => { 
            setResult(item.result); 
            setUploadedFiles([{ id: 'h', file: new File([], 'h.jpg'), previewUrl: item.thumbnail, base64: '', mimeType: 'image/jpeg' }]); 
        }}
        onNewAnalysis={handleClear}
        onCloseMobile={() => setSidebarOpen(false)}
        onClearHistory={() => { setHistory([]); localStorage.setItem('boardvision_history', '[]'); }}
        onDeleteFlashcard={() => {}}
        onReviewCards={() => setShowReviewOverlay(true)}
        theme={theme}
        toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-stripes relative">
        
        {/* Navigation Bar */}
        <header className="px-8 py-6 flex items-center justify-between z-10 bg-white/30 dark:bg-slate-900/40 backdrop-blur-md border-b border-vintage-pink/10">
           <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-vintage-teal dark:text-vintage-cream">
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex flex-col">
                <h1 className="text-4xl font-script text-vintage-teal dark:text-vintage-cream leading-none">BoardVision</h1>
                <p className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-vintage-pink mt-1">Second chances, first-class code</p>
              </div>
           </div>
           
           <nav className="hidden md:flex items-center gap-10 font-display text-[11px] font-bold text-vintage-teal dark:text-vintage-cream tracking-widest">
              <button onClick={handleClear} className="hover:text-vintage-pink transition-colors">NEW SESSION</button>
              <button onClick={() => setShowReviewOverlay(true)} className="hover:text-vintage-pink transition-colors">STUDY DECK</button>
              {result && (
                <button 
                  onClick={() => setChatOpen(!chatOpen)} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 relative group ${
                    chatOpen 
                      ? 'bg-vintage-teal text-white' 
                      : (theme === 'dark' ? 'bg-vintage-gold text-slate-900' : 'bg-vintage-pink/10 text-vintage-teal hover:bg-vintage-pink/20')
                  } ${!chatOpen && 'animate-pulse'}`}
                >
                  <PanelsRightBottom className="w-4 h-4" /> COPILOT
                  {!chatOpen && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 group-hover:scale-125 transition-transform" />}
                </button>
              )}
              <div className="flex items-center gap-4 pl-4 border-l border-vintage-pink/20">
                <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className="p-2 bg-vintage-teal/5 rounded-full hover:bg-vintage-teal/10 transition-all">
                    {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-vintage-gold" />}
                </button>
              </div>
           </nav>
        </header>

        <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0 p-8 overflow-hidden relative">
               {result ? (
                 <CodeDisplay 
                    result={result}
                    onAction={(a) => handleSendMessage(`Please ${a}.`)}
                    onRegenerate={(instr) => handleAnalysis(instr)}
                    isProcessing={isProcessing}
                    onSaveAnalysis={(res) => updateHistory(res)}
                    onSaveFlashcards={(cards) => {
                        if (!result) return;
                        const newSaved = [...savedFlashcards];
                        cards.forEach(card => {
                          // Check if this card already exists in the deck (by term, definition and current deck source)
                          const isDuplicate = savedFlashcards.some(saved => 
                            saved.term === card.term && 
                            saved.definition === card.definition && 
                            saved.deckName === result.title
                          );
                          
                          if (!isDuplicate) {
                            newSaved.push({ 
                              ...card, 
                              id: Math.random().toString(36).substr(2, 9), 
                              deckName: result.title, 
                              dateAdded: Date.now() 
                            });
                          }
                        });
                        setSavedFlashcards(newSaved);
                        localStorage.setItem('boardvision_flashcards', JSON.stringify(newSaved));
                    }}
                    onSaveSingleFlashcard={() => {}}
                    savedFlashcards={savedFlashcards}
                    onRequestQuiz={handleGenerateQuiz}
                    isGeneratingQuiz={isGeneratingQuiz}
                    theme={theme}
                 />
               ) : (
                 <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 max-w-6xl mx-auto w-full">
                    <div className="flex-1 text-left animate-in fade-in slide-in-from-left-8 duration-1000">
                        <h2 className="text-6xl lg:text-8xl font-script text-vintage-teal dark:text-vintage-cream leading-tight mb-8">
                          From <span className="text-vintage-pink italic">vision</span>, to reality.
                        </h2>
                        <p className="text-lg text-vintage-teal/70 dark:text-vintage-cream/60 max-w-md font-medium leading-relaxed mb-10 italic">
                          Welcome to BoardVision! A curated tool for scholars and creators where every whiteboard sketch gets a second chance to shine as executable wisdom.
                        </p>
                        <button
                            onClick={() => document.getElementById('file-input')?.click()}
                            className="bg-vintage-teal hover:bg-vintage-tealHover text-vintage-cream pill-button px-12 py-5 shadow-vibrant text-sm"
                        >
                            Analyze Your Work
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-center relative">
                       <UploadArea 
                          files={uploadedFiles}
                          onFilesSelected={(newFiles) => setUploadedFiles([...uploadedFiles, ...newFiles])}
                          onRemoveFile={(id) => setUploadedFiles(uploadedFiles.filter(f => f.id !== id))}
                          isProcessing={isProcessing}
                       />
                       
                       {uploadedFiles.length > 0 && (
                          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                              <button
                                  onClick={() => handleAnalysis()}
                                  disabled={isProcessing}
                                  className="bg-vintage-teal hover:bg-vintage-tealHover text-vintage-cream pill-button px-10 py-5 shadow-vibrant transition-all flex items-center gap-4 active:scale-95"
                              >
                                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                  Begin Analysis
                              </button>
                          </div>
                       )}
                    </div>
                 </div>
               )}
            </div>

            {chatOpen && result && (
              <aside className="w-[400px] transition-all duration-300 shrink-0 border-l border-vintage-pink/30 animate-in slide-in-from-right-full bg-white dark:bg-slate-900 shadow-2xl z-20 overflow-hidden">
                  <ChatInterface 
                      messages={chatMessages}
                      onSendMessage={handleSendMessage}
                      isSending={isChatSending}
                  />
              </aside>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;