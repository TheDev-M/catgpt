package com.codecool.catgpt.config;

import com.codecool.catgpt.items.domain.StatType;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Binds {@code /stats/{stat}/decrement} path segments to {@link StatType}.
 * <p>
 * Spring's default enum conversion is case-sensitive, but the client sends
 * lower-case stat names. Uppercasing with {@link Locale#ROOT} keeps the mapping
 * stable in locales where the default casing rules differ (Turkish dotless i).
 */
@Component
public class StatTypeConverter implements Converter<String, StatType> {

    @Override
    public StatType convert(String source) {
        return StatType.valueOf(source.trim().toUpperCase(Locale.ROOT));
    }
}
