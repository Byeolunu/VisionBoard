import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Save, Brain, FileCode, Layout, BookOpen, Layers, RefreshCw, GraduationCap, XCircle, RotateCcw, Plus, Trophy, Bookmark, Loader2, Sparkles, Send, CheckCircle2, Download, AlertCircle } from 'lucide-react';
import { AnalysisResult, Flashcard, SavedFlashcard } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import latex from 'react-syntax-highlighter/dist/esm/languages/prism/latex';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', tsx);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('latex', latex);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('mermaid', markdown);

interface CodeDisplayProps {
  result: AnalysisResult;
  onAction: (action: string) => void;
  onRegenerate: (instruction: string) => void;
  isProcessing: boolean;
  onSaveFlashcards: (cards: Flashcard[]) => void;
  onSaveSingleFlashcard: (card: Flashcard) => void;
  onSaveAnalysis: (result: AnalysisResult) => void;
  savedFlashcards: SavedFlashcard[];
  onRequestQuiz: () => Promise<void>;
  isGeneratingQuiz: boolean;
  theme: 'light' | 'dark';
}

const MermaidChart: React.FC<{ chart: string; theme: 'light' | 'dark' }> = ({ chart, theme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const cleanChartCode = (code: string) => {
    let cleaned = code.trim();
    // Remove markdown code blocks if present
    cleaned = cleaned.replace(/^```mermaid\s*/i, '');
    cleaned = cleaned.replace(/^```\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/i, '');
    
    // Ensure it starts with a valid mermaid keyword if missing
    if (!cleaned.toLowerCase().startsWith('flowchart') && 
        !cleaned.toLowerCase().startsWith('graph') && 
        !cleaned.toLowerCase().startsWith('sequence') &&
        !cleaned.toLowerCase().startsWith('class') &&
        !cleaned.toLowerCase().startsWith('state') &&
        !cleaned.toLowerCase().startsWith('erdiagram') &&
        !cleaned.toLowerCase().startsWith('gantt') &&
        !cleaned.toLowerCase().startsWith('pie')) {
      cleaned = 'flowchart TD\n' + cleaned;
    }
    return cleaned;
  };

  const renderChart = async () => {
    const mermaid = (window as any).mermaid;
    if (!containerRef.current || !chart || !mermaid) return;

    try {
      setError(null);
      const cleaned = cleanChartCode(chart);
      
      // Initialize mermaid
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'Plus Jakarta Sans',
      });

      const id = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
      
      // Use mermaid.render instead of mermaid.run for better React stability
      const { svg } = await mermaid.render(id, cleaned);
      
      if (containerRef.current) {
        containerRef.current.innerHTML = svg;
        // Make the SVG responsive
        const svgElement = containerRef.current.querySelector('svg');
        if (svgElement) {
          svgElement.style.width = '100%';
          svgElement.style.height = 'auto';
          svgElement.style.maxWidth = '100%';
        }
      }
    } catch (err: any) {
      console.error("Mermaid Render Error:", err);
      setError(err.message || "Failed to parse diagram syntax.");
    }
  };

  useEffect(() => {
    // Small delay to ensure Mermaid script is fully initialized and DOM is stable
    const timer = setTimeout(renderChart, 100);
    return () => clearTimeout(timer);
  }, [chart, theme]);

  if (error) {
    return (
      <div className={`w-full min-h-[300px] flex flex-col items-center justify-center p-10 text-center gap-6 border border-dashed rounded-3xl ${
        theme === 'dark' ? 'bg-slate-900/50 border-red-500/20' : 'bg-red-50/30 border-red-200'
      }`}>
        <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-2">Diagram Syntax Error</h4>
          <p className={`text-xs max-w-md mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            The AI generated a vision that is too complex for the current layout.
          </p>
        </div>
        <div className={`p-4 rounded-xl font-mono text-[10px] text-left overflow-auto max-w-full border ${
          theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-500' : 'bg-white border-red-100 text-red-400'
        }`}>
          {chart}
        </div>
        <button 
          onClick={renderChart}
          className={`pill-button px-6 py-2.5 text-[10px] flex items-center gap-2 ${
            theme === 'dark' ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-100 text-red-600 hover:bg-red-200'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" /> Re-attempt Visualization
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`w-full min-h-[500px] flex justify-center items-start p-10 rounded-2xl overflow-auto border shadow-inner transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950/50 border-slate-800' : 'bg-white/50 border-vintage-pink/20'
      }`} 
    />
  );
};

const CodeDisplay: React.FC<CodeDisplayProps> = ({ 
    result, 
    onRegenerate, 
    isProcessing,
    onSaveFlashcards,
    onSaveAnalysis,
    onRequestQuiz,
    isGeneratingQuiz,
    theme
}) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'code' | 'diagram' | 'notes' | 'quiz'>('explanation');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [allCardsSaved, setAllCardsSaved] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    if (result) {
        setSelectedCards(new Set());
        setQuizAnswers({});
        setQuizSubmitted(false);
        setSaved(false);
    }
  }, [result]);

  const handleCopy = () => {
    let textToCopy = result.code || result.explanation;
    if (activeTab === 'diagram') textToCopy = result.diagram || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSyntaxLanguage = () => {
    if (activeTab === 'diagram') return 'markdown';
    if (activeTab === 'code') {
        return result.suggestedLanguage?.toLowerCase() || 'typescript';
    }
    return 'markdown';
  };

  const calculateQuizScore = () => {
    if (!result.quiz) return 0;
    return result.quiz.reduce((score, q) => {
      return score + (quizAnswers[q.id] === q.correctAnswerIndex ? 1 : 0);
    }, 0);
  };

  const getGrade = (score: number, total: number) => {
    const ratio = score / total;
    if (ratio >= 0.9) return { label: 'S', color: 'text-vintage-gold' };
    if (ratio >= 0.8) return { label: 'A', color: 'text-vintage-teal' };
    if (ratio >= 0.7) return { label: 'B', color: 'text-vintage-pink' };
    return { label: 'C', color: 'text-slate-400' };
  };

  return (
    <div className={`flex flex-col h-full rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-vintage-pink/20'
    }`}>
      
      {/* Header */}
      <div className={`px-8 py-6 border-b flex items-center justify-between shrink-0 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-vintage-cream/30 border-vintage-cream'
      }`}>
         <div className="flex items-center gap-5">
             <div className="p-3 bg-vintage-teal text-white rounded-2xl shadow-vibrant">
                 {result.detectedType === 'code' ? <FileCode className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
             </div>
             <div>
                 <h2 className={`text-[10px] font-display font-bold uppercase tracking-[0.2em] mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-vintage-pink'}`}>Curation Node</h2>
                 <h3 className={`text-3xl font-script leading-none ${theme === 'dark' ? 'text-vintage-cream' : 'text-vintage-teal'}`}>{result.title}</h3>
             </div>
         </div>

         <div className="flex items-center gap-3">
             <button onClick={() => { onSaveAnalysis(result); setSaved(true); setTimeout(() => setSaved(false), 2000); }} 
                className={`pill-button px-6 py-2.5 text-[10px] border-2 transition-all flex items-center gap-2 ${
                  saved 
                    ? 'bg-vintage-gold border-vintage-gold text-white' 
                    : (theme === 'dark' ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-vintage-teal text-vintage-teal hover:bg-vintage-teal hover:text-white')
                }`}>
                {saved ? <Check className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
                {saved ? 'Archived' : 'Archive'}
             </button>
             <button onClick={handleCopy} className={`p-3 rounded-full border transition-all ${
               theme === 'dark' ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-vintage-teal/20 text-vintage-teal hover:bg-vintage-teal/5'
             }`}>
                {copied ? <Check className="w-4 h-4 text-vintage-gold" /> : <Copy className="w-4 h-4" />}
             </button>
         </div>
      </div>

      {/* Tabs */}
      <div className={`flex px-6 border-b overflow-x-auto no-scrollbar shrink-0 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-vintage-cream'
      }`}>
          {[
              { id: 'explanation', label: 'Walkthrough', icon: BookOpen },
              { id: 'code', label: 'Source Code', icon: FileCode },
              { id: 'diagram', label: 'Architecture', icon: Layout },
              { id: 'quiz', label: 'Check Point', icon: GraduationCap },
              { id: 'notes', label: 'Study Deck', icon: Layers },
          ].map((tab) => (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-6 py-5 text-[10px] font-display font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                      activeTab === tab.id 
                        ? (theme === 'dark' ? 'text-vintage-gold' : 'text-vintage-teal') 
                        : (theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-vintage-teal/40 hover:text-vintage-teal')
                  }`}
              >
                  <span className="flex items-center gap-2">
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </span>
                  {activeTab === tab.id && <div className={`absolute bottom-0 left-6 right-6 h-0.5 ${theme === 'dark' ? 'bg-vintage-gold' : 'bg-vintage-teal'}`} />}
              </button>
          ))}
      </div>

      {/* Content Area */}
      <div className={`flex-1 overflow-y-auto p-8 lg:p-12 relative transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-white'
      }`}>
         {activeTab === 'explanation' && (
             <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
                 <h1 className={`text-5xl font-script mb-8 ${theme === 'dark' ? 'text-vintage-gold' : 'text-vintage-teal'}`}>{result.title}</h1>
                 <div className={`markdown-content prose prose-stone lg:prose-lg leading-relaxed dark:prose-invert ${theme === 'dark' ? 'text-slate-300' : 'text-vintage-teal/80'}`}>
                    <ReactMarkdown 
                      remarkPlugins={[remarkMath]} 
                      rehypePlugins={[rehypeKatex]}
                    >
                      {result.explanation}
                    </ReactMarkdown>
                 </div>
             </div>
         )}

         {activeTab === 'code' && (
             <div className="absolute inset-0 bg-stone-900 overflow-auto scrollbar-thin">
                <SyntaxHighlighter
                    language={getSyntaxLanguage()}
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: '2rem', minHeight: '100%', fontSize: '14px', background: '#111' }}
                    showLineNumbers={true}
                >
                    {result.code || '// No code detected.'}
                </SyntaxHighlighter>
             </div>
         )}

         {activeTab === 'diagram' && (
             <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
                 {result.diagram ? (
                   <>
                    <MermaidChart chart={result.diagram} theme={theme} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {result.secondaryInfo.relatedConcepts?.map((rc, i) => (
                            <div key={i} className={`p-5 rounded-2xl border text-center transition-colors ${
                              theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-vintage-cream/30 border-vintage-pink/10 text-vintage-teal'
                            }`}>
                                <span className="font-bold text-xs uppercase tracking-widest">{rc}</span>
                            </div>
                        ))}
                    </div>
                   </>
                 ) : (
                    <div className={`flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-3xl ${
                      theme === 'dark' ? 'border-slate-800' : 'border-vintage-pink/20'
                    }`}>
                        <Layout className={`w-12 h-12 mb-6 opacity-30 ${theme === 'dark' ? 'text-slate-500' : 'text-vintage-pink'}`} />
                        <h4 className={`text-lg font-script ${theme === 'dark' ? 'text-slate-500' : 'text-vintage-teal'}`}>No chart generated.</h4>
                    </div>
                 )}
             </div>
         )}

         {activeTab === 'notes' && (
             <div className="max-w-5xl mx-auto">
                 <div className="flex items-center justify-between mb-12 flex-col sm:flex-row gap-6">
                    <div>
                      <h3 className={`text-4xl font-script italic ${theme === 'dark' ? 'text-vintage-gold' : 'text-vintage-teal'}`}>Study Moodboard</h3>
                      <p className={`text-[10px] uppercase font-bold tracking-widest mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-vintage-pink'}`}>Select items to curate them into your master deck</p>
                    </div>
                    <button 
                        onClick={() => {
                          const cardsToSave = result.flashcards?.filter((_, idx) => selectedCards.has(idx)) || [];
                          onSaveFlashcards(cardsToSave);
                          setAllCardsSaved(true);
                          setTimeout(() => setAllCardsSaved(false), 3000);
                        }}
                        disabled={selectedCards.size === 0}
                        className={`pill-button px-8 py-4 text-xs disabled:opacity-30 shadow-vibrant ${
                          theme === 'dark' ? 'bg-vintage-gold text-slate-900' : 'bg-vintage-teal text-white'
                        }`}
                    >
                        {allCardsSaved ? 'Added to Deck' : `Archive ${selectedCards.size} Cards`}
                    </button>
                 </div>
                 
                 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                     {result.flashcards?.length ? result.flashcards.map((card, idx) => (
                         <div 
                            key={idx} 
                            onClick={() => {
                              const next = new Set(selectedCards);
                              if (next.has(idx)) next.delete(idx);
                              else next.add(idx);
                              setSelectedCards(next);
                            }}
                            className={`polaroid cursor-pointer transition-all ${
                              theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'
                            } ${selectedCards.has(idx) ? 'ring-2 ring-vintage-teal scale-105 shadow-xl' : 'grayscale-[40%] opacity-80 hover:grayscale-0 hover:opacity-100'}`}
                            style={{ transform: `rotate(${idx % 2 === 0 ? 1 : -1}deg)` }}
                         >
                             <div className={`p-6 border-b mb-4 ${theme === 'dark' ? 'border-slate-700' : 'border-vintage-cream'}`}>
                                <span className={`text-[10px] font-display font-bold uppercase tracking-widest block mb-2 ${theme === 'dark' ? 'text-vintage-gold/60' : 'text-vintage-pink'}`}>Concept</span>
                                <h4 className={`text-xl font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-vintage-teal'}`}>{card.term}</h4>
                             </div>
                             <p className={`text-sm leading-relaxed italic ${theme === 'dark' ? 'text-slate-400' : 'text-vintage-teal/70'}`}>"{card.definition}"</p>
                         </div>
                     )) : (
                       <div className="col-span-full py-20 text-center">
                          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                          <p className="font-script text-2xl text-slate-500">No cards detected for this vision.</p>
                       </div>
                     )}
                 </div>
             </div>
         )}
         
         {activeTab === 'quiz' && (
           <div className="max-w-3xl mx-auto h-full flex flex-col">
             {!result.quiz ? (
               <div className="text-center my-auto">
                 <GraduationCap className={`w-20 h-20 mx-auto mb-6 opacity-40 ${theme === 'dark' ? 'text-vintage-gold' : 'text-vintage-pink'}`} />
                 <h3 className={`text-4xl font-script mb-4 ${theme === 'dark' ? 'text-vintage-gold' : 'text-vintage-teal'}`}>Validate Your Wisdom</h3>
                 <p className={`mb-10 max-w-sm mx-auto italic leading-relaxed text-center ${theme === 'dark' ? 'text-slate-500' : 'text-vintage-teal/60'}`}>Challenge yourself with inquiries based on your recent curation.</p>
                 <button 
                    onClick={onRequestQuiz}
                    disabled={isGeneratingQuiz}
                    className={`pill-button px-10 py-5 shadow-vibrant ${theme === 'dark' ? 'bg-vintage-gold text-slate-900' : 'bg-vintage-teal text-white'}`}
                 >
                    {isGeneratingQuiz ? 'Designing...' : 'Start Intelligence Check'}
                 </button>
               </div>
             ) : (
               <div className="w-full space-y-10 pb-20 pt-10">
                  <div className="text-center mb-12">
                     <h3 className={`text-5xl font-script ${theme === 'dark' ? 'text-vintage-gold' : 'text-vintage-teal'}`}>Knowledge Check</h3>
                     <p className={`text-[10px] font-display font-bold tracking-widest uppercase mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-vintage-pink'}`}>Personalized Assessment</p>
                  </div>
                  
                  {result.quiz.map((q, idx) => (
                    <div key={q.id} className={`p-8 border-b last:border-0 animate-in slide-in-from-bottom-2 ${theme === 'dark' ? 'border-slate-800' : 'border-vintage-cream'}`}>
                      <div className="flex gap-6 mb-8">
                        <span className={`text-5xl font-script leading-none opacity-50 ${theme === 'dark' ? 'text-vintage-gold' : 'text-vintage-pink'}`}>{idx + 1}.</span>
                        <h4 className={`text-2xl font-bold leading-tight ${theme === 'dark' ? 'text-slate-200' : 'text-vintage-teal'}`}>{q.question}</h4>
                      </div>
                      <div className="grid gap-4 ml-14">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = quizAnswers[q.id] === oIdx;
                          const isCorrect = oIdx === q.correctAnswerIndex;
                          
                          let btnClass = "w-full text-left px-8 py-5 rounded-2xl border-2 transition-all font-bold text-sm flex justify-between items-center ";
                          
                          if (quizSubmitted) {
                             if (isCorrect) btnClass += "bg-vintage-teal text-white border-vintage-teal ring-4 ring-vintage-pink/20";
                             else if (isSelected) btnClass += "bg-red-500/10 text-red-500 border-red-500/30";
                             else btnClass += theme === 'dark' ? "bg-slate-950 border-slate-800 text-slate-700 opacity-40" : "bg-vintage-cream/10 border-vintage-teal/5 text-vintage-teal/30 grayscale";
                          } else {
                             if (isSelected) btnClass += theme === 'dark' ? "bg-vintage-gold text-slate-950 border-vintage-gold shadow-lg scale-[1.02]" : "bg-vintage-teal text-white border-vintage-teal shadow-lg scale-[1.02]";
                             else btnClass += theme === 'dark' ? "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500" : "bg-vintage-cream/20 border-vintage-teal/10 text-vintage-teal hover:border-vintage-teal/30";
                          }

                          return (
                            <button 
                              key={oIdx}
                              disabled={quizSubmitted}
                              onClick={() => setQuizAnswers(prev => ({...prev, [q.id]: oIdx}))}
                              className={btnClass}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5" />}
                              {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                            </button>
                          );
                        })}
                      </div>
                      {quizSubmitted && q.explanation && (
                         <div className={`mt-6 ml-14 p-5 rounded-xl text-xs italic leading-relaxed border ${
                           theme === 'dark' ? 'bg-slate-950/50 border-slate-800 text-slate-500' : 'bg-vintage-cream/30 border-vintage-pink/10 text-vintage-teal/60'
                         }`}>
                           <span className="font-bold uppercase tracking-widest text-[9px] mb-1 block">Contextual Insight</span>
                           {q.explanation}
                         </div>
                      )}
                    </div>
                  ))}

                  {quizSubmitted ? (
                    <div className={`mt-20 p-12 rounded-[40px] border-2 border-dashed text-center animate-in zoom-in-95 ${
                      theme === 'dark' ? 'bg-slate-800/50 border-vintage-gold/20' : 'bg-vintage-cream/20 border-vintage-teal/20'
                    }`}>
                        <Trophy className={`w-16 h-16 mx-auto mb-6 ${theme === 'dark' ? 'text-vintage-gold' : 'text-vintage-teal'}`} />
                        <h4 className={`text-5xl font-script mb-2 ${theme === 'dark' ? 'text-vintage-gold' : 'text-vintage-teal'}`}>Assessment Summary</h4>
                        <div className="flex items-center justify-center gap-10 mt-8 mb-12">
                           <div className="text-center">
                              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-slate-500' : 'text-vintage-pink'}`}>Score</p>
                              <p className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-vintage-teal'}`}>{calculateQuizScore()} / {result.quiz.length}</p>
                           </div>
                           <div className="w-px h-12 bg-vintage-pink/20" />
                           <div className="text-center">
                              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-slate-500' : 'text-vintage-pink'}`}>Grade</p>
                              <p className={`text-4xl font-bold ${getGrade(calculateQuizScore(), result.quiz.length).color}`}>{getGrade(calculateQuizScore(), result.quiz.length).label}</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
                          className={`pill-button px-10 py-5 flex items-center gap-3 mx-auto ${
                            theme === 'dark' ? 'bg-vintage-gold text-slate-900' : 'bg-vintage-teal text-white'
                          }`}
                        >
                          <RotateCcw className="w-4 h-4" /> Reset Assessment
                        </button>
                    </div>
                  ) : (
                    <div className="flex justify-center pt-8">
                      <button 
                        disabled={Object.keys(quizAnswers).length < result.quiz.length}
                        onClick={() => setQuizSubmitted(true)} 
                        className={`pill-button px-16 py-6 shadow-vibrant text-sm disabled:opacity-30 ${
                          theme === 'dark' ? 'bg-vintage-gold text-slate-900' : 'bg-vintage-teal text-white'
                        }`}
                      >
                        Finalize Assessment
                      </button>
                    </div>
                  )}
               </div>
             )}
           </div>
         )}
      </div>
    </div>
  );
};

export default CodeDisplay;