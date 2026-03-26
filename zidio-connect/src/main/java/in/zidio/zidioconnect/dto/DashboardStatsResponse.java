package in.zidio.zidioconnect.dto;

public class DashboardStatsResponse {

    private long totalApplications;
    private long shortlisted;
    private long rejected;
    private long pending;
    private long savedJobs;
    private long connections;
    private long profileViews;

    // Getters and Setters
    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getShortlisted() { return shortlisted; }
    public void setShortlisted(long shortlisted) { this.shortlisted = shortlisted; }

    public long getRejected() { return rejected; }
    public void setRejected(long rejected) { this.rejected = rejected; }

    public long getPending() { return pending; }
    public void setPending(long pending) { this.pending = pending; }

    public long getSavedJobs() { return savedJobs; }
    public void setSavedJobs(long savedJobs) { this.savedJobs = savedJobs; }

    public long getConnections() { return connections; }
    public void setConnections(long connections) { this.connections = connections; }

    public long getProfileViews() { return profileViews; }
    public void setProfileViews(long profileViews) { this.profileViews = profileViews; }
}
