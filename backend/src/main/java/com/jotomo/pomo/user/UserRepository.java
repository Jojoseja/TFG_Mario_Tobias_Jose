package com.jotomo.pomo.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findById(UUID id);

    boolean existsByEmail(String email);

    Optional<UserEntity> findByEmail(String email);

}
