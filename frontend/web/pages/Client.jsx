import React, { useState } from "react";
import { Mail } from "lucide-react";
import styles from "../styles/client.module.css";
import ClientList from "../components/client/ClientList";
import ClientDetails from "../components/client/ClientDetails";
import EmailModal from "../components/client/EmailModal";
import { clientService } from "../services/clientService";

function ClientPage() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailClient, setEmailClient] = useState(null);
  const [loadingClientDetails, setLoadingClientDetails] = useState(false);

  const handleClientSelect = async (client, action = "select") => {
    if (action === "email") {
      setEmailClient(client);
      setShowEmailModal(true);
    } else {
      // Fetch full client data with populated team comments
      setLoadingClientDetails(true);
      try {
        const result = await clientService.getClient(client._id);
        if (result.success) {
          setSelectedClient(result.data);
        } else {
          console.error("Failed to fetch client details:", result.error);
          // Fallback to the basic client data
          setSelectedClient(client);
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
        // Fallback to the basic client data
        setSelectedClient(client);
      } finally {
        setLoadingClientDetails(false);
      }
    }
  };

  const handleClientUpdate = (updatedClient) => {
    setSelectedClient(updatedClient);
  };

  const handleEmailSent = (result) => {
    console.log("Email sent successfully:", result);
    // You could show a toast notification here
    // or refresh the client interactions
  };

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setEmailClient(null);
  };

  return (
    <div className={styles.clientPage}>
      <div className={styles.header}>
        <h1 className="text-3xl font-bold mb-md">Client Management</h1>
        <p className="text-lg text-secondary mb-lg">
          Manage client information and interactions
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.clientListRow}>
          <div className="card">
            <div className="card-body">
              <ClientList
                onClientSelect={handleClientSelect}
                selectedClientId={selectedClient?._id}
              />
            </div>
          </div>
        </div>

        <div className={styles.clientDetailsRow}>
          <ClientDetails
            client={selectedClient}
            onClientUpdate={handleClientUpdate}
            onClientSelect={handleClientSelect}
            loading={loadingClientDetails}
          />
        </div>
      </div>

      {showEmailModal && emailClient && (
        <EmailModal
          client={emailClient}
          onClose={handleCloseEmailModal}
          onSent={handleEmailSent}
        />
      )}
    </div>
  );
}

export default ClientPage;
