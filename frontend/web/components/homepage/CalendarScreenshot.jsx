import React from "react";
import { Plus, Settings, CheckCircle } from "lucide-react";
import styles from "../../styles/homepage/calendarScreenshot.module.css";

const CalendarScreenshot = () => {
  return (
    <div className={styles.mockupContainer}>
      <div className={styles.mockupWindow}>
        <div className={styles.mockupHeader}>
          <div className={styles.mockupControls}>
            <div className={styles.mockupControl}></div>
            <div className={styles.mockupControl}></div>
            <div className={styles.mockupControl}></div>
          </div>
          <div className={styles.mockupTitle}>Calendar & Actions</div>
          <div className={styles.mockupActions}>
            <button className={styles.mockupButton}>
              <Plus size={16} />
              New Event
            </button>
            <button className={styles.mockupButton}>
              <Settings size={16} />
              Settings
            </button>
          </div>
        </div>
        <div className={styles.calendarView}>
          <div className={styles.calendarHeader}>
            <h3>December 2024</h3>
            <div className={styles.viewToggle}>
              <button className={styles.viewButton}>Week</button>
              <button className={styles.viewButton + " " + styles.active}>
                Month
              </button>
            </div>
          </div>
          <div className={styles.calendarGrid}>
            <div className={styles.calendarDay}>
              <div className={styles.dayNumber}>9</div>
              <div className={styles.calendarEvent + " " + styles.eventMeeting}>
                <div className={styles.eventTime}>2:00 PM</div>
                <div className={styles.eventTitle}>
                  BMW X5 Test Drive - Susan Oliver
                </div>
              </div>
            </div>
            <div className={styles.calendarDay}>
              <div className={styles.dayNumber}>10</div>
              <div
                className={styles.calendarEvent + " " + styles.eventDeadline}
              >
                <div className={styles.eventTime}>5:00 PM</div>
                <div className={styles.eventTitle}>
                  Landscape Proposal Due - GreenScape
                </div>
              </div>
            </div>
            <div className={styles.calendarDay}>
              <div className={styles.dayNumber}>11</div>
              <div
                className={styles.calendarEvent + " " + styles.eventFollowup}
              >
                <div className={styles.eventTime}>10:30 AM</div>
                <div className={styles.eventTitle}>
                  Property Inspection - Coastal Properties
                </div>
              </div>
              <div className={styles.calendarEvent + " " + styles.eventMeeting}>
                <div className={styles.eventTime}>3:00 PM</div>
                <div className={styles.eventTitle}>
                  Coaching Session - David Kim
                </div>
              </div>
            </div>
            <div className={styles.calendarDay}>
              <div className={styles.dayNumber}>12</div>
              <div
                className={styles.calendarEvent + " " + styles.eventDeadline}
              >
                <div className={styles.eventTime}>12:00 PM</div>
                <div className={styles.eventTitle}>
                  Loan Documentation - Secure Lending
                </div>
              </div>
            </div>
            <div className={styles.calendarDay}>
              <div className={styles.dayNumber}>13</div>
              <div className={styles.calendarEvent + " " + styles.eventMeeting}>
                <div className={styles.eventTime}>9:00 AM</div>
                <div className={styles.eventTitle}>
                  Wellness Consultation - Lisa Thompson
                </div>
              </div>
              <div
                className={styles.calendarEvent + " " + styles.eventFollowup}
              >
                <div className={styles.eventTime}>4:30 PM</div>
                <div className={styles.eventTitle}>
                  Follow-up: Auto Financing
                </div>
              </div>
            </div>
            <div className={styles.calendarDay}>
              <div className={styles.dayNumber}>14</div>
            </div>
            <div className={styles.calendarDay}>
              <div className={styles.dayNumber}>15</div>
            </div>
          </div>
        </div>
        <div className={styles.actionsList}>
          <h4>High-Priority Actions</h4>
          <div className={styles.actionItem}>
            <CheckCircle size={16} />
            <span>
              Send financing pre-approval to Susan Oliver ($47,500 BMW deal)
            </span>
            <span className={styles.actionDue}>Due: Today 6:00 PM</span>
          </div>
          <div className={styles.actionItem}>
            <CheckCircle size={16} />
            <span>Complete landscape redesign proposal for Mike Rodriguez</span>
            <span className={styles.actionDue}>Due: Tomorrow 5:00 PM</span>
          </div>
          <div className={styles.actionItem}>
            <CheckCircle size={16} />
            <span>
              Submit final loan application documents ($425K mortgage)
            </span>
            <span className={styles.actionDue}>Due: Dec 12</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarScreenshot;
