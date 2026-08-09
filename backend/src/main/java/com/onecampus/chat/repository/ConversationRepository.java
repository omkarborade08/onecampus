package com.onecampus.chat.repository;

import com.onecampus.chat.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, String> {
    List<Conversation> findByBuyerIdOrderByCreatedAtDesc(String buyerId);
    List<Conversation> findBySellerIdOrderByCreatedAtDesc(String sellerId);
}

