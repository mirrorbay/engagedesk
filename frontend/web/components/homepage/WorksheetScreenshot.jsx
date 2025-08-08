import React from "react";
import { Plus, Search, Filter, Download } from "lucide-react";
import styles from "../../styles/homepage/worksheetScreenshot.module.css";

const WorksheetScreenshot = () => {
  return (
    <div className={styles.mockupContainer}>
      <div className={styles.mockupWindow}>
        <div className={styles.mockupHeader}>
          <div className={styles.mockupControls}>
            <div className={styles.mockupControl}></div>
            <div className={styles.mockupControl}></div>
            <div className={styles.mockupControl}></div>
          </div>
          <div className={styles.mockupTitle}>Client Data Manager</div>
          <div className={styles.mockupActions}>
            <button className={styles.mockupButton}>
              <Plus size={16} />
              Add Client
            </button>
            <button className={styles.mockupButton}>
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
        <div className={styles.mockupToolbar}>
          <div className={styles.searchBox}>
            <Search size={16} />
            <input placeholder="Search clients..." />
          </div>
          <button className={styles.filterButton}>
            <Filter size={16} />
            Filter
          </button>
        </div>
        <div className={styles.worksheetGrid}>
          <div className={styles.worksheetHeader}>
            <div className={styles.worksheetCell}>Client Name</div>
            <div className={styles.worksheetCell}>Status</div>
            <div className={styles.worksheetCell}>Last Contact</div>
            <div className={styles.worksheetCell}>Next Action</div>
            <div className={styles.worksheetCell}>Progress</div>
            <div className={styles.worksheetCell}>Value</div>
          </div>
          <div className={styles.worksheetRow}>
            <div className={styles.worksheetCell}>
              Premier Auto Group - Susan Oliver
            </div>
            <div className={styles.worksheetCell}>
              <span className={styles.statusActive}>Hot Lead</span>
            </div>
            <div className={styles.worksheetCell}>Yesterday 3:42 PM</div>
            <div className={styles.worksheetCell}>
              Schedule test drive appointment
            </div>
            <div className={styles.worksheetCell}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
            <div className={styles.worksheetCell}>$47,500</div>
          </div>
          <div className={styles.worksheetRow}>
            <div className={styles.worksheetCell}>
              GreenScape Solutions - Mike Rodriguez
            </div>
            <div className={styles.worksheetCell}>
              <span className={styles.statusPending}>Proposal Sent</span>
            </div>
            <div className={styles.worksheetCell}>Dec 6, 2:15 PM</div>
            <div className={styles.worksheetCell}>
              Follow up on landscape redesign quote
            </div>
            <div className={styles.worksheetCell}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>
            <div className={styles.worksheetCell}>$28,900</div>
          </div>
          <div className={styles.worksheetRow}>
            <div className={styles.worksheetCell}>
              Coastal Properties - Jennifer Walsh
            </div>
            <div className={styles.worksheetCell}>
              <span className={styles.statusCompleted}>Contract Signed</span>
            </div>
            <div className={styles.worksheetCell}>Dec 5, 11:30 AM</div>
            <div className={styles.worksheetCell}>
              Begin property management transition
            </div>
            <div className={styles.worksheetCell}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
            <div className={styles.worksheetCell}>$156,000/yr</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorksheetScreenshot;
