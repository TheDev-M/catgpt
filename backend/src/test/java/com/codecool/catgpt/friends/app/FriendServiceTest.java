package com.codecool.catgpt.friends.app;

import com.codecool.catgpt.friends.api.dto.FriendResponse;
import com.codecool.catgpt.friends.domain.Friendship;
import com.codecool.catgpt.friends.domain.FriendshipRepository;
import com.codecool.catgpt.friends.domain.FriendshipStatus;
import com.codecool.catgpt.sse.SseService;
import com.codecool.catgpt.users.domain.User;
import com.codecool.catgpt.users.infra.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FriendServiceTest {

    @Mock private FriendshipRepository friendships;
    @Mock private UserRepository users;
    @Mock private SseService sse;
    @InjectMocks private FriendService service;

    private User me;
    private User other;

    @BeforeEach
    void setUp() {
        me = User.builder().username("alice").build();
        other = User.builder().username("bob").build();
        ReflectionTestUtils.setField(me, "id", 1L);
        ReflectionTestUtils.setField(other, "id", 2L);
    }

    // --- sendRequest ---

    @Test
    void sendRequest_validTarget_shouldCreatePendingFriendship() {
        when(users.findByUsername("bob")).thenReturn(Optional.of(other));
        when(friendships.findBetween(me, other)).thenReturn(Optional.empty());
        when(friendships.save(any(Friendship.class))).thenAnswer(inv -> {
            Friendship f = inv.getArgument(0);
            ReflectionTestUtils.setField(f, "id", 10L);
            return f;
        });

        FriendResponse result = service.sendRequest(me, "bob");

        assertThat(result.status()).isEqualTo(FriendshipStatus.PENDING);
        assertThat(result.username()).isEqualTo("bob");
        assertThat(result.isRequester()).isTrue();
        verify(friendships).save(any(Friendship.class));
    }

    @Test
    void sendRequest_toSelf_shouldThrowBadRequest() {
        var ex = assertThrows(ResponseStatusException.class,
                () -> service.sendRequest(me, "alice"));
        assertThat(ex.getStatusCode().value()).isEqualTo(400);
    }

    @Test
    void sendRequest_userNotFound_shouldThrowNotFound() {
        when(users.findByUsername("ghost")).thenReturn(Optional.empty());

        var ex = assertThrows(ResponseStatusException.class,
                () -> service.sendRequest(me, "ghost"));
        assertThat(ex.getStatusCode().value()).isEqualTo(404);
    }

    @Test
    void sendRequest_alreadyPending_shouldThrowConflict() {
        Friendship existing = Friendship.builder()
                .requester(me).receiver(other).status(FriendshipStatus.PENDING).build();

        when(users.findByUsername("bob")).thenReturn(Optional.of(other));
        when(friendships.findBetween(me, other)).thenReturn(Optional.of(existing));

        var ex = assertThrows(ResponseStatusException.class,
                () -> service.sendRequest(me, "bob"));
        assertThat(ex.getStatusCode().value()).isEqualTo(409);
    }

    @Test
    void sendRequest_alreadyFriends_shouldThrowConflict() {
        Friendship existing = Friendship.builder()
                .requester(me).receiver(other).status(FriendshipStatus.APPROVED).build();

        when(users.findByUsername("bob")).thenReturn(Optional.of(other));
        when(friendships.findBetween(me, other)).thenReturn(Optional.of(existing));

        var ex = assertThrows(ResponseStatusException.class,
                () -> service.sendRequest(me, "bob"));
        assertThat(ex.getStatusCode().value()).isEqualTo(409);
    }

    @Test
    void sendRequest_previouslyDeclined_shouldThrowConflict() {
        Friendship existing = Friendship.builder()
                .requester(other).receiver(me).status(FriendshipStatus.DECLINED).build();

        when(users.findByUsername("bob")).thenReturn(Optional.of(other));
        when(friendships.findBetween(me, other)).thenReturn(Optional.of(existing));

        var ex = assertThrows(ResponseStatusException.class,
                () -> service.sendRequest(me, "bob"));
        assertThat(ex.getStatusCode().value()).isEqualTo(409);
    }

    // --- approveRequest ---

    @Test
    void approveRequest_pendingRequest_shouldSetApproved() {
        Friendship f = Friendship.builder()
                .requester(other).receiver(me).status(FriendshipStatus.PENDING).build();
        ReflectionTestUtils.setField(f, "id", 10L);

        when(friendships.findById(10L)).thenReturn(Optional.of(f));
        when(friendships.save(f)).thenReturn(f);

        FriendResponse result = service.approveRequest(me, 10L);

        assertThat(result.status()).isEqualTo(FriendshipStatus.APPROVED);
        verify(friendships).save(f);
    }

    @Test
    void approveRequest_notReceiver_shouldThrowForbidden() {
        Friendship f = Friendship.builder()
                .requester(me).receiver(other).status(FriendshipStatus.PENDING).build();
        ReflectionTestUtils.setField(f, "id", 10L);

        when(friendships.findById(10L)).thenReturn(Optional.of(f));

        var ex = assertThrows(ResponseStatusException.class,
                () -> service.approveRequest(me, 10L));
        assertThat(ex.getStatusCode().value()).isEqualTo(403);
    }

    @Test
    void approveRequest_alreadyApproved_shouldThrowBadRequest() {
        Friendship f = Friendship.builder()
                .requester(other).receiver(me).status(FriendshipStatus.APPROVED).build();
        ReflectionTestUtils.setField(f, "id", 10L);

        when(friendships.findById(10L)).thenReturn(Optional.of(f));

        var ex = assertThrows(ResponseStatusException.class,
                () -> service.approveRequest(me, 10L));
        assertThat(ex.getStatusCode().value()).isEqualTo(400);
    }

    // --- declineRequest ---

    @Test
    void declineRequest_pendingRequest_shouldSetDeclined() {
        Friendship f = Friendship.builder()
                .requester(other).receiver(me).status(FriendshipStatus.PENDING).build();
        ReflectionTestUtils.setField(f, "id", 10L);

        when(friendships.findById(10L)).thenReturn(Optional.of(f));
        when(friendships.save(f)).thenReturn(f);

        service.declineRequest(me, 10L);

        assertThat(f.getStatus()).isEqualTo(FriendshipStatus.DECLINED);
        verify(friendships).save(f);
    }

    @Test
    void declineRequest_notReceiver_shouldThrowForbidden() {
        Friendship f = Friendship.builder()
                .requester(me).receiver(other).status(FriendshipStatus.PENDING).build();
        ReflectionTestUtils.setField(f, "id", 10L);

        when(friendships.findById(10L)).thenReturn(Optional.of(f));

        var ex = assertThrows(ResponseStatusException.class,
                () -> service.declineRequest(me, 10L));
        assertThat(ex.getStatusCode().value()).isEqualTo(403);
    }

    // --- removeFriend ---

    @Test
    void removeFriend_asRequester_shouldDelete() {
        Friendship f = Friendship.builder()
                .requester(me).receiver(other).status(FriendshipStatus.APPROVED).build();
        ReflectionTestUtils.setField(f, "id", 10L);

        when(friendships.findById(10L)).thenReturn(Optional.of(f));

        service.removeFriend(me, 10L);

        verify(friendships).delete(f);
    }

    @Test
    void removeFriend_asReceiver_shouldDelete() {
        Friendship f = Friendship.builder()
                .requester(other).receiver(me).status(FriendshipStatus.APPROVED).build();
        ReflectionTestUtils.setField(f, "id", 10L);

        when(friendships.findById(10L)).thenReturn(Optional.of(f));

        service.removeFriend(me, 10L);

        verify(friendships).delete(f);
    }

    @Test
    void removeFriend_notInvolved_shouldThrowForbidden() {
        User stranger = User.builder().username("carol").build();
        ReflectionTestUtils.setField(stranger, "id", 3L);

        Friendship f = Friendship.builder()
                .requester(other).receiver(stranger).status(FriendshipStatus.APPROVED).build();
        ReflectionTestUtils.setField(f, "id", 10L);

        when(friendships.findById(10L)).thenReturn(Optional.of(f));

        var ex = assertThrows(ResponseStatusException.class,
                () -> service.removeFriend(me, 10L));
        assertThat(ex.getStatusCode().value()).isEqualTo(403);
    }

    @Test
    void removeFriend_notFound_shouldThrowNotFound() {
        when(friendships.findById(99L)).thenReturn(Optional.empty());

        var ex = assertThrows(ResponseStatusException.class,
                () -> service.removeFriend(me, 99L));
        assertThat(ex.getStatusCode().value()).isEqualTo(404);
    }

    // --- getFriends / getIncomingRequests / getOutgoingRequests ---

    @Test
    void getFriends_shouldReturnOnlyApproved() {
        Friendship f = Friendship.builder()
                .requester(me).receiver(other).status(FriendshipStatus.APPROVED).build();
        ReflectionTestUtils.setField(f, "id", 10L);

        when(friendships.findApprovedFriendships(me)).thenReturn(List.of(f));

        List<FriendResponse> result = service.getFriends(me);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).username()).isEqualTo("bob");
        assertThat(result.get(0).status()).isEqualTo(FriendshipStatus.APPROVED);
    }

    @Test
    void getIncomingRequests_shouldReturnPendingWhereReceiver() {
        Friendship f = Friendship.builder()
                .requester(other).receiver(me).status(FriendshipStatus.PENDING).build();
        ReflectionTestUtils.setField(f, "id", 10L);

        when(friendships.findIncomingRequests(me)).thenReturn(List.of(f));

        List<FriendResponse> result = service.getIncomingRequests(me);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).username()).isEqualTo("bob");
        assertThat(result.get(0).isRequester()).isFalse();
    }

    @Test
    void getOutgoingRequests_shouldReturnPendingWhereRequester() {
        Friendship f = Friendship.builder()
                .requester(me).receiver(other).status(FriendshipStatus.PENDING).build();
        ReflectionTestUtils.setField(f, "id", 10L);

        when(friendships.findOutgoingRequests(me)).thenReturn(List.of(f));

        List<FriendResponse> result = service.getOutgoingRequests(me);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).username()).isEqualTo("bob");
        assertThat(result.get(0).isRequester()).isTrue();
    }
}
