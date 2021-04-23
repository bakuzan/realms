import React from 'react';

import './TitleSeparator.scss';

export default function TitleSeparator({ title }: { title: string }) {
  return (
    <div className="separator">
      <hr className="separator__line" />
      <p className="separator__title">{title}</p>
      <hr className="separator__line" />
    </div>
  );
}
