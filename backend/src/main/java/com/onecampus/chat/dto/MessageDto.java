package com.onecampus.chat.dto;

import com.onecampus.chat.entity.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDto {
    private String id;
    private String conversationId;
    private String text;
    private String imageUrl;
    private String type;
    private boolean mine;
    private String time;
    private String senderName;

    public static MessageDto from(Message message, String currentUserId) {
        boolean mine = message.getSender() != null && message.getSender().getId().equals(currentUserId);
        return MessageDto.builder()
                .id(message.getId())
                .conversationId(message.getConversation().getId())
                .text(message.getText())
                .imageUrl(message.getImageUrl())
                .type(message.getType() != null ? message.getType().name() : Message.MessageType.TEXT.name())
                .mine(mine)
                .time(message.getTime())
                .senderName(message.getSender() != null ? message.getSender().getName() : "Unknown")
                .build();
    }
}

