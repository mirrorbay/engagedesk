import React from 'react';

const AttentionStates = () => {
  return (
    <div style={{ marginBottom: '30px' }}>
      <div style={{ 
        textAlign: 'center', 
        fontSize: '14px', 
        fontWeight: 'bold', 
        marginBottom: '15px' 
      }}>
        ATTENTION STATE DETECTION
      </div>

      {/* Four States in a 2x2 grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        
        {/* Optimal Focus */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            border: '2px solid black', 
            padding: '8px', 
            marginBottom: '10px',
            backgroundColor: 'white'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
              OPTIMAL FOCUS
            </div>
            <div style={{ fontSize: '9px', marginBottom: '8px' }}>
              Response Time: 3-5s + Accuracy: High = FOCUS
            </div>
            <div style={{ fontSize: '8px', border: '1px solid black', padding: '3px' }}>
              PROTOCOL: Challenge
            </div>
          </div>
          
          {/* Subtype branches */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
            <div style={{ 
              border: '1px solid black', 
              padding: '3px', 
              width: '45%',
              backgroundColor: 'white'
            }}>
              Inattentive<br/>↓<br/>Extend Time
            </div>
            <div style={{ 
              border: '1px solid black', 
              padding: '3px', 
              width: '45%',
              backgroundColor: 'white'
            }}>
              Hyperactive<br/>↓<br/>Quick Feedback
            </div>
          </div>
        </div>

        {/* Attention Drift */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            border: '2px solid black', 
            padding: '8px', 
            marginBottom: '10px',
            backgroundColor: 'white'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
              ATTENTION DRIFT
            </div>
            <div style={{ fontSize: '9px', marginBottom: '8px' }}>
              15s → 35s → 55s = DRIFT
            </div>
            <div style={{ fontSize: '8px', border: '1px solid black', padding: '3px' }}>
              PROTOCOL: Re-engage
            </div>
          </div>
          
          {/* Subtype branches */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
            <div style={{ 
              border: '1px solid black', 
              padding: '3px', 
              width: '45%',
              backgroundColor: 'white'
            }}>
              Inattentive<br/>↓<br/>Visual Cues
            </div>
            <div style={{ 
              border: '1px solid black', 
              padding: '3px', 
              width: '45%',
              backgroundColor: 'white'
            }}>
              Hyperactive<br/>↓<br/>Quick Success
            </div>
          </div>
        </div>

        {/* Distraction */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            border: '2px solid black', 
            padding: '8px', 
            marginBottom: '10px',
            backgroundColor: 'white'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
              DISTRACTION
            </div>
            <div style={{ fontSize: '9px', marginBottom: '8px' }}>
              20s-5s-25s = ERRATIC
            </div>
            <div style={{ fontSize: '8px', border: '1px solid black', padding: '3px' }}>
              PROTOCOL: Mind Break
            </div>
          </div>
          
          {/* Subtype branches */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
            <div style={{ 
              border: '1px solid black', 
              padding: '3px', 
              width: '45%',
              backgroundColor: 'white'
            }}>
              Inattentive<br/>↓<br/>Gentle Prompt
            </div>
            <div style={{ 
              border: '1px solid black', 
              padding: '3px', 
              width: '45%',
              backgroundColor: 'white'
            }}>
              Hyperactive<br/>↓<br/>Movement Break
            </div>
          </div>
        </div>

        {/* Cognitive Fatigue */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            border: '2px solid black', 
            padding: '8px', 
            marginBottom: '10px',
            backgroundColor: 'white'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
              COGNITIVE FATIGUE
            </div>
            <div style={{ fontSize: '9px', marginBottom: '8px' }}>
              Delay↑ + Give Up = FATIGUE
            </div>
            <div style={{ fontSize: '8px', border: '1px solid black', padding: '3px' }}>
              PROTOCOL: Wrap Up
            </div>
          </div>
          
          {/* Universal response */}
          <div style={{ fontSize: '8px' }}>
            <div style={{ 
              border: '1px solid black', 
              padding: '3px',
              backgroundColor: 'white'
            }}>
              Universal Response<br/>↓<br/>End with Success
            </div>
          </div>
        </div>
      </div>

      {/* Connection arrows to next section */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <div style={{ fontSize: '16px' }}>↓ ↓ ↓ ↓</div>
        <div style={{ fontSize: '10px', marginTop: '5px' }}>STATE CLASSIFICATION</div>
      </div>
    </div>
  );
};

export default AttentionStates;
