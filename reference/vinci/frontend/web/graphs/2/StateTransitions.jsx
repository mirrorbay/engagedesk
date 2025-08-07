import React from 'react';

const StateTransitions = () => {
  return (
    <div style={{ marginBottom: '30px' }}>
      <div style={{ 
        textAlign: 'center', 
        fontSize: '14px', 
        fontWeight: 'bold', 
        marginBottom: '15px' 
      }}>
        STATE TRANSITION LOGIC
      </div>

      {/* Linear flow chart */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '15px',
        flexWrap: 'wrap',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        
        {/* Start Node */}
        <div style={{ 
          width: '60px', 
          height: '30px', 
          border: '2px solid black', 
          borderRadius: '15px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'white',
          fontSize: '10px',
          fontWeight: 'bold'
        }}>
          START
        </div>

        {/* Arrow */}
        <div style={{ fontSize: '14px' }}>→</div>

        {/* Input Processing */}
        <div style={{ 
          width: '80px', 
          height: '40px', 
          border: '1px solid black', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'white',
          fontSize: '9px',
          textAlign: 'center'
        }}>
          COLLECT<br/>SIGNALS
        </div>

        {/* Arrow */}
        <div style={{ fontSize: '14px' }}>→</div>

        {/* Decision Diamond */}
        <div style={{ 
          width: '60px', 
          height: '60px', 
          border: '2px solid black', 
          transform: 'rotate(45deg)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'white',
          position: 'relative'
        }}>
          <div style={{ 
            transform: 'rotate(-45deg)',
            fontSize: '8px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            ANALYZE<br/>PATTERN
          </div>
        </div>

        {/* Arrow */}
        <div style={{ fontSize: '14px' }}>→</div>

        {/* State Classification */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '3px', 
          alignItems: 'center' 
        }}>
          <div style={{ 
            width: '60px', 
            height: '20px', 
            border: '1px solid black', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'white',
            fontSize: '8px'
          }}>
            FOCUS
          </div>
          <div style={{ 
            width: '60px', 
            height: '20px', 
            border: '1px solid black', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'white',
            fontSize: '8px'
          }}>
            DRIFT
          </div>
          <div style={{ 
            width: '60px', 
            height: '20px', 
            border: '1px solid black', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'white',
            fontSize: '8px'
          }}>
            DISTRACT
          </div>
          <div style={{ 
            width: '60px', 
            height: '20px', 
            border: '1px solid black', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'white',
            fontSize: '8px'
          }}>
            FATIGUE
          </div>
        </div>

        {/* Arrow */}
        <div style={{ fontSize: '14px' }}>→</div>

        {/* Protocol Selection */}
        <div style={{ 
          width: '80px', 
          height: '40px', 
          border: '2px solid black', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'white',
          fontSize: '9px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          SELECT<br/>PROTOCOL
        </div>

        {/* Arrow */}
        <div style={{ fontSize: '14px' }}>→</div>

        {/* Agent Trigger */}
        <div style={{ 
          width: '80px', 
          height: '40px', 
          border: '1px solid black', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'white',
          fontSize: '9px',
          textAlign: 'center'
        }}>
          TRIGGER<br/>AGENTS
        </div>
      </div>

      {/* Neural Network Style Connections */}
      <div style={{ 
        marginTop: '25px',
        textAlign: 'center',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        NEURAL PATHWAY CONNECTIONS
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '15px',
        gap: '30px',
        flexWrap: 'wrap'
      }}>
        {/* Input Nodes */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', marginBottom: '8px' }}>INPUT LAYER</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ 
              width: '50px', 
              height: '15px', 
              border: '1px solid black',
              backgroundColor: 'white',
              fontSize: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>Response Time</div>
            <div style={{ 
              width: '50px', 
              height: '15px', 
              border: '1px solid black',
              backgroundColor: 'white',
              fontSize: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>Accuracy</div>
            <div style={{ 
              width: '50px', 
              height: '15px', 
              border: '1px solid black',
              backgroundColor: 'white',
              fontSize: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>CLICK</div>
            <div style={{ 
              width: '50px', 
              height: '15px', 
              border: '1px solid black',
              backgroundColor: 'white',
              fontSize: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>ENG</div>
          </div>
        </div>

        {/* Connection Lines */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          fontSize: '10px'
        }}>
          <div>╱ ╲</div>
          <div>╲ ╱</div>
          <div>╱ ╲</div>
          <div>╲ ╱</div>
        </div>

        {/* Hidden Layer */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', marginBottom: '8px' }}>PROCESSING</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ 
              width: '50px', 
              height: '15px', 
              border: '1px solid black',
              backgroundColor: 'white',
              fontSize: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>DETECT</div>
            <div style={{ 
              width: '50px', 
              height: '15px', 
              border: '1px solid black',
              backgroundColor: 'white',
              fontSize: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>CLASSIFY</div>
            <div style={{ 
              width: '50px', 
              height: '15px', 
              border: '1px solid black',
              backgroundColor: 'white',
              fontSize: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>WEIGHT</div>
          </div>
        </div>

        {/* Connection Lines */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          fontSize: '10px'
        }}>
          <div>╱ ╲</div>
          <div>╲ ╱</div>
          <div>╱ ╲</div>
          <div>╲ ╱</div>
        </div>

        {/* Output Layer */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', marginBottom: '8px' }}>OUTPUT LAYER</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ 
              width: '50px', 
              height: '15px', 
              border: '1px solid black',
              backgroundColor: 'white',
              fontSize: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>FOCUS</div>
            <div style={{ 
              width: '50px', 
              height: '15px', 
              border: '1px solid black',
              backgroundColor: 'white',
              fontSize: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>DRIFT</div>
            <div style={{ 
              width: '50px', 
              height: '15px', 
              border: '1px solid black',
              backgroundColor: 'white',
              fontSize: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>DISTRACT</div>
            <div style={{ 
              width: '50px', 
              height: '15px', 
              border: '1px solid black',
              backgroundColor: 'white',
              fontSize: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>FATIGUE</div>
          </div>
        </div>
      </div>

      {/* Arrow to next section */}
      <div style={{ textAlign: 'center', marginTop: '25px' }}>
        <div style={{ fontSize: '16px' }}>↓</div>
        <div style={{ fontSize: '10px', marginTop: '5px' }}>AGENT COORDINATION</div>
      </div>
    </div>
  );
};

export default StateTransitions;
