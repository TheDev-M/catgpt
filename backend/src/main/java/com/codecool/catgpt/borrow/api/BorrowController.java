package com.codecool.catgpt.borrow.api;

import com.codecool.catgpt.borrow.api.dto.BorrowableCatResponse;
import com.codecool.catgpt.borrow.app.BorrowService;
import com.codecool.catgpt.security.CurrentUser;
import com.codecool.catgpt.users.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BorrowController {

    private final CurrentUser currentUser;
    private final BorrowService borrowService;

    @GetMapping("/friends/{friendshipId}/cats")
    public List<BorrowableCatResponse> getFriendCats(@PathVariable Long friendshipId) {
        User me = currentUser.get();
        return borrowService.getFriendCats(me, friendshipId);
    }

    @PostMapping("/cats/{catId}/borrow")
    public ResponseEntity<Void> borrowCat(@PathVariable Long catId) {
        User me = currentUser.get();
        borrowService.borrowCat(me, catId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/cats/{catId}/borrow")
    public ResponseEntity<Void> returnCat(@PathVariable Long catId) {
        User me = currentUser.get();
        borrowService.returnCat(me, catId);
        return ResponseEntity.noContent().build();
    }
}
