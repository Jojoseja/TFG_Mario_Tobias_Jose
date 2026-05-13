package com.jotomo.pomo.project.repository;

import com.jotomo.pomo.project.model.Project;
import com.jotomo.pomo.user.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByOwner(UserEntity owner);

    Optional<Project> findByOwnerAndName(UserEntity owner, String name);
}
