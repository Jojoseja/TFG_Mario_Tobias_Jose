package com.jotomo.pomo.task.repository;

import com.jotomo.pomo.project.model.Project;
import com.jotomo.pomo.task.models.Task;
import com.jotomo.pomo.task.enums.Status;
import com.jotomo.pomo.user.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    Optional<Task> findByOwnerAndTitleAndProject(UserEntity owner, String title, Project project);
    
    List<Task> findTasksByOwner(UserEntity owner);

    List<Task> findTasksByOwnerAndProject(UserEntity owner, Project project);

    List<Task> findTasksByOwnerAndProjectAndStatus(UserEntity owner, Project project, Status status);

    List<Task> findTasksByOwnerAndStatus(UserEntity owner, Status status);

    Optional<Task> findTopByOwnerAndCompletedAtIsNotNullOrderByCompletedAtDesc(UserEntity owner);
}
