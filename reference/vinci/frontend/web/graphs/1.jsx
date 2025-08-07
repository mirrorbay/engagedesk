import React from 'react';

const SystemArchitectureDiagram = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.4' }}>
      {/* Main Title */}
      <div style={{ 
        textAlign: 'center', 
        border: '2px solid #333', 
        padding: '15px', 
        marginBottom: '20px',
        backgroundColor: '#f5f5f5'
      }}>
        <h2 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
          MULTI-AGENT DIGITAL THERAPEUTIC SYSTEM
        </h2>
      </div>

      {/* Arrow from title to agents */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <div style={{ fontSize: '24px', color: '#333' }}>↓</div>
      </div>

      {/* Three arrows pointing to each agent */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
        <div style={{ fontSize: '20px', color: '#333' }}>↓</div>
        <div style={{ fontSize: '20px', color: '#333' }}>↓</div>
        <div style={{ fontSize: '20px', color: '#333' }}>↓</div>
      </div>

      {/* Three Main Agents with bidirectional arrows */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'nowrap', position: 'relative', alignItems: 'stretch' }}>
        {/* Detection AI Agent */}
        <div style={{ 
          flex: '1', 
          minWidth: '280px',
          border: '2px solid #333', 
          padding: '12px',
          backgroundColor: '#e8f4fd'
        }}>
          <h3 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold' }}>
            DETECTION AI AGENT
          </h3>
          
          <div style={{ border: '1px solid #666', padding: '10px', marginBottom: '10px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>BEHAVIORAL ANALYTICS</h4>
            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '12px' }}>
              <li>Response Time Variability Analysis</li>
              <li>Accuracy Pattern Recognition</li>
              <li>Engagement Timing Classification</li>
              <li>Self-Correction Behavior Tracking</li>
            </ul>
          </div>

          <div style={{ border: '1px solid #666', padding: '10px', marginBottom: '10px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>ADHD SUBTYPE DETECTION</h4>
            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '12px' }}>
              <li>Inattentive: Gradual RT increase, Sustained deficits</li>
              <li>Hyperactive-Impulsive: Erratic patterns, Impulsive clicking</li>
              <li>Combined: Mixed signatures</li>
            </ul>
          </div>

          <div style={{ border: '1px solid #666', padding: '10px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>ATTENTION STATE RECOGNITION</h4>
            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '12px' }}>
              <li>Optimal Focus: Consistent RT, high accuracy</li>
              <li>Attention Drift: Increasing RT, declining accuracy</li>
              <li>Distraction/Hyperactivity: Erratic timing</li>
              <li>Cognitive Fatigue: Engagement delays</li>
            </ul>
          </div>
        </div>

        {/* Bidirectional arrows between agents */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          minWidth: '30px',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '16px', color: '#333', margin: '5px 0' }}>◄──►</div>
        </div>

        {/* Intervention AI Agent */}
        <div style={{ 
          flex: '1', 
          minWidth: '280px',
          border: '2px solid #333', 
          padding: '12px',
          backgroundColor: '#fff2e8'
        }}>
          <h3 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold' }}>
            INTERVENTION AI AGENT
          </h3>
          
          <div style={{ border: '1px solid #666', padding: '10px', marginBottom: '10px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>THERAPEUTIC PROTOCOLS</h4>
            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '12px' }}>
              <li>ADHD-Inattentive: 15-20min sessions, Lower threshold, Structured breaks</li>
              <li>ADHD-Hyperactive: 8-12min sessions, Higher threshold, Rapid feedback</li>
            </ul>
          </div>

          <div style={{ border: '1px solid #666', padding: '10px', marginBottom: '10px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>COGNITIVE LOAD MANAGEMENT</h4>
            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '12px' }}>
              <li>Dynamic Difficulty Adjustment</li>
              <li>Therapeutic Dosing</li>
              <li>Optimal Challenge Zone Maintenance</li>
              <li>Problem Complexity Calibration</li>
            </ul>
          </div>

          <div style={{ border: '1px solid #666', padding: '10px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>SESSION OPTIMIZATION</h4>
            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '12px' }}>
              <li>Length Adaptation</li>
              <li>Break Scheduling</li>
              <li>Pacing Control</li>
              <li>Interface Adaptation (Minimalist vs Interactive)</li>
              <li>Re-engagement Protocols</li>
              <li>Mind Break Triggers</li>
            </ul>
          </div>
        </div>

        {/* Bidirectional arrows between agents */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          minWidth: '30px',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '16px', color: '#333', margin: '5px 0' }}>◄──►</div>
        </div>

        {/* Economy AI Agent */}
        <div style={{ 
          flex: '1', 
          minWidth: '280px',
          border: '2px solid #333', 
          padding: '12px',
          backgroundColor: '#e8f8e8'
        }}>
          <h3 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold' }}>
            ECONOMY AI AGENT
          </h3>
          
          <div style={{ border: '1px solid #666', padding: '10px', marginBottom: '10px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>REINFORCEMENT SYSTEMS</h4>
            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '12px' }}>
              <li>Process-Focused Token Economy</li>
              <li>Multi-Level Goals:
                <ul style={{ paddingLeft: '15px' }}>
                  <li>Session goals</li>
                  <li>Micro goals</li>
                  <li>Weekly goals</li>
                </ul>
              </li>
              <li>Achievement Trees</li>
              <li>Parent Integration</li>
            </ul>
          </div>

          <div style={{ border: '1px solid #666', padding: '10px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>CELEBRATION MANAGEMENT</h4>
            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '12px' }}>
              <li>Effort-Based Rewards</li>
              <li>Success Milestone Recognition</li>
              <li>Motivation Maintenance</li>
              <li>Progress Celebration</li>
              <li>Family Ecosystem Integration</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Arrows from agents to Dosing */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
        <div style={{ fontSize: '20px', color: '#333' }}>↓</div>
        <div style={{ fontSize: '20px', color: '#333' }}>↓</div>
        <div style={{ fontSize: '20px', color: '#333' }}>↓</div>
      </div>

      {/* Convergence arrow */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <div style={{ fontSize: '24px', color: '#333' }}>↓</div>
      </div>

      {/* Dosing Section (Combined Mathematical Content Engine + Therapeutic Content Optimization) */}
      <div style={{ 
        border: '2px solid #333', 
        padding: '15px', 
        marginBottom: '20px',
        backgroundColor: '#f0f0f0'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
          DOSING
        </h3>
        
        {/* Therapeutic Content Details */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '15px' }}>
            <ul style={{ flex: '1', margin: '0', paddingLeft: '20px', fontSize: '12px' }}>
              <li>Grade-Appropriate Problem Generation</li>
              <li>Estimated Time Calculations</li>
              <li>Subcategory Specialization</li>
              <li>Attention Training Stimuli Integration</li>
              <li>Problem Variety for Sustained Engagement</li>
            </ul>
            <ul style={{ flex: '1', margin: '0', paddingLeft: '20px', fontSize: '12px' }}>
              <li>Difficulty Scaling (5 Therapeutic Levels)</li>
              <li>Cognitive Load Management</li>
              <li>Academic Relevance Guarantee</li>
              <li>Classroom Performance Transfer</li>
              <li>Consistent Therapeutic Benefit</li>
            </ul>
          </div>
        </div>

        {/* Academic Topics */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* Elementary Arithmetic - Keep detailed */}
          <div style={{ 
            flex: '1', 
            minWidth: '200px',
            border: '1px solid #666', 
            padding: '10px',
            backgroundColor: '#fafafa'
          }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
              ELEMENTARY ARITHMETIC
            </h4>
            <ul style={{ margin: '0', paddingLeft: '15px', fontSize: '10px' }}>
              <li>Number Sense</li>
              <li>Basic Addition</li>
              <li>Basic Subtraction</li>
              <li>Skip Counting</li>
              <li>Place Value</li>
              <li>Basic Multiplication</li>
              <li>Basic Division</li>
              <li>Word Problems</li>
              <li>Pattern Recognition</li>
              <li>Time & Money</li>
            </ul>
          </div>

          {/* Intermediate Arithmetic - Keep detailed */}
          <div style={{ 
            flex: '1', 
            minWidth: '200px',
            border: '1px solid #666', 
            padding: '10px',
            backgroundColor: '#fafafa'
          }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
              INTERMEDIATE ARITHMETIC
            </h4>
            <ul style={{ margin: '0', paddingLeft: '15px', fontSize: '10px' }}>
              <li>Multi-Digit Operations</li>
              <li>Fractions</li>
              <li>Decimals</li>
              <li>Percentages</li>
              <li>Ratios & Proportions</li>
              <li>Basic Geometry</li>
              <li>Data Analysis</li>
              <li>Problem Solving Strategies</li>
            </ul>
          </div>

          {/* Simplified higher levels */}
          <div style={{ 
            flex: '1', 
            minWidth: '150px',
            border: '1px solid #666', 
            padding: '10px',
            backgroundColor: '#fafafa'
          }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
              MIDDLE SCHOOL MATH TOPICS
            </h4>
          </div>

          <div style={{ 
            flex: '1', 
            minWidth: '150px',
            border: '1px solid #666', 
            padding: '10px',
            backgroundColor: '#fafafa'
          }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
              HIGH SCHOOL MATH TOPICS
            </h4>
          </div>
        </div>
      </div>

      {/* Arrow down to outcomes */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <div style={{ fontSize: '24px', color: '#333' }}>↓</div>
      </div>

      {/* Dual Therapeutic Outcomes (with Clinical Integration details) */}
      <div style={{ 
        border: '2px solid #333', 
        padding: '15px', 
        marginBottom: '20px',
        backgroundColor: '#f5f5f5'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>
          DUAL THERAPEUTIC OUTCOMES
        </h3>

        {/* Clinical Integration Details */}
        <div style={{ marginBottom: '15px' }}>
          <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '12px', textAlign: 'center', listStyle: 'none' }}>
            <li>• Medical Assessment Data • Treatment Planning • Progress Monitoring • Objective Metrics</li>
            <li>• Evidence-Based Outcomes • Family Ecosystem Integration • Longitudinal Tracking</li>
          </ul>
        </div>

        {/* Two arrows to outcome areas */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
          <div style={{ fontSize: '20px', color: '#333' }}>↓</div>
          <div style={{ fontSize: '20px', color: '#333' }}>↓</div>
        </div>

        {/* Two Outcome Areas */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ 
            flex: '1', 
            minWidth: '300px',
            border: '2px solid #333', 
            padding: '15px',
            backgroundColor: '#e8f4fd'
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
              ATTENTION IMPROVEMENT
            </h4>
            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '12px' }}>
              <li>Sustained Focus Duration</li>
              <li>Reduced Distractibility</li>
              <li>Enhanced Consistency</li>
              <li>Improved Self-Regulation</li>
              <li>Faster Recovery from Distractions</li>
              <li>Increased Task Persistence</li>
              <li>Better Impulse Control</li>
            </ul>
          </div>

          <div style={{ 
            flex: '1', 
            minWidth: '300px',
            border: '2px solid #333', 
            padding: '15px',
            backgroundColor: '#fff2e8'
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
              ACADEMIC SKILL DEVELOPMENT
            </h4>
            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '12px' }}>
              <li>Mathematical Proficiency</li>
              <li>Grade-Level Advancement</li>
              <li>Problem-Solving Confidence</li>
              <li>Reduced Careless Errors</li>
              <li>Enhanced Mathematical Reasoning</li>
              <li>Accelerated Learning</li>
              <li>Classroom Transfer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemArchitectureDiagram;
