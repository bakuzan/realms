import React from 'react';

import { nano } from 'meiko/styles/nano';

nano.put('.rlm-request-message', {
  fontSize: `1.25rem`,
  margin: `10px 0`
});

nano.put('.rlm-request-message__error', {
  margin: `10px 0`
});

nano.put('.rlm-request-message__text', {
  margin: `10px 0`
});

interface RequestMessageProps {
  error: string;
  text: string;
  children?: React.ReactNode;
}

function RequestMessage({ error, text, children }: RequestMessageProps) {
  return (
    <div className="rlm-request-message">
      <div className="rlm-request-message__text">{text}</div>
      <div className="rlm-request-message__error">{error}</div>
      {children}
    </div>
  );
}

export default React.memo(RequestMessage);
