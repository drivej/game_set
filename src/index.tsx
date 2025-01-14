import { createRoot } from 'react-dom/client';
import SetGame from './SetGame';

const $root = document.getElementById('root');
const root = createRoot($root!);
root.render(<SetGame />);
