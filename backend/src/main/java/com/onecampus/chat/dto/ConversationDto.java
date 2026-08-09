package com.onecampus.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationDto {
    private String id;
    private String name;
    private String initials;
    private String lastMessage;
    private String time;
    private boolean online;
    private Integer unread;
    private String otherUserId;
    private String otherUserName;

    private boolean otherUserOnline;
}

