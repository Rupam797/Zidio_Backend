package in.zidio.zidioconnect.repository;

import in.zidio.zidioconnect.model.Job;
import in.zidio.zidioconnect.model.Recruiter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByIsActiveTrue();
    List<Job> findByRecruiter(Recruiter recruiter);

    @Query("SELECT j FROM Job j WHERE j.isActive = true " +
           "AND (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:type IS NULL OR j.type = :type) " +
           "AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "ORDER BY j.createdAt DESC")
    Page<Job> searchJobs(
        @Param("keyword") String keyword,
        @Param("type") String type,
        @Param("location") String location,
        Pageable pageable
    );

    long countByIdIn(List<Long> ids);
}
