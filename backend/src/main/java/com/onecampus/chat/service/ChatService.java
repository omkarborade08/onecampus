package com.onecampus.chat.service;

import com.onecampus.identity.entity.User;
import com.onecampus.identity.repository.UserRepository;
import com.onecampus.chat.dto.ConversationDto;
import com.onecampus.chat.dto.MessageDto;
import com.onecampus.chat.dto.SendMessageRequest;
import com.onecampus.chat.entity.Conversation;
import com.onecampus.chat.entity.Message;
import com.onecampus.chat.entity.Message.MessageType;
import com.onecampus.chat.repository.ConversationRepository;
import com.onecampus.chat.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final PresenceService presenceService;

    public List<ConversationDto> getConversations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Conversation> buyerConvs = conversationRepository.findByBuyerIdOrderByCreatedAtDesc(user.getId());
        List<Conversation> sellerConvs = conversationRepository.findBySellerIdOrderByCreatedAtDesc(user.getId());

        java.util.Set<String> seen = new java.util.LinkedHashSet<>();
        List<Conversation> allConvs = new java.util.ArrayList<>();
        for (Conversation c : buyerConvs) {
            if (seen.add(c.getId())) allConvs.add(c);
        }
        for (Conversation c : sellerConvs) {
            if (seen.add(c.getId())) allConvs.add(c);
        }

        return allConvs.stream()
                .map(conv -> toConversationDto(conv, user.getId()))
                .collect(Collectors.toList());
    }

    public ConversationDto getOrCreateConversation(String otherUserId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new RuntimeException("Other user not found"));

        List<Conversation> buyerConvs = conversationRepository.findByBuyerIdOrderByCreatedAtDesc(currentUser.getId());
        List<Conversation> sellerConvs = conversationRepository.findBySellerIdOrderByCreatedAtDesc(currentUser.getId());

        java.util.Set<String> seen = new java.util.LinkedHashSet<>();
        List<Conversation> allConvs = new java.util.ArrayList<>();
        for (Conversation c : buyerConvs) {
            if (seen.add(c.getId())) allConvs.add(c);
        }
        for (Conversation c : sellerConvs) {
            if (seen.add(c.getId())) allConvs.add(c);
        }

        Optional<Conversation> existing = allConvs.stream()
                .filter(conv -> (conv.getBuyer().getId().equals(currentUser.getId()) && conv.getSeller().getId().equals(otherUser.getId())) ||
                                (conv.getBuyer().getId().equals(otherUser.getId()) && conv.getSeller().getId().equals(currentUser.getId())))
                .findFirst();

        Conversation conversation = existing.orElseGet(() -> {
            Conversation newConv = Conversation.builder()
                    .name(otherUser.getName())
                    .initials(otherUser.getName().substring(0, 2).toUpperCase())
                    .lastMessage("")
                    .time("")
                    .online(false)
                    .unreadBuyer(0)
                    .unreadSeller(0)
                    .buyer(currentUser.getId().equals(otherUser.getId()) ? otherUser : currentUser)
                    .seller(currentUser.getId().equals(otherUser.getId()) ? currentUser : otherUser)
                    .build();
            return conversationRepository.save(newConv);
        });

        return toConversationDto(conversation, currentUser.getId());
    }

    public List<MessageDto> getMessages(String conversationId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        markAsReadInternal(conversation, user.getId());

        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId)
                .stream()
                .map(msg -> MessageDto.from(msg, user.getId()))
                .collect(Collectors.toList());
    }

    public MessageDto sendMessage(SendMessageRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Conversation conversation = conversationRepository.findById(request.getConversationId())
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        MessageType messageType = MessageType.TEXT;
        if ("IMAGE".equalsIgnoreCase(request.getType()) && request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            messageType = MessageType.IMAGE;
        }

        Message message = Message.builder()
                .text(request.getText() != null ? request.getText() : "")
                .imageUrl(request.getImageUrl())
                .type(messageType)
                .mine(false)
                .time(LocalTime.now(Clock.system(ZoneId.of("Asia/Kolkata"))).format(DateTimeFormatter.ofPattern("HH:mm")))
                .conversation(conversation)
                .sender(user)
                .build();

        messageRepository.save(message);

        conversation.setLastMessage(messageType == MessageType.IMAGE ? "📷 Image" : request.getText());
        conversation.setTime(message.getTime());

        if (conversation.getBuyer() != null && conversation.getBuyer().getId().equals(user.getId())) {
            conversation.setUnreadSeller(conversation.getUnreadSeller() + 1);
            conversation.setUnreadBuyer(0);
        } else {
            conversation.setUnreadBuyer(conversation.getUnreadBuyer() + 1);
            conversation.setUnreadSeller(0);
        }

        conversationRepository.save(conversation);

        MessageDto dto = MessageDto.from(message, user.getId());

        messagingTemplate.convertAndSend("/topic/conversation/" + conversation.getId() + "/messages", dto);

        return dto;
    }

    public void markAsRead(String conversationId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        markAsReadInternal(conversation, user.getId());
        conversationRepository.save(conversation);
    }

    public long getUnreadCount() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Conversation> buyerConvs = conversationRepository.findByBuyerIdOrderByCreatedAtDesc(user.getId());
        List<Conversation> sellerConvs = conversationRepository.findBySellerIdOrderByCreatedAtDesc(user.getId());

        java.util.Set<String> seen = new java.util.LinkedHashSet<>();
        List<Conversation> allConvs = new java.util.ArrayList<>();
        for (Conversation c : buyerConvs) {
            if (seen.add(c.getId())) allConvs.add(c);
        }
        for (Conversation c : sellerConvs) {
            if (seen.add(c.getId())) allConvs.add(c);
        }

        return allConvs.stream()
                .mapToLong(conv -> {
                    if (conv.getBuyer() != null && conv.getBuyer().getId().equals(user.getId())) {
                        return conv.getUnreadBuyer();
                    } else {
                        return conv.getUnreadSeller();
                    }
                })
                .sum();
    }

    public void updatePresence(String userId, String status) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        if ("ONLINE".equalsIgnoreCase(status)) {
            presenceService.setOnline(userId);
            user.setOnline(true);
            user.setLastSeen(java.time.LocalDateTime.now());
        } else {
            presenceService.setOffline(userId);
            user.setOnline(false);
            user.setLastSeen(java.time.LocalDateTime.now());
        }
        userRepository.save(user);
    }

    private void markAsReadInternal(Conversation conversation, String userId) {
        if (conversation.getBuyer() != null && conversation.getBuyer().getId().equals(userId)) {
            conversation.setUnreadBuyer(0);
        }
        if (conversation.getSeller() != null && conversation.getSeller().getId().equals(userId)) {
            conversation.setUnreadSeller(0);
        }
    }

    private ConversationDto toConversationDto(Conversation conversation, String currentUserId) {
        User otherUser = null;
        if (conversation.getBuyer() != null && conversation.getBuyer().getId().equals(currentUserId)) {
            otherUser = conversation.getSeller();
        } else if (conversation.getSeller() != null && conversation.getSeller().getId().equals(currentUserId)) {
            otherUser = conversation.getBuyer();
        }

        int unread = 0;
        if (conversation.getBuyer() != null && conversation.getBuyer().getId().equals(currentUserId)) {
            unread = conversation.getUnreadBuyer();
        } else if (conversation.getSeller() != null && conversation.getSeller().getId().equals(currentUserId)) {
            unread = conversation.getUnreadSeller();
        }

        return ConversationDto.builder()
                .id(conversation.getId())
                .name(conversation.getName())
                .initials(conversation.getInitials())
                .lastMessage(conversation.getLastMessage())
                .time(conversation.getTime())
                .online(conversation.isOnline())
                .unread(unread)
                .otherUserId(otherUser != null ? otherUser.getId() : null)
                .otherUserName(otherUser != null ? otherUser.getName() : "Unknown")

                .otherUserOnline(otherUser != null && otherUser.isOnline())
                .build();
    }
}

