import React, { useState, useMemo } from 'react';
import { questions, personalityDescriptions, Dimension } from './data';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, RotateCcw, ArrowLeft, Brain } from 'lucide-react';

type AppState = 'start' | 'test' | 'result';

const labelMap: Record<Dimension, string> = {
  E: '外向 (Extraversion)', I: '內向 (Introversion)',
  S: '實感 (Sensing)', N: '直覺 (Intuition)',
  T: '思考 (Thinking)', F: '情感 (Feeling)',
  J: '判斷 (Judging)', P: '感知 (Perceiving)'
};

export default function App() {
  const [appState, setAppState] = useState<AppState>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});

  const handleStart = () => {
    setAppState('test');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswer = (option: 'A' | 'B') => {
    const question = questions[currentQuestionIndex];
    setAnswers(prev => ({ ...prev, [question.id]: option }));
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setAppState('result');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const result = useMemo(() => {
    if (appState !== 'result') return null;

    const scores: Record<Dimension, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    questions.forEach(q => {
      const ans = answers[q.id];
      if (ans === 'A') {
        scores[q.dimA]++;
      } else if (ans === 'B') {
        scores[q.dimB]++;
      }
    });

    const pjDiff = ((scores.P - scores.J) / 22) * 10;
    const snDiff = ((scores.S - scores.N) / 26) * 10;
    const ieDiff = ((scores.I - scores.E) / 21) * 10;
    const tfDiff = ((scores.T - scores.F) / 24) * 10;

    const type = [
      ieDiff >= 0 ? 'I' : 'E',
      snDiff >= 0 ? 'S' : 'N',
      tfDiff >= 0 ? 'T' : 'F',
      pjDiff >= 0 ? 'P' : 'J'
    ].join('');

    return { scores, type, pjDiff, snDiff, ieDiff, tfDiff };
  }, [appState, answers]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F9FAFB] font-sans flex flex-col items-center justify-center p-4 md:p-8 selection:bg-[#5B6CFF]/30">
      <AnimatePresence mode="wait">
        {appState === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl w-full bg-[#1F2937] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-white/5 overflow-hidden"
          >
            <div className="p-10 md:p-16 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-[#111827] border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                <Brain className="w-7 h-7 text-[#5B6CFF]" />
              </div>
              
              <h1 className="text-[32px] font-bold mb-6 text-[#F9FAFB] tracking-tight">
                MBTI 性格測試
              </h1>
              
              <p className="text-[14px] font-normal text-[#9CA3AF] mb-10 leading-relaxed max-w-lg">
                這份測驗旨在揭示你如何看侍事物以及如何做決定。答案沒有對錯之分。結果將幫助你了解自己的職業偏好、人格特質和社交特徵。
              </p>
              
              <p className="text-[14px] font-medium text-[#F9FAFB] mb-10">
                共 93 題 • 預計耗時 10 分鐘
              </p>
              
              <button
                onClick={handleStart}
                className="bg-[#5B6CFF] hover:bg-[#4a5be6] text-white px-8 py-3.5 rounded-full text-[14px] font-semibold transition-all duration-200 inline-flex items-center gap-2 shadow-lg shadow-[#5B6CFF]/20 active:scale-[0.98]"
              >
                開始測試 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {appState === 'test' && (
          <motion.div
            key="test"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl w-full"
          >
            <div className="bg-[#1F2937] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-white/5 overflow-hidden flex flex-col">
              {/* Card Header with Navigation */}
              <div className="px-8 pt-8 flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 ${
                    currentQuestionIndex === 0
                      ? 'text-[#9CA3AF]/30 cursor-not-allowed'
                      : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/5'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> 上一題
                </button>
                
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-medium text-[#9CA3AF]">
                    進度 <span className="text-[#F9FAFB] font-bold">{currentQuestionIndex + 1}</span> / {questions.length}
                  </span>
                  <div className="w-24 h-1 bg-[#111827] rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#5B6CFF] to-[#8E5CF4] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12 pt-10 md:pt-14 min-h-[360px] flex flex-col">
                <h2 className="text-[24px] md:text-[28px] font-bold leading-tight mb-12 flex-grow text-[#F9FAFB] tracking-tight">
                  {questions[currentQuestionIndex].text}
                </h2>

                <div className="space-y-4">
                  <button
                    onClick={() => handleAnswer('A')}
                    className="w-full text-left p-5 rounded-xl border border-white/5 bg-[#111827] hover:border-[#5B6CFF]/40 hover:bg-[#111827]/80 active:scale-[0.995] transition-all duration-200 text-[15px] font-normal text-[#F9FAFB] group flex items-center shadow-sm"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 text-[#9CA3AF] text-[13px] font-bold flex items-center justify-center mr-4 group-hover:bg-[#5B6CFF] group-hover:text-white transition-all duration-200">A</span>
                    <span className="flex-grow">{questions[currentQuestionIndex].optionA}</span>
                  </button>
                  <button
                    onClick={() => handleAnswer('B')}
                    className="w-full text-left p-5 rounded-xl border border-white/5 bg-[#111827] hover:border-[#5B6CFF]/40 hover:bg-[#111827]/80 active:scale-[0.995] transition-all duration-200 text-[15px] font-normal text-[#F9FAFB] group flex items-center shadow-sm"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 text-[#9CA3AF] text-[13px] font-bold flex items-center justify-center mr-4 group-hover:bg-[#5B6CFF] group-hover:text-white transition-all duration-200">B</span>
                    <span className="flex-grow">{questions[currentQuestionIndex].optionB}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {appState === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl w-full"
          >
            <div className="bg-[#1F2937] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-white/5 overflow-hidden">
              <div className="p-8 md:p-12 text-center border-b border-white/5 bg-[#111827]/50">
                <p className="text-[#9CA3AF] text-[12px] font-medium uppercase tracking-widest mb-6">你的性格類型為</p>
                
                <div className="flex justify-center gap-3 mb-6">
                  {result.type.split('').map((letter, i) => (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1 + 0.2 }}
                      key={i}
                      className="w-14 h-16 flex items-center justify-center text-[28px] font-bold text-white rounded-xl bg-gradient-to-b from-[#5B6CFF] to-[#8E5CF4] shadow-sm border border-white/10"
                    >
                      {letter}
                    </motion.div>
                  ))}
                </div>

                <h1 className="text-[28px] font-bold text-[#F9FAFB]">
                  {personalityDescriptions[result.type]?.title}
                </h1>
              </div>
              
              <div className="p-8 md:p-10">
                <div className="mb-10">
                  <h2 className="text-[14px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-4">分析描述</h2>
                  <div className="bg-[#111827] p-6 rounded-xl border border-white/5">
                    <p className="text-[#F9FAFB] text-[14px] leading-relaxed">
                      {personalityDescriptions[result.type]?.desc}
                    </p>
                  </div>
                </div>

                <div className="mb-10">
                  <h2 className="text-[14px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-4">維度分析</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ScoreCard dim1="E" dim2="I" val1={result.scores.E} val2={result.scores.I} diff={result.ieDiff} />
                    <ScoreCard dim1="S" dim2="N" val1={result.scores.S} val2={result.scores.N} diff={result.snDiff} />
                    <ScoreCard dim1="T" dim2="F" val1={result.scores.T} val2={result.scores.F} diff={result.tfDiff} />
                    <ScoreCard dim1="J" dim2="P" val1={result.scores.J} val2={result.scores.P} diff={result.pjDiff} />
                  </div>
                </div>

                <div className="flex justify-start pt-6 border-t border-white/5">
                  <button
                    onClick={handleStart}
                    className="flex items-center gap-2 text-[#F9FAFB] bg-[#111827] border border-white/10 hover:bg-white/5 active:scale-[0.98] text-[14px] font-medium transition-all duration-200 px-5 py-2.5 rounded-xl shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4" /> 重新測試
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScoreCard({ dim1, dim2, val1, val2, diff }: { dim1: Dimension, dim2: Dimension, val1: number, val2: number, diff: number }) {
  const total = val1 + val2 || 1;
  const pct1 = (val1 / total) * 100;
  const pct2 = (val2 / total) * 100;
  const isClose = Math.abs(val1 - val2) <= 2;
  
  return (
    <div className="bg-[#111827] p-5 rounded-xl border border-white/5">
      <div className="flex justify-between mb-3">
        <div className="flex flex-col items-start">
          <span className="text-[14px] font-semibold text-[#F9FAFB] mb-0.5">{labelMap[dim1]}</span>
          <span className="text-[12px] font-normal text-[#9CA3AF]">{val1} 分</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[14px] font-semibold text-[#F9FAFB] mb-0.5">{labelMap[dim2]}</span>
          <span className="text-[12px] font-normal text-[#9CA3AF]">{val2} 分</span>
        </div>
      </div>
      
      <div className="h-1.5 w-full flex rounded-full overflow-hidden bg-[#1F2937]">
        <div style={{ width: `${pct1}%` }} className="h-full bg-[#5B6CFF] transition-all duration-1000 ease-out"></div>
        <div style={{ width: `${pct2}%` }} className="h-full bg-[#8E5CF4] transition-all duration-1000 ease-out"></div>
      </div>
      
      {isClose && (
        <div className="mt-3 text-[12px] font-normal text-[#F59E0B] flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>
          數值接近，類型偏向可能較不明顯
        </div>
      )}
    </div>
  );
}
