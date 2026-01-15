
import React, { useState, useEffect } from 'react';
import { ViewMode, SurveyOption, SurveyResponse, User } from './types';
import UserView from './components/UserView';
import AdminView from './components/AdminView';
import LoginView from './components/LoginView';
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
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('current_user');
    return saved ? JSON.parse(saved) : null;
  });

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

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('current_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('current_user');
    }
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addResponse = (rankings: Record<number, string>) => {
    if (!currentUser) return;

    // Check if user already voted
    const alreadyVoted = responses.find(r => r.userId === currentUser.id);
    if (alreadyVoted && currentUser.role !== 'ADMIN') {
      alert('이미 투표에 참여하셨습니다. 결과 발표를 기다려 주세요!');
      return;
    }

    const newResponse: SurveyResponse = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      userName: currentUser.name,
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

  // Determine view based on user role
  const viewMode: ViewMode = currentUser 
    ? (currentUser.role === 'ADMIN' ? 'ADMIN' : 'USER') 
    : 'LOGIN';

  return (
    <Layout viewMode={viewMode} user={currentUser} onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto py-8">
        {viewMode === 'LOGIN' && <LoginView onLogin={handleLogin} />}
        {viewMode === 'USER' && (
          <UserView 
            options={options} 
            onSubmit={addResponse} 
          />
        )}
        {viewMode === 'ADMIN' && (
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
