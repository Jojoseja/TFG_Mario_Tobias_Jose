package com.jotomo.pomo.project;

import com.jotomo.pomo.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    Optional<Project> findById(UUID id);

    List<Project> findByOwner(UserEntity owner);

    Optional<Project> findByOwnerAndName(UserEntity owner, String name);
}
