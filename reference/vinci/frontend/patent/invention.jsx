import React from 'react';
import styles from './tmp.module.css';

const InventionDisclosure = () => {
  return (
    <div className={styles.inventionContainer}>
      <div className={styles.header}>
        <div className={styles.confidential}>
          STRICTLY CONFIDENTIAL ATTORNEY-CLIENT PRIVILEGED
        </div>
        <div className={styles.title}>
          PATENT APPLICATION INVENTION DISCLOSURE FORM
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionNumber}>1) INFORMATION FOR ALL INVENTOR(S)</div>
        <div className={styles.sectionContent}>
          <div className={styles.subsection}>
            <div className={styles.subsectionLabel}>Inventor (full name):</div>
            <div className={styles.answer}>Fei Fang</div>
          </div>
          <div className={styles.subsection}>
            <div className={styles.subsectionLabel}>Citizenship:</div>
            <div className={styles.answer}>Hong Kong (China)</div>
          </div>
          <div className={styles.subsection}>
            <div className={styles.subsectionLabel}>Address, phone, email and fax:</div>
            <div className={styles.answer}>+1 360 869 0169, fei.aaron.fang@gmail.com</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionNumber}>2) TITLE OF INVENTION</div>
        <div className={styles.sectionContent}>
          <div className={styles.answer}>
            <span className={styles.highlight}>AI-Powered ADHD Therapeutic System Using Academic Exercise-Based Cognitive Intervention</span>
          </div>
          <div className={styles.answer} style={{marginTop: '15px', fontSize: '12px', fontStyle: 'italic'}}>
            <strong>My thinking on this title:</strong> I want to protect three things: (1) <strong>ADHD therapy</strong> - need FDA 501k pathway like EndeavorRx, (2) <strong>Using school math</strong> - this is new, other apps just do games, and (3) <strong>AI that works</strong> - multiple agents talking to each other + the coordinated algorithm involved.
            <br/><br/>
            I'm worried about copycats doing: (1) <strong>Different AI setup</strong> - like 2 agents with a human watching, and (2) <strong>Different school subjects</strong> - using reading or science instead of math. Want to stop both "ADHD kids? Better grades for $3.99!" ads and "We do AI for ADHD" investor pitches.
            <br/><br/>
            <strong>Please advise:</strong> Would you make changes to this title or approach? Thanks for your help with really positioning these elements for maximum protection.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionNumber}>3) DATE OF FIRST WRITTEN DESCRIPTION OF INVENTION</div>
        <div className={styles.sectionContent}>
          <div className={styles.answer}>June 23, 2025</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionNumber}>4) LOCATION OF WRITTEN RECORD (e.g. Lab book No., page)</div>
        <div className={styles.sectionContent}>
          <div className={styles.answer}>Personal device</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionNumber}>5) HAS THE INVENTION BEEN TESTED ON AN EXPERIMENTAL BASIS? (Describe when, where, and the results)</div>
        <div className={styles.sectionContent}>
          <div className={styles.answer}>Yes, June 1-25, tested online</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionNumber}>6) HAS THE INVENTION BEEN DISCLOSED TO PERSONS OUTSIDE YOUR UNIVERSITY/COMPANY? If yes, say to whom, when, and relationship to company/university. Also, please tell us if a non-disclosure agreement was signed.</div>
        <div className={styles.sectionContent}>
          <div className={styles.answer}>No</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionNumber}>7) THE INVENTION</div>
        <div className={styles.sectionContent}>
          
          <div className={styles.subsection}>
            <div className={styles.subsectionLabel}>a) What is the goal/problem that the invention addresses?</div>
            <div className={styles.answer}>
              The invention addresses two interconnected problems: (1) ADHD children need cognitive behavioral training 
              as recommended by CDC/AAP, but traditional therapy has barriers that prevent access, and (2) ADHD children 
              struggle with math learning due to attention deficits, creating a cycle where poor attention hurts academic 
              performance and poor academic performance hurts self-esteem and motivation.
            </div>
          </div>

          <div className={styles.subsection}>
            <div className={styles.subsectionLabel}>b) What is the currently used solution to meet this goal / solve this problem?</div>
            <div className={styles.answer}>
              7 million (11.4%) U.S. children aged 3-17 years have been diagnosed with ADHD (source: CDC 
              https://www.cdc.gov/adhd/data/index.html)
              <br/><br/>
              These students face well-documented academic challenges:
              <br/>
              1. Lower standardized test scores in mathematics compared to neurotypical peers
              <br/>
              2. Reduced GPA: averaging 25% lower than non-ADHD students
              <br/>
              3. Higher rates of grade retention and special education placement
              <br/>
              4. Increased school dropout rates: 32.2% vs 15% for non-ADHD peers
              <br/><br/>
              Current solutions include:
              <br/>
              1. ADHD therapy: In-person cognitive behavioral training with specialized therapists
              <br/>
              2. EndeavorRx (FDA-cleared digital ADHD therapeutic): Video game-based attention training using abstract 
              tasks, but doesn't address academic skills or use educational content; gamified content is not universally 
              accepted by parents
              <br/>
              3. ADHD medications: Adderall/Ritalin improve attention but don't directly address academic learning gaps; 
              parents hesitate with medication due to side effect concerns
              <br/>
              4. Educational apps: Khan Academy, IXL, etc. for math learning but without attention monitoring or 
              therapeutic intervention; these are generic study tools without ADHD-specific tailoring or real-time 
              adaptation
              <br/>
              5. Academic tutoring: Lack ADHD-specific attention training protocols or therapeutic intervention
            </div>
          </div>

          <div className={styles.subsection}>
            <div className={styles.subsectionLabel}>c) What are the shortcomings/disadvantages of the current solution?</div>
            <div className={styles.answer}>
              Systemic gap: No current solution combines therapeutic attention training with academic skill development. 
              The real challenge for families with ADHD children is academic performance - their child's success in school is 
              the primary concern. Existing solutions tend to address attention training without academic benefits 
              (EndeavorRx, traditional therapy). No solution directly targets both the underlying attention issues and the 
              academic struggles that matter most to families.
              <br/><br/>
              Traditional ADHD therapy:
              <br/>
              • Cost barrier: $100-200/hour excludes most families
              <br/>
              • Time burden: 60+ minute sessions plus commute time
              <br/>
              • Access limitations: Limited availability of specialized ADHD therapists
              <br/>
              • Single focus: Addresses attention only, no academic skill development
              <br/>
              • Subjective measurement: Progress based on therapist observations, not objective data
              <br/><br/>
              EndeavorRx digital therapeutic:
              <br/>
              • No academic benefit: Abstract gaming tasks don't transfer to classroom learning
              <br/>
              • Parent resistance: Many parents prefer academic-focused over entertainment-based interventions
              <br/><br/>
              ADHD medications:
              <br/>
              • Side effect + dependency: Parents worry about appetite suppression, sleep issues, growth impacts; 
              benefits disappear when medication stops
              <br/>
              • No academic remediation: Doesn't address existing learning gaps or build math skills
            </div>
          </div>

          <div className={styles.subsection}>
            <div className={styles.subsectionLabel}>d) What is the new solution to the problem (i.e., your invention)?</div>
            <div className={styles.answer}>
              <div className={styles.highlight}>
                <strong>NARRATIVE DESCRIPTION OF THE INVENTION:</strong>
                <br/><br/>
                This invention is an AI system that helps ADHD students by combining therapy with math learning. Instead of 
                abstract games like other ADHD apps or offline therapies, students solve real math problems while the AI monitors their attention ("detection agent"), 
                adjusts the training delivery ("intervention agent"), and manages motivation ("economy agent").
                <br/><br/>
                <strong>What makes this different:</strong>
                <br/><br/>
                <strong>1. Therapy through school math</strong>
                <br/>
                Students work on actual math problems (addition, subtraction, multiplication, division, fractions, word problems) that help with school grades. Each math problem serves two purposes: training 
                attention as per CDC guidelines, and improving math grades which is among parents' top objectives. This is different from existing ADHD apps that use abstract games with no direct academic value.
                <br/><br/>
                <strong>2. Three AI agents working together</strong>
                <br/>
                Note: The specific numerical thresholds mentioned are dynamic values that improve and personalize based on user data, ADHD subtype, grade level, and attention problem severity.
                <br/><br/>
                Detection Agent: Monitors how students solve problems in real-time. Measures response times, accuracy, distraction patterns, 
                and self-correction behaviors. Identifies four attention states: focused (consistent response times, 70%+ accuracy), 
                drifting (gradually increasing response times), distracted (erratic response patterns), and 
                tired (delayed responses, minimal self-corrections).
                <br/><br/>
                Intervention Agent: Receives attention data from Detection Agent and automatically adjusts the experience. 
                For inattentive ADHD students: longer sessions (15-20 minutes), structured breaks, gradual difficulty increases, lower accuracy 
                thresholds (65%) before reducing difficulty. For hyperactive ADHD students: shorter sessions (8-12 minutes), rapid adjustments, higher accuracy targets (75%), immediate 
                feedback. Dynamically changes math problem difficulty (levels 1-5) based on real-time attention state.
                <br/><br/>
                Economy Agent: Manages motivation through points, goals, and progress tracking. Awards points for focused time (attention progress), problem attempts (effort), and accuracy streaks (academic performance). 
                Sets multiple goal types: session goals ("focus for 7 minutes"), micro goals ("answer in 30 seconds"), 
                weekly goals ("10 minutes daily at 70% accuracy"). Provides data for parent-managed consequences and rewards. Tracks student progress in both attention improvement and academic performance. Delivers 
                encouraging feedback to build self-esteem.
                <br/><br/>
                <strong>3. Real-time coordination between agents</strong>
                <br/>
                Detection Agent continuously sends behavioral data to Intervention Agent. Intervention Agent 
                manages therapeutic delivery (difficulty levels, session timing, break scheduling) to the learning interface. Economy Agent receives 
                performance data from both agents to calculate rewards and track progress. All three agents coordinate 
                to maintain optimal therapeutic challenge while advancing mathematical learning.
              </div>
              <br/><br/>
              
              <div className={styles.diagram}>
                <div className={styles.agentBox}>DETECTION AGENT</div>
                <span className={styles.arrow}>↔</span>
                <div className={styles.agentBox}>INTERVENTION AGENT</div>
                <span className={styles.arrow}>↔</span>
                <div className={styles.agentBox}>ECONOMY AGENT</div>
                <br/>
                <div style={{marginTop: '10px', fontSize: '12px'}}>
                  Real-time data flow: Behavioral metrics → Therapeutic protocols → Motivational feedback
                </div>
              </div>

              <div className={styles.highlight}>
                <strong>DETAILED THERAPEUTIC DOSING SYSTEM:</strong>
                <br/><br/>
                The system implements precision therapeutic dosing through cognitive load management, automatically adjusting 
                mathematical problem difficulty based on attention capacity indicators. When the Detection Agent identifies 
                accuracy decline below therapeutic thresholds (70% for inattentive subtype, 75% for hyperactive subtype), 
                the Intervention Agent immediately reduces cognitive load by decreasing problem complexity by 15-25%. 
                Conversely, when accuracy exceeds optimal thresholds (80% for inattentive, 85% for hyperactive), complexity 
                increases by 10-15% to maintain therapeutic challenge zones.
                <br/><br/>
                Individual starting points are determined through initial assessment problems that measure baseline response 
                times and accuracy across different difficulty levels (1-5 scale). The system learns each child's attention 
                capacity by tracking performance consistency within sessions - steady response times indicate optimal dosing, 
                while increasing variability triggers automatic difficulty reduction.
                <br/><br/>
                Focus loss detection occurs through response time variability analysis: when standard deviation of response 
                times exceeds 3 seconds from baseline, or when accuracy drops 20% from session average, the system identifies 
                attention drift and implements re-engagement protocols including visual variety in problem presentation and 
                encouraging feedback delivery.
                <br/><br/>
                Engagement timing analysis measures the delay between problem presentation and first student interaction, 
                with delays exceeding 8 seconds for inattentive subtype or 5 seconds for hyperactive subtype triggering 
                attention prompts. Self-correction behaviors are tracked as frequency of answer modifications, with high 
                self-correction rates (&gt;3 per problem) indicating either uncertainty or impulsivity, prompting appropriate 
                intervention adjustments.
              </div>
            </div>
          </div>

          <div className={styles.subsection}>
            <div className={styles.subsectionLabel}>
              <span className={styles.highlight}>COMPREHENSIVE DEFINITIONS OF TECHNICAL TERMS:</span>
            </div>
            <div className={styles.definitionList}>
              <div className={styles.definition}>
                <div className={styles.definitionTerm}>Difficulty Adjustment:</div>
                <div className={styles.definitionText}>Automated modification of mathematical problem complexity measured on a 1-5 scale, where level 1 represents single-digit addition (e.g., 3+4) and level 5 represents multi-step word problems requiring 3+ operations.</div>
              </div>
              <div className={styles.definition}>
                <div className={styles.definitionTerm}>Attention Capacity Indicators:</div>
                <div className={styles.definitionText}>Quantifiable behavioral metrics including response time consistency (standard deviation &lt;3 seconds), accuracy maintenance (&gt;70% correct), and sustained engagement (continuous interaction without &gt;8 second gaps).</div>
              </div>
              <div className={styles.definition}>
                <div className={styles.definitionTerm}>Cognitive Load:</div>
                <div className={styles.definitionText}>The amount of mental effort required to process mathematical problems, measured by problem complexity (number of operations), working memory demands (digits to remember), and processing speed requirements (target completion time in seconds).</div>
              </div>
              <div className={styles.definition}>
                <div className={styles.definitionTerm}>Individual Starting Points:</div>
                <div className={styles.definitionText}>Personalized baseline difficulty levels determined through initial assessment measuring accuracy and response time across 5 difficulty levels, establishing optimal challenge zones for each student.</div>
              </div>
              <div className={styles.definition}>
                <div className={styles.definitionTerm}>Focus Loss:</div>
                <div className={styles.definitionText}>Attention deterioration detected through behavioral pattern changes: response time increases &gt;50% from baseline, accuracy drops &gt;20% from session average, or engagement gaps exceed 8 seconds.</div>
              </div>
              <div className={styles.definition}>
                <div className={styles.definitionTerm}>Engagement Timing:</div>
                <div className={styles.definitionText}>Time intervals measured in milliseconds between problem presentation and first student interaction, with optimal ranges of 1-3 seconds for focused attention and &gt;8 seconds indicating attention drift.</div>
              </div>
              <div className={styles.definition}>
                <div className={styles.definitionTerm}>Self-Correction Behaviors:</div>
                <div className={styles.definitionText}>Frequency of answer modifications per problem, measured as number of input changes before final submission, with 1-2 corrections indicating thoughtful review and &gt;3 corrections suggesting uncertainty or impulsivity.</div>
              </div>
              <div className={styles.definition}>
                <div className={styles.definitionTerm}>Achievement Progression:</div>
                <div className={styles.definitionText}>Structured advancement through mathematical skill levels based on sustained accuracy (&gt;75% for 3 consecutive sessions) and attention improvement (reduced response time variability), unlocking higher difficulty problems and new mathematical concepts.</div>
              </div>
              <div className={styles.definition}>
                <div className={styles.definitionTerm}>Effort-over-Correctness Celebration:</div>
                <div className={styles.definitionText}>Motivational system prioritizing sustained attention and problem-solving persistence over answer accuracy, awarding points for time spent focused (1 point per minute) and completion attempts (2 points per problem attempted) regardless of correctness.</div>
              </div>
              <div className={styles.definition}>
                <div className={styles.definitionTerm}>Skill Tree Advancement:</div>
                <div className={styles.definitionText}>Visual progress tracking system where students unlock new mathematical concepts (addition→subtraction→multiplication→division→fractions) based on demonstrated mastery (80% accuracy over 5 sessions) and attention consistency (response time standard deviation &lt;2 seconds).</div>
              </div>
              <div className={styles.definition}>
                <div className={styles.definitionTerm}>Attention Changes:</div>
                <div className={styles.definitionText}>Quantifiable shifts in attention state measured through response time variability (milliseconds), accuracy trends (percentage points), and engagement patterns (seconds of continuous interaction), with changes detected through statistical analysis of rolling 5-problem windows.</div>
              </div>
            </div>
          </div>

          <div className={styles.subsection}>
            <div className={styles.subsectionLabel}>(ii) Explain how the entire invention works to provide the desired solution.</div>
            <div className={styles.answer}>
              <span className={styles.highlight}>
                The system operates through continuous real-time monitoring and adaptive intervention during mathematical 
                learning sessions. Students access the web-based platform and select mathematical concepts (addition, 
                subtraction, multiplication, division, fractions, or mixed arithmetic) for study sessions lasting 6-20 minutes.
                <br/><br/>
                During problem-solving, the Detection Agent captures behavioral data every 500 milliseconds: keystroke timing, 
                mouse movements, response latencies, and answer accuracy. This data feeds into machine learning algorithms 
                that classify attention states and predict attention drift 10-15 seconds before it occurs.
                <br/><br/>
                The Intervention Agent receives attention state classifications and automatically adjusts problem difficulty, 
                session timing, and interface elements. For example, when detecting attention drift in an inattentive ADHD 
                student, it reduces problem complexity from level 4 (two-digit multiplication) to level 2 (single-digit 
                multiplication), extends response time allowance from 30 to 45 seconds, and simplifies visual presentation.
                <br/><br/>
                The Economy Agent tracks all interactions and performance metrics, calculating motivation scores and delivering 
                immediate feedback. It maintains individual student profiles showing progress across mathematical concepts 
                and attention improvement metrics, providing parents and educators with objective data on both academic 
                and therapeutic outcomes.
                <br/><br/>
                The integrated system delivers dual outcomes: students develop mathematical competency through structured 
                practice while simultaneously receiving therapeutic attention training, with all progress measured through 
                objective, quantifiable metrics rather than subjective assessments.
              </span>
            </div>
          </div>

          <div className={styles.subsection}>
            <div className={styles.subsectionLabel}>(iii) Explain exactly how/why it solves the current problems; i.e. why it is better than the prior-art; why would us use this rather than the prior art?</div>
            <div className={styles.answer}>
              <span className={styles.highlight}>
                <strong>Current Problem 1: ADHD Therapy Access Barriers</strong>
                <br/><br/>
                Traditional Therapy Limitations:
                <br/>
                Cost: $100-200/hour excludes most families
                <br/>
                Time: 60+ minute sessions plus travel time
                <br/>
                Access: Limited specialized ADHD therapists
                <br/>
                Measurement: Subjective progress assessment
                <br/><br/>
                This invention:
                <br/>
                Cost: Freemium model accessible to all families
                <br/>
                Time: 6-20 minute daily sessions fit family schedules
                <br/>
                Access: 24/7 availability through web platform
                <br/>
                Measurement: Objective performance metrics (mathematical grades) + attention improvement (quantified response time consistency)
                <br/><br/>
                <strong>Current Problem 2: Academic Performance Gaps</strong>
                <br/><br/>
                Existing Solutions Shortcomings:
                <br/>
                - EndeavorRx: Abstract gaming with no academic benefit
                <br/>
                - Educational apps: Generic content without ADHD-specific adaptation
                <br/>
                - Tutoring: Lacks attention training protocols
                <br/>
                - Medication: No skill development, side effects, costly; parents hesitate
                <br/><br/>
                This innovation:
                <br/>
                - Dual Outcome Delivery: Simultaneous attention training and math skill development with measurable progress in both domains
                <br/>
                - Family-Centered Approach: Addresses primary parental concern (academic success) while providing secondary benefits (automated grading, problem explanations, ease of use, affordability, transparent measurement, improved self-esteem)
                <br/>
                - Therapeutic Personalization: ADHD subtype-specific difficulty and timing adjustments based on real-time behavioral analysis
                <br/>
                - Sustainable over a student's entire school career with continuous adaptation
              </span>
            </div>
          </div>

          <div className={styles.subsection}>
            <div className={styles.subsectionLabel}>(iv) Explain all the advantages of the present invention</div>
            <div className={styles.answer}>
              <span className={styles.highlight}>
                <strong>SUPERIORITY OVER PRIOR ART:</strong>
                <br/><br/>
                vs. Traditional ADHD Therapy:
                <br/>
                - Accessibility: 24/7 availability vs. appointment scheduling
                <br/>
                - Cost: Freemium model vs. $100-200/hour
                <br/>
                - Measurement: Objective millisecond-precision data vs. subjective assessment
                <br/>
                - Academic Integration: Mathematical skill development vs. attention-only focus
                <br/>
                - Scalability: Unlimited concurrent users vs. one-on-one limitations
                <br/><br/>
                vs. EndeavorRx (FDA-cleared digital therapeutic):
                <br/>
                - Academic Benefit: Real mathematical learning vs. abstract gaming
                <br/>
                - Content Acceptance: Educational focus vs. entertainment resistance
                <br/>
                - Transfer Value: Classroom-relevant skills vs. isolated cognitive training
                <br/>
                - Family Preference: Academic progress priority vs. gaming concerns
                <br/>
                - Multi-Agent Architecture: Three specialized AI systems vs. single-focus gaming engine
                <br/><br/>
                vs. Educational Apps (Khan Academy, IXL):
                <br/>
                - ADHD Specialization: Attention-aware adaptation vs. generic delivery
                <br/>
                - Therapeutic Protocol: Clinical intervention vs. standard tutoring
                <br/>
                - Behavioral Monitoring: Real-time attention tracking vs. simple progress tracking
                <br/>
                - Personalization: ADHD subtype-specific protocols vs. one-size-fits-all
                <br/>
                - Cognitive Load Management: Therapeutic dosing vs. unlimited problem presentation
                <br/><br/>
                vs. Medication:
                <br/>
                - Side Effects: No physical risks vs. appetite/sleep concerns
                <br/>
                - Skill Development: Builds permanent mathematical abilities vs. temporary symptom management
                <br/>
                - Dependency: Self-contained improvement vs. ongoing medication requirement
                <br/>
                - Cost: One-time platform access vs. ongoing pharmaceutical expenses
              </span>
            </div>
          </div>

        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionNumber}>8) What is the key NOVELTY of your invention?</div>
        <div className={styles.sectionContent}>
          <div className={styles.answer}>
            <span className={styles.highlight}>
              <strong>1. NOVEL Multi-Component AI Architecture for ADHD Therapy</strong>
              <br/>
              First-ever deployment of specialized AI components working in concert for ADHD therapeutic intervention, 
              comprising at minimum:
              <br/>
              • Behavioral Pattern Detection Component - Real-time analysis during cognitive tasks with millisecond precision
              <br/>
              • Therapeutic Intervention Component - Automated protocol delivery with ADHD subtype differentiation
              <br/>
              • Motivational Management Component - Evidence-based reinforcement and progress tracking with objective metrics
              <br/>
              These components may be implemented as separate agents, integrated within fewer agents, or distributed across 
              multiple agents while maintaining the distinct functional capabilities and real-time coordination.
              <br/>
              Prior Art: Existing digital therapeutics use single-algorithm approaches or human-delivered therapy
              <br/><br/>
              <strong>2. NOVEL Academic Content Integration with Therapeutic Intervention</strong>
              <br/>
              Dual-purpose mathematical problem-solving tasks that simultaneously:
              <br/>
              • Deliver therapeutic attention training through cognitive load management
              <br/>
              • Advance academic mathematical skills with curriculum alignment
              <br/>
              • Provide measurable outcomes in both therapeutic and educational domains
              <br/>
              Prior Art: Current cognitive training platforms use abstract, non-academic tasks with no educational value
              <br/><br/>
              <strong>3. NOVEL Real-Time ADHD Subtype Detection and Adaptive Protocols</strong>
              <br/>
              AI-powered real-time identification of:
              <br/>
              • ADHD subtypes (Inattentive, Hyperactive-Impulsive, Combined) through behavioral pattern analysis
              <br/>
              • Dynamic attention states with 10-15 second prediction capability
              <br/>
              • Automatic deployment of subtype-specific therapeutic protocols with quantified parameters
              <br/>
              Prior Art: Existing platforms use one-size-fits-all approaches without subtype differentiation or real-time adaptation
              <br/><br/>
              <strong>4. NOVEL Precision Therapeutic Dosing Through Cognitive Load Management</strong>
              <br/>
              Automated therapeutic dosing that:
              <br/>
                • Reduces difficulty when accuracy drops below therapeutic thresholds (70% inattentive, 75% hyperactive)
                <br/>
                • Increases complexity to maintain optimal challenge zones with 10-15% incremental adjustments
                <br/>
                • Delivers therapy through academic content rather than abstract exercises
                <br/>
                • Measures cognitive load through quantifiable metrics (response times, accuracy trends, engagement patterns)
              <br/>
              Prior Art: Manual adjustment by human therapists with subjective assessment and no quantified dosing protocols
            </span>
          </div>
        </div>
      </div>

      <div className={styles.signature}>
        <div className={styles.signatureBlock}>
          <strong>INVENTOR:</strong> Fei Fang
          <br/>
          <strong>DATE:</strong> June 26, 2025
          <br/>
          <strong>SIGNED AT (City and State):</strong> Hong Kong
        </div>
      </div>
    </div>
  );
};

export default InventionDisclosure;
