import React, { useEffect, useState } from 'react';

interface WebSocketMessage {
  seq: number;
  tag: string;
  timestamp: string;
  [key: string]: any;
}

const HydraWebSocket: React.FC = () => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [wsAliceStatus, setWsAliceStatus] = useState<string>('disconnected');
  const [wsBobStatus, setWsBobStatus] = useState<string>('disconnected');
  const [wsCardanoStatus, setWsCardanoStatus] = useState<string>('disconnected');
  const [socketAlice, setSocketAlice] = useState<WebSocket | null>(null);
  const [socketBob, setSocketBob] = useState<WebSocket | null>(null);
  const [socketCardano, setSocketCardano] = useState<WebSocket | null>(null);

  const wsAliceUrl = env.WS_URL_ALICE_HYDRA_NODE || '';
  const wsBobUrl = env.WS_URL_BOB_HYDRA_NODE || '';
  const wsCardanoCliWrapperUrl = env.WS_URL_CARDANO_CLI_WRAPPER || '';

  useEffect(() => {
    const wsHydraAlice = new WebSocket(wsAliceUrl);
    const wsHydraBob = new WebSocket(wsBobUrl);
    const wsCardano = new WebSocket(wsCardanoCliWrapperUrl);

    wsHydraAlice.onopen = () => {
      console.log('WebSocket Hydra Alice Connected');
      setWsAliceStatus('connected');
    };

    wsHydraBob.onopen = () => {
      console.log('WebSocket Hydra Bob Connected');
      setWsBobStatus('connected');
    };
    
    wsCardano.onopen = () => {
      console.log('WebSocket Cardano CLI Wrapper Connected');
      setWsCardanoStatus('connected');
    };

    wsHydraAlice.onmessage = (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        setMessages(prev => [...prev, message]);
        console.log('Received:', message);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    wsHydraAlice.onerror = (error: Event) => {
      console.error('WebSocket Error:', error);
      setWsAliceStatus('error');
    };

    wsHydraAlice.onclose = () => {
      console.log('WebSocket Disconnected');
      setWsAliceStatus('disconnected');
    };

    setSocketAlice(wsHydraAlice);
    setSocketBob(wsHydraBob);
    setSocketCardano(wsCardano);

    return () => {
      if (wsHydraAlice) {
        wsHydraAlice.close();
      }
    };
  }, []);

  const sendMessageAlice = (message: string) => {
    if (socketAlice && socketAlice.readyState === WebSocket.OPEN) {
      socketAlice.send(message);
    }
  };
  const sendMessageBob = (message: string) => {
    if (socketBob && socketBob.readyState === WebSocket.OPEN) {
      socketBob.send(message);
    }
  };
  const sendMessageCardano = (message: string) => {
    if (socketCardano && socketCardano.readyState === WebSocket.OPEN) {
      socketCardano.send(message);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'connected':
        return { backgroundColor: '#90EE90', padding: '5px 10px', borderRadius: '4px' };
      case 'disconnected':
        return { backgroundColor: '#FFB6C1', padding: '5px 10px', borderRadius: '4px' };
      case 'error':
        return { backgroundColor: '#FFB6C1', padding: '5px 10px', borderRadius: '4px' };
      default:
        return { backgroundColor: '#D3D3D3', padding: '5px 10px', borderRadius: '4px' };
    }
  };

  return (
    <div>
      <h2>Simple Hydra Client</h2>
      <div style={getStatusStyle(wsAliceStatus)}>Hydra node Alice Status: {wsAliceStatus}</div>
      <div style={getStatusStyle(wsBobStatus)}>Hydra node Bob StatusStatus: {wsBobStatus}</div>
      <div style={getStatusStyle(wsCardanoStatus)}>Cardano CLI Wrapper Status: {wsCardanoStatus}</div>

      <button
        onClick={() => sendMessageAlice(JSON.stringify({ tag: 'GetUTxO' }))}
        disabled={wsAliceStatus !== 'connected'}
      >
        GetUTxO
      </button>
      <button
        onClick={() => sendMessageAlice(JSON.stringify({ tag: 'Init' }))}
        disabled={wsAliceStatus !== 'connected'}
      >
        Init
      </button>
      <button
        onClick={() => sendMessageCardano('startCommitProcessAlice')}
        disabled={wsAliceStatus !== 'connected'}
      >
        Commit:Alice
      </button>
      <button
        onClick={() => sendMessageCardano('startCommitProcessBob')}
        disabled={wsCardanoStatus !== 'connected' || wsBobStatus !== 'connected'}
      >
        Commit:Bob
      </button>
      <button
        onClick={() => sendMessageCardano('getUtxoJSONAlice')}
        disabled={wsCardanoStatus !== 'connected' || wsAliceStatus !== 'connected' || wsBobStatus !== 'connected'}
      >
        NewTx
      </button>
      <button
        onClick={() => sendMessageAlice(JSON.stringify({ tag: 'Close' }))}
        disabled={wsAliceStatus !== 'connected'}
      >
        Close
      </button>
      <button
        onClick={() => sendMessageAlice(JSON.stringify({ tag: 'Fanout' }))}
        disabled={wsAliceStatus !== 'connected'}
      >
        Fanout
      </button>
      <button
        onClick={() => sendMessageAlice(JSON.stringify({ tag: 'Abort' }))}
        disabled={wsAliceStatus !== 'connected'}
      >
        Abort
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>Received Messages:</h3>
        <div style={{ overflow: 'auto' }}>
          {[...messages].reverse().map((msg, index) => (
            <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ flex: 1, textAlign: 'left' }}>{msg.seq}</span>
                <span style={{ flex: 1, textAlign: 'center' }}>{msg.tag}</span>
                <span style={{ flex: 1, textAlign: 'right' }}>{formatTimestamp(msg.timestamp)}</span>
                </div>
                <details>
                <summary>Details</summary>
                <button
                  onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(msg, null, 2));
                  const button = document.activeElement as HTMLButtonElement;
                  const originalText = button.textContent;
                  button.textContent = 'Message Copied';
                  button.disabled = true;
                  setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                  }, 1000);
                  }}
                  style={{ marginTop: '10px', padding: '5px 10px', cursor: 'pointer' }}
                >
                  Message Copy
                </button>
                <textarea
                  readOnly
                  value={JSON.stringify(msg, null, 2)}
                  style={{ width: '100%', height: '100px', resize: 'none' }}
                />
                </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const formatTimestamp = (isoString: string): string => {
  const match = isoString.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})(\d{0,6})Z$/
  );

  if (!match) return "Invalid timestamp";

  const [
    _,
    year,
    month,
    day,
    hour,
    minute,
    second,
    milli,
    nanoRest,
  ] = match;

  return `${year}/${month}/${day} ${hour}:${minute}:${second}.${milli}${nanoRest}`;
};

export default HydraWebSocket;