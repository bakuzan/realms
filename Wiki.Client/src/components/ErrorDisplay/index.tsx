import React from 'react';

import Grid from 'meiko/Grid';

import './ErrorDisplay.scss';

interface ErrorDisplayProps {
  messages?: string[];
}

function ErrorDisplay(props: ErrorDisplayProps) {
  if (!props.messages || props.messages.length === 0) {
    return null;
  }

  return (
    <Grid className="error-list" items={props.messages}>
      {(x: string) => (
        <li key={x} className="error-list__error error-block">
          {x}
        </li>
      )}
    </Grid>
  );
}

export default ErrorDisplay;
