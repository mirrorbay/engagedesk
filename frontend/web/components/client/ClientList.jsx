import React, { useState, useEffect } from "react";
import {
  Mail,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Plus,
  Trash2,
} from "lucide-react";
import { clientService } from "../../services/clientService";
import ClientModal from "./ClientModal";
import styles from "../../styles/client/clientList.module.css";

const ClientList = ({ onClientSelect, selectedClientId }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [showClientModal, setShowClientModal] = useState(false);

  const fetchClients = async (page = 1, searchTerm = search) => {
    try {
      setLoading(true);
      const params = {
        page: page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder,
        search: searchTerm,
      };

      const result = await clientService.getClients(params);

      if (result.success) {
        setClients(result.data.clients);
        setPagination(result.data.pagination);
        setError(null);

        // Auto-select first client if no client is currently selected and clients exist
        if (result.data.clients.length > 0 && !selectedClientId) {
          onClientSelect(result.data.clients[0]);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchClients(1, search);
  };

  const handlePageChange = (newPage) => {
    fetchClients(newPage);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ChevronsUpDown size={14} />;
    return sortOrder === "asc" ? (
      <ChevronUp size={14} />
    ) : (
      <ChevronDown size={14} />
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleClientAction = (client, action = "select") => {
    onClientSelect(client, action);
  };

  const handleDeleteClient = async (client) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${client.firstName} ${client.lastName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const result = await clientService.deleteClient(client._id);
      if (result.success) {
        // Refresh the client list
        await fetchClients(pagination.currentPage);
        // If the deleted client was selected, clear selection
        if (selectedClientId === client._id) {
          onClientSelect(null);
        }
      } else {
        alert(`Failed to delete client: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Failed to delete client. Please try again.");
    }
  };

  const handleCreateClient = () => {
    setShowClientModal(true);
  };

  const handleClientCreated = async (newClient) => {
    // Refresh the client list
    await fetchClients(pagination.currentPage);
    // Select the new client
    if (newClient) {
      onClientSelect(newClient);
    }
  };

  if (loading && clients.length === 0) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading clients...</p>
      </div>
    );
  }

  return (
    <div className={styles.clientList}>
      <div className={styles.listHeader}>
        <h2>Client List ({pagination.totalCount})</h2>
        <div className={styles.headerActions}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>
          <button onClick={handleCreateClient} className={styles.createButton}>
            <Plus size={16} />
            New Client
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={() => fetchClients()} className={styles.retryButton}>
            Retry
          </button>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.clientTable}>
          <thead>
            <tr>
              <th
                onClick={() => handleSort("firstName")}
                className={styles.sortable}
              >
                Name {getSortIcon("firstName")}
              </th>
              <th
                onClick={() => handleSort("email")}
                className={styles.sortable}
              >
                Email {getSortIcon("email")}
              </th>
              <th
                onClick={() => handleSort("company")}
                className={styles.sortable}
              >
                Company {getSortIcon("company")}
              </th>
              <th
                onClick={() => handleSort("createdAt")}
                className={styles.sortable}
              >
                Added {getSortIcon("createdAt")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client._id}
                className={
                  selectedClientId === client._id ? styles.selected : ""
                }
                onClick={() => handleClientAction(client)}
              >
                <td>
                  <div className={styles.clientName}>
                    {client.title && (
                      <span className={styles.title}>{client.title}</span>
                    )}
                    <span>
                      {client.firstName} {client.lastName}
                    </span>
                    {client.nickname && (
                      <span className={styles.nickname}>
                        "{client.nickname}"
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <a
                    href={`mailto:${client.email}`}
                    className={styles.emailLink}
                  >
                    {client.email}
                  </a>
                </td>
                <td>
                  <div className={styles.companyInfo}>
                    {client.company && (
                      <div className={styles.company}>{client.company}</div>
                    )}
                    {client.position && (
                      <div className={styles.position}>{client.position}</div>
                    )}
                  </div>
                </td>
                <td>{formatDate(client.createdAt)}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.emailButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClientAction(client, "email");
                      }}
                      title="Send email"
                    >
                      <Mail size={16} />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClient(client);
                      }}
                      title="Delete client"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {clients.length === 0 && !loading && (
        <div className={styles.noResults}>
          <p>No clients found.</p>
          {search && (
            <button
              onClick={() => {
                setSearch("");
                fetchClients(1, "");
              }}
              className={styles.clearSearch}
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage || loading}
            className={styles.pageButton}
          >
            Previous
          </button>

          <span className={styles.pageInfo}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage || loading}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}

      {loading && clients.length > 0 && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {/* Client Modal */}
      <ClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
};

export default ClientList;
