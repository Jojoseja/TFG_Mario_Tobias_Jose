package com.jotomo.pomo.logging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class AuditLogger {

    private static final Logger auditLog = LoggerFactory.getLogger("AUDIT");

    public void log(
            String actor,
            AuditAction action,
            String targetType,
            Object targetId,
            String details
    ) {
        auditLog.info(
                "actor={} action={} targetType={} targetId={} details={}",
                sanitize(actor),
                action,
                sanitize(targetType),
                targetId,
                sanitize(details)
        );
    }

    public void log(
            String actor,
            AuditAction action,
            String targetType,
            Object targetId
    ) {
        log(actor, action, targetType, targetId, null);
    }

    private String sanitize(String value) {
        if (value == null) {
            return "-";
        }
        return value.replaceAll("[\\r\\n\\t]", "_");
    }
}