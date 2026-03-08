import React, { useState, useMemo } from 'react';
import { questions, personalityDescriptions, Dimension } from './data';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';

type AppState = 'start' | 'test' | 'result';

const colorMap: Record<Dimension, string> = {
  E: '#3282E6', I: '#1D556A',
  S: '#3BA754', N: '#7A51B3',
  T: '#E63833', F: '#F464A3',
  J: '#F5B82E', P: '#F37329'
};

const labelMap: Record<Dimension, string> = {
  E: '外向', I: '內向',
  S: '實際', N: '直覺',
  T: '思考', F: '感覺',
  J: '判斷', P: '感知'
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
    <div className="min-h-screen bg-[#F4F4F5] text-zinc-800 font-sans flex flex-col items-center justify-center p-4 md:p-8">
      <AnimatePresence mode="wait">
        {appState === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl w-full bg-white rounded-3xl shadow-xl shadow-zinc-200/50 overflow-hidden"
          >
            <div className="p-8 md:p-12 text-center">
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-10 max-w-md mx-auto">
                {(Object.keys(colorMap) as Dimension[]).map(dim => (
                  <div key={dim} className="h-2 rounded-full" style={{ backgroundColor: colorMap[dim] }}></div>
                ))}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-zinc-900">
                MBTI 性格測試
              </h1>
              
              <p className="text-zinc-500 mb-10 leading-relaxed max-w-lg mx-auto text-lg">
                該問卷用於揭示你是如何看待事物、如何做決定，答案無好壞之分。問卷結果有助於了解自己的職業傾向、個性特徵、人際相處的特徵。
                <br /><br />
                <span className="font-medium text-zinc-700">共 93 題，請根據第一感覺回答即可。</span>
              </p>
              
              <button
                onClick={handleStart}
                className="bg-zinc-900 hover:bg-zinc-800 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center gap-3"
              >
                開始測試 <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}

        {appState === 'test' && (
          <motion.div
            key="test"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl w-full"
          >
            <div className="mb-8 bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
              <div className="flex justify-between text-sm text-zinc-500 font-bold mb-4">
                <span>測驗進度</span>
                <span className="text-zinc-900">{currentQuestionIndex + 1} / {questions.length}</span>
              </div>
              <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-zinc-900 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-md shadow-zinc-200/50 border border-zinc-100 p-8 md:p-12 min-h-[360px] flex flex-col">
              <h2 className="text-2xl md:text-3xl font-bold leading-snug mb-10 flex-grow text-zinc-800">
                <span className="text-zinc-400 mr-4 text-xl">{currentQuestionIndex + 1}.</span>
                {questions[currentQuestionIndex].text}
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => handleAnswer('A')}
                  className="w-full text-left p-6 rounded-2xl border-2 border-zinc-100 hover:border-zinc-900 hover:bg-zinc-50 transition-all font-medium text-lg text-zinc-700 hover:text-zinc-900 group"
                >
                  <span className="inline-block w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 text-center leading-8 mr-4 group-hover:bg-zinc-900 group-hover:text-white transition-colors">A</span>
                  {questions[currentQuestionIndex].optionA}
                </button>
                <button
                  onClick={() => handleAnswer('B')}
                  className="w-full text-left p-6 rounded-2xl border-2 border-zinc-100 hover:border-zinc-900 hover:bg-zinc-50 transition-all font-medium text-lg text-zinc-700 hover:text-zinc-900 group"
                >
                  <span className="inline-block w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 text-center leading-8 mr-4 group-hover:bg-zinc-900 group-hover:text-white transition-colors">B</span>
                  {questions[currentQuestionIndex].optionB}
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-8 py-4 rounded-2xl font-bold transition-all ${
                  currentQuestionIndex === 0
                    ? 'text-zinc-400 bg-zinc-200 cursor-not-allowed opacity-50'
                    : 'text-zinc-700 bg-white shadow-sm hover:shadow-md hover:bg-zinc-50 border border-zinc-200'
                }`}
              >
                上一題
              </button>
            </div>
          </motion.div>
        )}

        {appState === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl w-full"
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-zinc-200/50 overflow-hidden">
              <div className="bg-zinc-50 border-b border-zinc-100 p-10 md:p-16 text-center">
                <p className="text-zinc-500 font-bold tracking-widest uppercase mb-8">您的性格類型是</p>
                
                <div className="flex justify-center gap-3 md:gap-6 mb-8">
                  {result.type.split('').map((letter, i) => (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      key={i}
                      className="w-16 h-20 md:w-24 md:h-28 flex items-center justify-center text-4xl md:text-6xl font-black text-white rounded-2xl shadow-lg"
                      style={{ backgroundColor: colorMap[letter as Dimension] }}
                    >
                      {letter}
                    </motion.div>
                  ))}
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">
                  {personalityDescriptions[result.type]?.title}
                </h2>
              </div>
              
              <div className="p-8 md:p-12">
                <div className="mb-12 bg-zinc-50 p-6 md:p-8 rounded-3xl border border-zinc-100">
                  <h3 className="text-xl font-bold mb-4 text-zinc-900 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-zinc-900 rounded-full"></div>
                    性格特徵描述
                  </h3>
                  <p className="text-zinc-600 leading-relaxed text-lg">
                    {personalityDescriptions[result.type]?.desc}
                  </p>
                </div>

                <h3 className="text-xl font-bold mb-6 text-zinc-900 text-center">維度傾向分析</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <ScoreCard dim1="E" dim2="I" val1={result.scores.E} val2={result.scores.I} diff={result.ieDiff} />
                  <ScoreCard dim1="S" dim2="N" val1={result.scores.S} val2={result.scores.N} diff={result.snDiff} />
                  <ScoreCard dim1="T" dim2="F" val1={result.scores.T} val2={result.scores.F} diff={result.tfDiff} />
                  <ScoreCard dim1="J" dim2="P" val1={result.scores.J} val2={result.scores.P} diff={result.pjDiff} />
                </div>

                <div className="flex justify-center pt-8 border-t border-zinc-100">
                  <button
                    onClick={handleStart}
                    className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 font-bold transition-all px-8 py-4 rounded-2xl hover:bg-zinc-100"
                  >
                    <RotateCcw className="w-5 h-5" /> 重新測試
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
  const isClose = Math.abs(val1 - val2) <= 2;
  const total = val1 + val2 || 1;
  const pct1 = (val1 / total) * 100;
  const pct2 = (val2 / total) * 100;
  
  return (
    <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between mb-4 text-sm font-bold">
        <div className="flex flex-col items-start">
          <span className="text-2xl mb-1" style={{ color: colorMap[dim1] }}>{dim1}</span>
          <span className="text-zinc-500">{labelMap[dim1]}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl mb-1" style={{ color: colorMap[dim2] }}>{dim2}</span>
          <span className="text-zinc-500">{labelMap[dim2]}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-end mb-3">
        <span className="text-xl font-bold text-zinc-800">{val1}</span>
        <span className="text-xl font-bold text-zinc-800">{val2}</span>
      </div>
      
      <div className="h-4 w-full flex rounded-full overflow-hidden bg-zinc-100">
        <div style={{ width: `${pct1}%`, backgroundColor: colorMap[dim1] }} className="h-full transition-all duration-1000 ease-out"></div>
        <div style={{ width: `${pct2}%`, backgroundColor: colorMap[dim2] }} className="h-full transition-all duration-1000 ease-out"></div>
      </div>
      
      {isClose && (
        <div className="text-xs text-zinc-500 mt-5 pt-4 border-t border-zinc-100 text-center font-medium">
          分數接近，轉換值: {diff.toFixed(2)}
        </div>
      )}
    </div>
  );
}
