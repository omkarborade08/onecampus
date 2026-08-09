package com.onecampus.chat.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PresenceService {

    private final Map<String, Long> onlineUsers = new ConcurrentHashMap<>();

    public void setOnline(String userId) {
        onlineUsers.put(userId, System.currentTimeMillis());
    }

    public void setOffline(String userId) {
        onlineUsers.remove(userId);
    }

    public boolean isOnline(String userId) {
        return onlineUsers.containsKey(userId);
    }
}

