import { useContext } from 'react';
import IctContext from 'context/ict-context';

export const useIct = () => useContext(IctContext);
