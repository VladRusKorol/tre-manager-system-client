import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'devextreme/dist/css/dx.common.css'; // Базовые стили (обязательно для v21)
import 'devextreme/dist/css/dx.material.blue.light.compact.css'; // Ваша тема
import { HashRouter } from 'react-router-dom';

import { locale, loadMessages } from 'devextreme/localization';
import ruMessages from 'devextreme/localization/messages/ru.json';
import { ToastContextWrapper } from './contexts/ToastWrapper.tsx';
loadMessages(ruMessages);

// 2. Устанавливаем локаль
locale('ru');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContextWrapper>
      <HashRouter>
        <App />
      </HashRouter>
    </ToastContextWrapper>
  </StrictMode>,
)
