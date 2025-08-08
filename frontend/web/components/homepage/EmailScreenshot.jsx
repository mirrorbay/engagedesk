import React from "react";
import { Plus, BarChart3, Send, Eye, MousePointer, Clock } from "lucide-react";
import styles from "../../styles/homepage/emailScreenshot.module.css";

const EmailScreenshot = () => {
  return (
    <div className={styles.mockupContainer}>
      <div className={styles.mockupWindow}>
        <div className={styles.mockupHeader}>
          <div className={styles.mockupControls}>
            <div className={styles.mockupControl}></div>
            <div className={styles.mockupControl}></div>
            <div className={styles.mockupControl}></div>
          </div>
          <div className={styles.mockupTitle}>Email Campaign Manager</div>
          <div className={styles.mockupActions}>
            <button className={styles.mockupButton}>
              <Plus size={16} />
              New Email
            </button>
            <button className={styles.mockupButton}>
              <BarChart3 size={16} />
              Analytics
            </button>
          </div>
        </div>
        <div className={styles.emailComposer}>
          <div className={styles.emailHeader}>
            <div className={styles.emailField}>
              <label>To:</label>
              <input value="susan.oliver@premierautosales.com" readOnly />
            </div>
            <div className={styles.emailField}>
              <label>Subject:</label>
              <input
                value="Your 2024 BMW X5 - Test Drive Confirmation & Financing Options"
                readOnly
              />
            </div>
            <div className={styles.templateSelector}>
              <label>Template:</label>
              <select>
                <option>Hot Lead Follow-up</option>
                <option>Financing Pre-approval</option>
                <option>Trade-in Evaluation</option>
                <option>Service Appointment</option>
                <option>Welcome New Customer</option>
              </select>
            </div>
          </div>
          <div className={styles.emailBody}>
            <div className={styles.emailContent}>
              <p>Hi Susan,</p>
              <p>
                Thank you for your interest in the 2024 BMW X5 xDrive40i we
                discussed yesterday. I'm excited to help you find the perfect
                vehicle for your family's needs.
              </p>
              <p>
                <strong>Test Drive Confirmation:</strong>
              </p>
              <ul>
                <li>
                  Vehicle: 2024 BMW X5 xDrive40i - Alpine White, Premium Package
                </li>
                <li>Date: Tomorrow (December 9th) at 2:00 PM</li>
                <li>
                  Duration: 30-45 minutes including highway and city driving
                </li>
                <li>Location: Premier Auto Group - 1247 Commerce Drive</li>
              </ul>

              <p>
                <strong>Financing Pre-Approval Update:</strong>
              </p>
              <p>
                Great news! Based on your credit profile, you've been
                pre-approved for:
              </p>
              <ul>
                <li>Loan Amount: Up to $52,000</li>
                <li>Interest Rate: 4.9% APR (excellent credit tier)</li>
                <li>Term Options: 60 or 72 months</li>
                <li>Monthly Payment: Approximately $785/month (60 months)</li>
              </ul>

              <p>
                <strong>Trade-in Value:</strong>
              </p>
              <p>
                Your 2019 Acura MDX preliminary evaluation: $28,500 - $31,200
                depending on final inspection.
              </p>

              <p>
                I'll have all the paperwork ready for your visit tomorrow.
                Please bring your driver's license, insurance card, and the
                title for your trade-in vehicle.
              </p>

              <p>Looking forward to seeing you tomorrow!</p>
              <p>
                Best regards,
                <br />
                Marcus Johnson
                <br />
                Senior Sales Consultant
                <br />
                Premier Auto Group
                <br />
                Direct: (555) 234-7890
                <br />
                marcus.johnson@premierautosales.com
              </p>
            </div>
          </div>
          <div className={styles.emailActions}>
            <button className={styles.sendButton}>
              <Send size={16} />
              Send & Track
            </button>
            <button className={styles.saveButton}>Save Draft</button>
          </div>
        </div>
        <div className={styles.trackingStats}>
          <div className={styles.trackingStat}>
            <Eye size={16} />
            <span>Opens: 8</span>
          </div>
          <div className={styles.trackingStat}>
            <MousePointer size={16} />
            <span>Clicks: 5</span>
          </div>
          <div className={styles.trackingStat}>
            <Clock size={16} />
            <span>Last opened: 47 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailScreenshot;
