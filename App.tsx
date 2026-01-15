
import React, { useState, useEffect } from 'react';
import { ViewMode, SurveyOption, SurveyResponse } from './types';
import UserView from './components/UserView';
import AdminView from './components/AdminView';
import { Layout } from './components/Layout';

const DEFAULT_OPTIONS: SurveyOption[] = [
  { id: '1', label: '복면가왕 A' },
  { id: '2', label: '복면가왕 B' },
  { id: '3', label: '복면가왕 C' },
  { id: '4', label: '복면가왕 D' },
  { id: '5', label: '복면가왕 E' },
  { id: '6', label: '복면가왕 F' },
  { id: '7', label: '복면가왕 G' },
  { id: '8', label: '복면가왕 H' },
  { id: '9', label: '복면가왕 I' },
  { id: '10', label: '복면가왕 J' }
];

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('USER');
  const [options, setOptions] = useState<SurveyOption[]>(() => {
    const saved = localStorage.getItem('survey_options');
    return saved ? JSON.parse(saved) : DEFAULT_OPTIONS;
  });
  const [responses, setResponses] = useState<SurveyResponse[]>(() => {
    const saved = localStorage.getItem('survey_responses');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('survey_options', JSON.stringify(options));
  }, [options]);

  useEffect(() => {
    localStorage.setItem('survey_responses', JSON.stringify(responses));
  }, [responses]);

  const addResponse = (rankings: Record<number, string>) => {
    const newResponse: SurveyResponse = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      rankings
    };
    setResponses(prev => [...prev, newResponse]);
    alert('당신의 소중한 투표가 정상적으로 집계되었습니다. 각성의 무대를 기대해 주세요!');
  };

  const updateOptions = (newOptions: SurveyOption[]) => {
    setOptions(newOptions);
  };

  const clearResponses = () => {
    if (window.confirm('모든 차트 데이터를 초기화하시겠습니까?')) {
      setResponses([]);
    }
  };

  return (
    <Layout viewMode={viewMode} setViewMode={setViewMode}>
      <div className="max-w-7xl mx-auto py-8">
        {viewMode === 'USER' ? (
          <UserView 
            options={options} 
            onSubmit={addResponse} 
          />
        ) : (
          <AdminView 
            options={options} 
            responses={responses} 
            onUpdateOptions={updateOptions}
            onClearResponses={clearResponses}
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
