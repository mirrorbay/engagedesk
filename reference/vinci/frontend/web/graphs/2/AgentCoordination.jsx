import React from 'react';

const AgentCoordination = () => {
  return (
    <div style={{ marginBottom: '30px' }}>
      <div style={{ 
        textAlign: 'center', 
        fontSize: '14px', 
        fontWeight: 'bold', 
        marginBottom: '15px' 
      }}>
        AI AGENT COORDINATION NETWORK
      </div>

      {/* Three-layer architecture */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        
        {/* Input Data Layer */}
        <div style={{ 
          border: '1px solid black', 
          padding: '10px', 
          backgroundColor: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
            DATA INPUT LAYER
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ 
              width: '60px', 
              height: '25px', 
              border: '1px solid black', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'white',
              fontSize: '8px'
            }}>
              Response<br/>Time
            </div>
            <div style={{ 
              width: '60px', 
              height: '25px', 
              border: '1px solid black', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'white',
              fontSize: '8px'
            }}>
              Accuracy<br/>Pattern
            </div>
            <div style={{ 
              width: '60px', 
              height: '25px', 
              border: '1px solid black', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'white',
              fontSize: '8px'
            }}>
              Click<br/>Behavior
            </div>
            <div style={{ 
              width: '60px', 
              height: '25px', 
              border: '1px solid black', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'white',
              fontSize: '8px'
            }}>
              Engagement<br/>Duration
            </div>
          </div>
        </div>

        {/* Connection arrows */}
        <div style={{ textAlign: 'center', fontSize: '12px' }}>
          ↓ ↓ ↓ ↓
        </div>

        {/* Agent Processing Layer */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'stretch' }}>
          
          {/* Detection Agent */}
          <div style={{ 
            flex: '1', 
            border: '2px solid black', 
            padding: '10px',
            backgroundColor: 'white'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>
              DETECTION AGENT
            </h4>
            
            {/* Processing Pipeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ 
                border: '1px solid black', 
                padding: '3px', 
                backgroundColor: 'white',
                fontSize: '8px',
                textAlign: 'center'
              }}>
                Pattern Analysis
              </div>
              <div style={{ textAlign: 'center', fontSize: '10px' }}>↓</div>
              <div style={{ 
                border: '1px solid black', 
                padding: '3px', 
                backgroundColor: 'white',
                fontSize: '8px',
                textAlign: 'center'
              }}>
                State Classification
              </div>
              <div style={{ textAlign: 'center', fontSize: '10px' }}>↓</div>
              <div style={{ 
                border: '2px solid black', 
                padding: '3px', 
                backgroundColor: 'white',
                fontSize: '8px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                ALERT TRIGGER
              </div>
            </div>
          </div>

          {/* Bidirectional Communication */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            minWidth: '30px'
          }}>
            <div style={{ fontSize: '12px' }}>→</div>
            <div style={{ fontSize: '7px', textAlign: 'center' }}>Signal</div>
            <div style={{ fontSize: '12px' }}>←</div>
            <div style={{ fontSize: '7px', textAlign: 'center' }}>Feedback</div>
          </div>

          {/* Intervention Agent */}
          <div style={{ 
            flex: '1', 
            border: '2px solid black', 
            padding: '10px',
            backgroundColor: 'white'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>
              INTERVENTION AGENT
            </h4>
            
            {/* Processing Pipeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ 
                border: '1px solid black', 
                padding: '3px', 
                backgroundColor: 'white',
                fontSize: '8px',
                textAlign: 'center'
              }}>
                Protocol Selection
              </div>
              <div style={{ textAlign: 'center', fontSize: '10px' }}>↓</div>
              <div style={{ 
                border: '1px solid black', 
                padding: '3px', 
                backgroundColor: 'white',
                fontSize: '8px',
                textAlign: 'center'
              }}>
                Parameter Adjustment
              </div>
              <div style={{ textAlign: 'center', fontSize: '10px' }}>↓</div>
              <div style={{ 
                border: '2px solid black', 
                padding: '3px', 
                backgroundColor: 'white',
                fontSize: '8px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                DEPLOY ACTION
              </div>
            </div>
          </div>

          {/* Bidirectional Communication */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            minWidth: '30px'
          }}>
            <div style={{ fontSize: '12px' }}>→</div>
            <div style={{ fontSize: '7px', textAlign: 'center' }}>Update</div>
            <div style={{ fontSize: '12px' }}>←</div>
            <div style={{ fontSize: '7px', textAlign: 'center' }}>Status</div>
          </div>

          {/* Economy Agent */}
          <div style={{ 
            flex: '1', 
            border: '2px solid black', 
            padding: '10px',
            backgroundColor: 'white'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>
              ECONOMY AGENT
            </h4>
            
            {/* Processing Pipeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ 
                border: '1px solid black', 
                padding: '3px', 
                backgroundColor: 'white',
                fontSize: '8px',
                textAlign: 'center'
              }}>
                Progress Tracking
              </div>
              <div style={{ textAlign: 'center', fontSize: '10px' }}>↓</div>
              <div style={{ 
                border: '1px solid black', 
                padding: '3px', 
                backgroundColor: 'white',
                fontSize: '8px',
                textAlign: 'center'
              }}>
                Reward Calculation
              </div>
              <div style={{ textAlign: 'center', fontSize: '10px' }}>↓</div>
              <div style={{ 
                border: '2px solid black', 
                padding: '3px', 
                backgroundColor: 'white',
                fontSize: '8px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                MOTIVATE USER
              </div>
            </div>
          </div>
        </div>

        {/* Connection arrows */}
        <div style={{ textAlign: 'center', fontSize: '12px' }}>
          ↓ ↓ ↓
        </div>

        {/* Output Layer */}
        <div style={{ 
          border: '1px solid black', 
          padding: '10px', 
          backgroundColor: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
            THERAPEUTIC OUTPUT LAYER
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ 
              width: '70px', 
              height: '25px', 
              border: '1px solid black', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'white',
              fontSize: '8px'
            }}>
              Difficulty<br/>Adjustment
            </div>
            <div style={{ 
              width: '70px', 
              height: '25px', 
              border: '1px solid black', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'white',
              fontSize: '8px'
            }}>
              Interface<br/>Modification
            </div>
            <div style={{ 
              width: '70px', 
              height: '25px', 
              border: '1px solid black', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'white',
              fontSize: '8px'
            }}>
              Reward<br/>Delivery
            </div>
            <div style={{ 
              width: '70px', 
              height: '25px', 
              border: '1px solid black', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'white',
              fontSize: '8px'
            }}>
              Progress<br/>Report
            </div>
          </div>
        </div>
      </div>

      {/* Neural Network Communication Pattern */}
      <div style={{ 
        marginTop: '25px',
        textAlign: 'center',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        INTER-AGENT COMMUNICATION PATTERN
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '15px',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Communication Flow Example */}
        <div style={{ 
          border: '1px solid black',
          padding: '10px',
          backgroundColor: 'white',
          fontSize: '8px',
          maxWidth: '200px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>EXAMPLE FLOW:</div>
          <div>1. DETECT: Response Time 3.2s → 8.5s</div>
          <div>2. CLASSIFY: ATTENTION_DRIFT</div>
          <div>3. ALERT: Intervention Needed</div>
          <div>4. INTERVENE: Reduce Difficulty</div>
          <div>5. REWARD: +2 Effort Points</div>
          <div>6. FEEDBACK: Monitor Response</div>
        </div>

        {/* Timing Diagram */}
        <div style={{ 
          border: '1px solid black',
          padding: '10px',
          backgroundColor: 'white',
          fontSize: '8px',
          maxWidth: '200px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>TIMING SEQUENCE:</div>
          <div>t=0ms: Signal Detection</div>
          <div>t=100ms: Pattern Analysis</div>
          <div>t=200ms: State Classification</div>
          <div>t=300ms: Protocol Selection</div>
          <div>t=400ms: Action Deployment</div>
          <div>t=500ms: Reward Calculation</div>
        </div>

        {/* Feedback Loop */}
        <div style={{ 
          border: '1px solid black',
          padding: '10px',
          backgroundColor: 'white',
          fontSize: '8px',
          maxWidth: '200px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>FEEDBACK LOOP:</div>
          <div>Action → Response → Measure</div>
          <div>Measure → Adjust → Action</div>
          <div style={{ marginTop: '5px' }}>
            Continuous optimization cycle<br/>
            Real-time adaptation<br/>
            Learning from patterns
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCoordination;
