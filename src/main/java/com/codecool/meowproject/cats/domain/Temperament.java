package com.codecool.meowproject.cats.domain;

public enum Temperament {
    AFFECTIONATE, DEPENDENT, GENTLE, INTELLIGENT, PLAYFUL;

    public static Temperament fromString(String s) {
        return Temperament.valueOf(s.trim().toUpperCase().replace(' ', '_'));
    }
}
