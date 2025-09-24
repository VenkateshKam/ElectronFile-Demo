import React, { useEffect, useState } from 'react';
import './titlebar.css';

const TitleBar = () => {
  const [isMax, setIsMax] = useState(false);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onWindowState((state) => {
        setIsMax(!!state);
      });
      window.electronAPI.requestWindowState();
    } else {
      console.warn('electronAPI not available!');
    }
  }, []);

  const minimize = () => window.electronAPI?.minimize();
  const toggleMax = () => window.electronAPI?.maximize();
  const close = () => window.electronAPI?.close();

  const onDoubleClick = () => toggleMax();

  return (
    <div className="titlebar" onDoubleClick={onDoubleClick}>
      <div className="titlebar-drag">
        <div className="title-text">ActiveCollab</div>
      </div>

      <div className="window-controls">
        {/* Minimize */}
        <button
          title="Minimize"
          onClick={minimize}
          className="control-btn minimize-btn"
          aria-label="Minimize window"
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <line
              x1="2"
              y1="6"
              x2="10"
              y2="6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Maximize / Restore */}
        <button
          title={isMax ? 'Restore Down' : 'Maximize'}
          onClick={toggleMax}
          className="control-btn maximize-btn"
          aria-label={isMax ? 'Restore window' : 'Maximize window'}
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            {isMax ? (
              <>
                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <rect
                  x="1.5"
                  y="1.5"
                  width="7"
                  height="7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
              </>
            ) : (
              <rect
                x="1.5"
                y="1.5"
                width="9"
                height="9"
                rx="1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            )}
          </svg>
        </button>

        {/* Close */}
        <button
          title="Close"
          className="control-btn close-btn"
          onClick={close}
          aria-label="Close window"
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <line
              x1="2"
              y1="2"
              x2="10"
              y2="10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="2"
              y1="10"
              x2="10"
              y2="2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
