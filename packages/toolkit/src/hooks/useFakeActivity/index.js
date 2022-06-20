import { useCallback, useState } from 'react';

const MIN_LOADING_TIME = 850; // in ms

/**
 * Use fake activity when you need to render ActivityIndicator for better UX
 */
function useFakeActivity(trueActivity) {
  const [fakeActivity, setFakeActivity] = useState(null);

  const handleFakeActivity = useCallback((onEnd = () => undefined) => {
    const fakeActivityId = setTimeout(() => {
      setFakeActivity(null);
      onEnd();
    }, MIN_LOADING_TIME);

    setFakeActivity(fakeActivityId);

    return () => {
      clearTimeout(fakeActivityId);
    };
  }, []);

  return [trueActivity || fakeActivity, handleFakeActivity];
}

export default useFakeActivity;
