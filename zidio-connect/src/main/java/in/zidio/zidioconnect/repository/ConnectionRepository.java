package in.zidio.zidioconnect.repository;

import in.zidio.zidioconnect.model.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    List<Connection> findByReceiverEmailAndStatus(String receiverEmail, Connection.Status status);
    List<Connection> findBySenderEmailOrReceiverEmail(String senderEmail, String receiverEmail);
    Optional<Connection> findBySenderEmailAndReceiverEmail(String senderEmail, String receiverEmail);
}
