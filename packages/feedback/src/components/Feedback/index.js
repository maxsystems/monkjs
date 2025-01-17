import React from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../i18n';
import Feedback from './Feedback';

function FeedbackHOC(props) {
  return (
    <I18nextProvider i18n={i18n}>
      <Feedback {...props} />
    </I18nextProvider>
  );
}

export default FeedbackHOC;
