package com.jotomo.pomo.task;

import com.jotomo.pomo.project.Project;
import com.jotomo.pomo.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    Optional<Task> findById(UUID id);

    Optional<Task> findByOwnerAndTitleAndProject(UserEntity owner, String title, Project project);
    
    List<Task> findTasksByOwner(UserEntity owner);

    List<Task> findTasksByOwnerAndProject(UserEntity owner, Project project);

    List<Task> findTasksByOwnerAndProjectAndStatus(UserEntity owner, Project project, Status status);
}
