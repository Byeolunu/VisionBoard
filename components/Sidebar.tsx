import React from 'react';
import { HistoryItem, SavedFlashcard } from '../types';
import { Plus, Terminal, Image as ImageIcon, Trash2, Library, BookOpen, Settings, LogOut, Brain, Layers } from 'lucide-react';

interface SidebarProps {
  history: HistoryItem[];
  savedFlashcards: SavedFlashcard[];
  isOpen: boolean;
  onSelectHistory: (item: HistoryItem) => void;
  onNewAnalysis: () => void;
  onCloseMobile: () => void;
  onClearHistory: () => void;
  onDeleteFlashcard: (id: string) => void;
  onReviewCards: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  history, 
  savedFlashcards,
  isOpen, 
  onSelectHistory, 
  onNewAnalysis,
  onCloseMobile,
  onClearHistory,
  onReviewCards,
  theme,
}) => {
  const isDark = theme === 'dark';

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={onCloseMobile}/>}

      <div className={`fixed inset-y-0 left-0 z-50 w-[300px] flex flex-col border-r transition-all duration-300 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-vintage-pink/20'
      }`}>
        
        <div className={`p-8 border-b flex items-center gap-4 ${isDark ? 'border-slate-800' : 'border-vintage-cream'}`}>
           <div className="w-12 h-12 bg-vintage-teal text-white rounded-2xl flex items-center justify-center shadow-lg">
             <Brain className="w-7 h-7" />
           </div>
           <div>
             <h1 className={`text-3xl font-script leading-none ${isDark ? 'text-vintage-cream' : 'text-vintage-teal'}`}>Curation</h1>
             <p className={`text-[9px] font-display font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-slate-500' : 'text-vintage-pink'}`}>Archive Library</p>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-none">
          <button
              onClick={() => { onNewAnalysis(); onCloseMobile(); }}
              className={`w-full flex items-center justify-between group pill-button border-2 p-4 transition-all shadow-sm ${
                isDark 
                ? 'border-vintage-gold text-vintage-gold hover:bg-vintage-gold hover:text-slate-900' 
                : 'border-vintage-teal text-vintage-teal hover:bg-vintage-teal hover:text-white'
              }`}
          >
              <span className="text-[10px] tracking-widest font-bold">New Creation</span>
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          </button>

          <section>
            <div className="flex items-center justify-between mb-6">
               <h3 className={`text-[10px] font-display font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-vintage-pink'}`}>
                 Archive
               </h3>
               {history.length > 0 && (
                 <button onClick={onClearHistory} className={`text-[10px] uppercase font-bold tracking-widest transition-colors ${
                   isDark ? 'text-slate-600 hover:text-slate-400' : 'text-vintage-teal/40 hover:text-vintage-teal'
                 }`}>Wipe</button>
               )}
            </div>
            
            {history.length === 0 ? (
                <div className={`p-10 border border-dashed rounded-3xl text-center ${isDark ? 'border-slate-800' : 'border-vintage-pink/30'}`}>
                    <p className={`text-[9px] font-display font-bold uppercase tracking-widest ${isDark ? 'text-slate-700' : 'text-vintage-pink/50'}`}>Empty Archive</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {history.map((item) => (
                       <button
                          key={item.id}
                          onClick={() => { onSelectHistory(item); onCloseMobile(); }}
                          className={`polaroid aspect-square relative group hover:scale-105 transition-all p-1 ${
                            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'
                          }`}
                       >
                           <img src={item.thumbnail} className={`w-full h-full object-cover ${isDark ? 'grayscale-[60%] opacity-80' : 'grayscale-[30%]'}`} alt="hist"/>
                           <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                              <p className="text-[7px] font-bold text-white truncate px-1">{item.result.title}</p>
                           </div>
                       </button>
                    ))}
                </div>
            )}
          </section>

          <section className={`p-6 rounded-3xl border transition-colors ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-vintage-cream/50 border-vintage-pink/10'
          }`}>
             <div className="flex items-center gap-4 mb-6">
                <div className={`p-2 rounded-xl text-white ${isDark ? 'bg-vintage-gold text-slate-900' : 'bg-vintage-teal'}`}>
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                   <h3 className={`text-[10px] font-display font-bold uppercase tracking-widest ${isDark ? 'text-vintage-cream' : 'text-vintage-teal'}`}>Mastery Deck</h3>
                   <p className={`text-[9px] font-medium ${isDark ? 'text-slate-500' : 'text-vintage-pink'}`}>{savedFlashcards.length} cards collected</p>
                </div>
             </div>
             <button 
                disabled={savedFlashcards.length === 0}
                onClick={() => { onReviewCards(); onCloseMobile(); }}
                className={`w-full pill-button p-3 text-[10px] disabled:opacity-20 shadow-vibrant transition-all flex items-center justify-center gap-2 ${
                  isDark ? 'bg-vintage-gold text-slate-900' : 'bg-vintage-teal text-white'
                }`}
             >
                <BookOpen className="w-3.5 h-3.5" /> Start Review
             </button>
          </section>
        </div>

        <div className={`p-8 border-t flex justify-center ${isDark ? 'border-slate-800' : 'border-vintage-cream'}`}>
            <p className={`text-[9px] font-display font-bold uppercase tracking-[0.3em] ${isDark ? 'text-slate-700' : 'text-vintage-teal/40'}`}>BoardVision v2.5</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;