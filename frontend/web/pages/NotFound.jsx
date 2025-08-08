import React, { useState, useEffect } from "react";
import styles from "../styles/notFound.module.css";

const NotFound = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [blinkCursor, setBlinkCursor] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const cursorTimer = setInterval(() => {
      setBlinkCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, []);

  const formatTimestamp = (date) => {
    return date.toISOString().replace("T", " ").substring(0, 19) + " UTC";
  };

  const sessionId = Math.random().toString(36).substring(2, 15);
  const processId = Math.floor(Math.random() * 9999) + 1000;
  const errorCode = `0x${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")
    .toUpperCase()}`;

  return (
    <div className={styles.container}>
      <div className={styles.terminal}>
        <div className={styles.header}>
          <span className={styles.title}>System Error - Process Monitor</span>
          <span className={styles.timestamp}>
            {formatTimestamp(currentTime)}
          </span>
        </div>

        <div className={styles.content}>
          <div className={styles.errorBlock}>
            <div className={styles.errorHeader}>
              FATAL: Unhandled Exception in Request Handler
            </div>
            <div className={styles.errorDetails}>
              <div>Process ID: {processId}</div>
              <div>Session ID: {sessionId}</div>
              <div>Error Code: {errorCode}</div>
              <div>Thread: MainRequestThread</div>
            </div>
          </div>

          <div className={styles.stackTrace}>
            <div className={styles.stackHeader}>Stack Trace:</div>
            <div className={styles.stackLine}>
              {" "}
              at RouteHandler.resolve(route-handler.js:247:12)
            </div>
            <div className={styles.stackLine}>
              {" "}
              at RequestProcessor.handleRequest(request-processor.js:89:23)
            </div>
            <div className={styles.stackLine}>
              {" "}
              at ServerInstance.processIncoming(server.js:156:8)
            </div>
            <div className={styles.stackLine}>
              {" "}
              at IncomingMessage.&lt;anonymous&gt; (http-parser.js:234:15)
            </div>
            <div className={styles.stackLine}>
              {" "}
              at IncomingMessage.emit(events.js:198:13)
            </div>
            <div className={styles.stackLine}>
              {" "}
              at HTTPParser.parserOnHeadersComplete(_http_common.js:117:17)
            </div>
          </div>

          <div className={styles.systemInfo}>
            <div className={styles.infoHeader}>System Information:</div>
            <div>Node.js: v18.17.1</div>
            <div>Platform: linux x64</div>
            <div>Memory Usage: 847.2 MB / 2048 MB</div>
            <div>Uptime: 47d 12h 34m 18s</div>
            <div>Load Average: 2.34, 1.89, 1.67</div>
          </div>

          <div className={styles.errorMessage}>
            <div className={styles.messageHeader}>Error Details:</div>
            <div>Cannot resolve route: Resource not found in routing table</div>
            <div>Attempted path resolution failed</div>
            <div>No fallback handler configured for this endpoint</div>
          </div>

          <div className={styles.logEntries}>
            <div className={styles.logHeader}>Recent Log Entries:</div>
            <div className={styles.logLine}>
              [{formatTimestamp(new Date(Date.now() - 1000))}] WARN: Route
              resolution timeout
            </div>
            <div className={styles.logLine}>
              [{formatTimestamp(new Date(Date.now() - 2000))}] ERROR: Handler
              lookup failed
            </div>
            <div className={styles.logLine}>
              [{formatTimestamp(new Date(Date.now() - 3000))}] INFO: Request
              received from 192.168.1.{Math.floor(Math.random() * 255)}
            </div>
            <div className={styles.logLine}>
              [{formatTimestamp(new Date(Date.now() - 4000))}] DEBUG:
              Initializing request context
            </div>
          </div>

          <div className={styles.prompt}>
            <span className={styles.promptText}>system@webserver:~$ </span>
            <span
              className={styles.cursor}
              style={{ opacity: blinkCursor ? 1 : 0 }}
            >
              _
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
