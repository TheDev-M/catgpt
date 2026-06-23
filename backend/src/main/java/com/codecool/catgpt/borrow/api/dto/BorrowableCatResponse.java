package com.codecool.catgpt.borrow.api.dto;

import com.codecool.catgpt.cats.domain.Cat;

public record BorrowableCatResponse(
        Long id,
        String name,
        String breed,
        String image,
        boolean available,
        String borrowedByUsername
) {
    public static BorrowableCatResponse from(Cat cat, Long ownerSelectedCatId) {
        boolean ownerIsUsing = cat.getId().equals(ownerSelectedCatId);
        boolean borrowed = cat.getBorrowedBy() != null;
        boolean available = !ownerIsUsing && !borrowed;
        String borrowedByUsername = borrowed ? cat.getBorrowedBy().getUsername() : null;
        return new BorrowableCatResponse(cat.getId(), cat.getName(), cat.getBreed(), cat.getImage(), available, borrowedByUsername);
    }
}
