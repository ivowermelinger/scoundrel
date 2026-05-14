import Alpine from 'alpinejs'
import engine from './components/engine';

import './styles/reset.css';
import './styles/app.css';
import './styles/engine.css';
import './styles/card.css';
import './styles/room.css';
import './styles/discard.css';
import './styles/hand.css';
import './styles/dialog.css';

import.meta.glob('./assets/images/**/*', { eager: true, query: '?url', import: 'default' });

Alpine.data('engine', engine);

Alpine.start();
