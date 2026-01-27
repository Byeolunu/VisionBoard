import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, BookOpen, Layers, PlusCircle } from 'lucide-react';
import { SavedFlashcard } from '../types';

interface FlashcardReviewProps {
  cards: SavedFlashcard[];
  onClose: () => void;
  theme?: 'light' | 'dark';
}

const FlashcardReview: React.FC<FlashcardReviewProps> = ({ cards, onClose, theme = 'light' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const isDark = theme === 'dark';

  // Handle empty state
  if (cards.length === 0) {
    return (
      <div className={`fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500 bg-stripes ${
        isDark ? 'bg-slate-950' : 'bg-vintage-cream'
      }`}>
        <div className={`rounded-[40px] p-12 max-w-lg w-full text-center shadow-2xl border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-vintage-pink/20'
        }`}>
          <div className="w-24 h-24 bg-vintage-pink/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Layers className={`w-12 h-12 opacity-40 ${isDark ? 'text-vintage-gold' : 'text-vintage-teal'}`} />
          </div>
          <h2 className={`text-5xl font-script mb-4 ${isDark ? 'text-vintage-gold' : 'text-vintage-teal'}`}>The Desk is Empty</h2>
          <p className={`font-display font-bold uppercase tracking-widest text-[10px] mb-10 leading-relaxed ${isDark ? 'text-slate-400' : 'text-vintage-teal/60'}`}>
            Archive cards from your "Study Deck" tab after an analysis to start building your mastery collection.
          </p>
          <button 
            onClick={onClose}
            className={`w-full pill-button py-5 shadow-vibrant transition-all active:scale-95 ${
              isDark ? 'bg-vintage-gold text-slate-900' : 'bg-vintage-teal text-white'
            }`}
          >
            Return to Workspace
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 150);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
      }, 150);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className={`fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in zoom-in-95 duration-500 bg-stripes ${
        isDark ? 'bg-slate-950' : 'bg-vintage-cream'
      }`}>
        <div className={`rounded-[40px] p-12 max-w-lg w-full text-center shadow-2xl border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-vintage-pink/20'
        }`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-vibrant ${
            isDark ? 'bg-vintage-gold' : 'bg-vintage-teal'
          }`}>
            <CheckCircle2 className={`w-12 h-12 ${isDark ? 'text-slate-900' : 'text-white'}`} />
          </div>
          <h2 className={`text-6xl font-script mb-4 ${isDark ? 'text-vintage-gold' : 'text-vintage-teal'}`}>Mastery Achieved</h2>
          <p className={`font-display font-bold uppercase tracking-widest text-[10px] mb-10 leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-vintage-teal/60'
          }`}>
            You've curated all {cards.length} visions in this collection.
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={handleRestart}
              className={`w-full pill-button py-5 shadow-vibrant flex items-center justify-center gap-3 transition-all active:scale-95 ${
                isDark ? 'bg-vintage-gold text-slate-900' : 'bg-vintage-teal text-white'
              }`}
            >
              <RotateCcw className="w-5 h-5" />
              Review Again
            </button>
            <button 
              onClick={onClose}
              className={`w-full border-2 pill-button py-5 transition-all ${
                isDark ? 'border-vintage-gold text-vintage-gold hover:bg-vintage-gold/10' : 'border-vintage-teal text-vintage-teal hover:bg-vintage-teal/5'
              }`}
            >
              Back to Workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 overflow-hidden animate-in fade-in duration-300 bg-stripes ${
      isDark ? 'bg-slate-950' : 'bg-vintage-cream'
    }`}>
      <button 
        onClick={onClose}
        className={`absolute top-8 right-8 p-4 rounded-full transition-all hover:rotate-90 z-20 shadow-lg ${
          isDark ? 'bg-vintage-gold text-slate-900' : 'bg-vintage-teal text-white'
        }`}
      >
        <X className="w-6 h-6" />
      </button>

      <div className="w-full max-w-3xl flex flex-col items-center z-10">
        {/* Progress bar */}
        <div className="w-full mb-16 max-w-xl">
          <div className="flex items-center justify-between mb-4">
             <span className={`text-[10px] font-display font-bold uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-vintage-teal'}`}>Curation Progress</span>
             <span className="text-[10px] font-display font-bold text-vintage-pink">{currentIndex + 1} / {cards.length}</span>
          </div>
          <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-vintage-teal/10'}`}>
             <div 
               className={`h-full transition-all duration-700 ${isDark ? 'bg-vintage-gold' : 'bg-vintage-teal'}`} 
               style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
             ></div>
          </div>
        </div>

        {/* Polaroid Card Container */}
        <div 
          className="relative w-full max-w-xl aspect-square cursor-pointer perspective-1000 group"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Front Side - Concept */}
            <div className={`absolute inset-0 backface-hidden rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-polaroid border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
            }`}>
                <span className={`text-[10px] font-display font-bold uppercase tracking-widest mb-8 opacity-60 ${isDark ? 'text-vintage-gold' : 'text-vintage-pink'}`}>The Concept</span>
                <h3 className={`text-4xl sm:text-5xl font-script leading-tight ${isDark ? 'text-vintage-cream' : 'text-vintage-teal'}`}>
                  {currentCard.term}
                </h3>
                <div className={`mt-auto flex items-center gap-2 text-[9px] font-display font-bold uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-vintage-teal/40'}`}>
                   <BookOpen className="w-4 h-4" /> Tap to reveal vision
                </div>
            </div>

            {/* Back Side - Definition */}
            <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-polaroid ${
              isDark ? 'bg-slate-800' : 'bg-vintage-teal'
            }`}>
                <span className={`text-[10px] font-display font-bold uppercase tracking-widest mb-8 ${isDark ? 'text-vintage-gold/40' : 'text-white/40'}`}>The Insight</span>
                <p className={`text-xl sm:text-2xl font-bold italic leading-relaxed font-sans px-4 ${isDark ? 'text-vintage-gold' : 'text-white'}`}>
                  "{currentCard.definition}"
                </p>
                <div className={`mt-auto flex items-center gap-2 text-[9px] font-display font-bold uppercase tracking-widest ${isDark ? 'text-vintage-gold/20' : 'text-white/40'}`}>
                   <CheckCircle2 className="w-4 h-4" /> Mastery Confirmed
                </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-8 mt-16">
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              disabled={currentIndex === 0}
              className={`p-6 rounded-full shadow-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed active:scale-90 ${
                isDark ? 'bg-slate-900 text-vintage-gold' : 'bg-white text-vintage-teal'
              }`}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}
              className={`px-16 py-6 pill-button shadow-vibrant transition-all hover:scale-105 active:scale-95 ${
                isDark ? 'bg-vintage-gold text-slate-900' : 'bg-vintage-teal text-white'
              }`}
            >
              FLIP VISION
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className={`p-6 rounded-full shadow-xl transition-all active:scale-90 ${
                isDark ? 'bg-slate-900 text-vintage-gold' : 'bg-white text-vintage-teal'
              }`}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
        </div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default FlashcardReview;