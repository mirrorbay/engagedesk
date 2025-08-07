import React from 'react';
import AttentionStates from './AttentionStates.jsx';
import StateTransitions from './StateTransitions.jsx';
import AgentCoordination from './AgentCoordination.jsx';

const AttentionStateInterventionDiagram = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: 'white',
      color: 'black'
    }}>
      {/* Main Title */}
      <div style={{ 
        textAlign: 'center', 
        border: '2px solid black', 
        padding: '15px', 
        marginBottom: '30px',
        backgroundColor: 'white'
      }}>
        <h2 style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>
          ATTENTION STATE-BASED INTERVENTION PROCESS
        </h2>
        <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
          Detection → Classification → Response
        </p>
      </div>

      {/* Input Layer */}
      <div style={{ 
        textAlign: 'center', 
        border: '1px solid black', 
        padding: '10px', 
        marginBottom: '20px',
        backgroundColor: 'white'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
          STUDENT INPUT SIGNALS
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '10px' }}>
          <div style={{ border: '1px solid black', padding: '4px', width: '80px' }}>Response Time</div>
          <div style={{ border: '1px solid black', padding: '4px', width: '80px' }}>Accuracy</div>
          <div style={{ border: '1px solid black', padding: '4px', width: '80px' }}>Click Pattern</div>
          <div style={{ border: '1px solid black', padding: '4px', width: '80px' }}>Engagement</div>
        </div>
      </div>

      {/* Arrow Down */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '16px' }}>↓</div>
      </div>

      {/* Attention States */}
      <AttentionStates />

      {/* State Transitions */}
      <StateTransitions />

      {/* Agent Coordination */}
      <AgentCoordination />
    </div>
  );
};

export default AttentionStateInterventionDiagram;
