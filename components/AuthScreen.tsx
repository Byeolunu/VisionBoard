import React, { useState } from 'react';
import { Brain, Lock, ArrowRight, Mail, Sparkles, Cpu } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: { name: string; email: string }) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ name: email.split('@')[0], email });
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-vintage-cream font-sans text-vintage-teal">
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-stripes items-center justify-center p-12 border-r border-vintage-pink/20">
        <div className="relative z-10 max-w-xl text-center">
            <div className="w-24 h-24 bg-vintage-teal rounded-full mb-10 flex items-center justify-center shadow-2xl mx-auto">
                <Brain className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-8xl font-script text-vintage-teal leading-none mb-6">BoardVision</h1>
            <p className="text-2xl text-vintage-teal/70 italic leading-relaxed mb-12">
                "Second chances, first-class code."
            </p>
            <div className="grid grid-cols-2 gap-8 text-[10px] uppercase tracking-widest font-bold text-vintage-pink">
              <div className="flex items-center justify-center gap-3"><Sparkles className="w-4 h-4" /> Vision Synthesis</div>
              <div className="flex items-center justify-center gap-3"><Cpu className="w-4 h-4" /> Logic Curation</div>
            </div>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md space-y-12">
            <div className="text-center">
                <h2 className="text-5xl font-script text-vintage-teal mb-4">
                    {isLogin ? 'Access the Desk' : 'Join the Workspace'}
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-vintage-pink">
                    {isLogin ? 'Enter your credentials to proceed.' : 'Initialize your engineering account.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold text-vintage-pink uppercase tracking-widest mb-3">Electronic Mail</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vintage-teal/30" />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-vintage-cream/20 border border-vintage-teal/10 focus:border-vintage-teal rounded-2xl py-4 pl-12 pr-4 text-vintage-teal placeholder-vintage-teal/20 outline-none transition-all"
                                placeholder="engineer@boardvision.ai"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-vintage-pink uppercase tracking-widest mb-3">Authorization Key</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vintage-teal/30" />
                            <input 
                                type="password" 
                                required
                                className="w-full bg-vintage-cream/20 border border-vintage-teal/10 focus:border-vintage-teal rounded-2xl py-4 pl-12 pr-4 text-vintage-teal placeholder-vintage-teal/20 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-vintage-teal hover:bg-vintage-tealHover text-white pill-button py-5 shadow-vibrant transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                    {loading ? 'SYNCHRONIZING...' : (isLogin ? 'ENTER WORKSPACE' : 'INITIALIZE ACCOUNT')}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
            </form>

            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-vintage-teal/40">
                {isLogin ? "New Recruit?" : "Already Verified?"}
                <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-vintage-pink hover:text-vintage-teal transition-colors"
                >
                    {isLogin ? 'Create Workspace' : 'Sign In'}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;