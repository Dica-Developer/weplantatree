package org.dicadeveloper.weplantaforest.common.code;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CodeHelper {

    private static class Values {
        public final int small;

        public final int medium;

        public final int large;

        public Values(final int s, final int m, final int l) {
            small = s;
            medium = m;
            large = l;
        }

        public static Values create(final int s, final int m, final int l) {
            return new Values(s, m, l);
        }
    }

    private static final Pattern CODE_PATTERN = Pattern.compile("[A-HK-NP-Z1-9]{4}-[A-HK-NP-Z1-9]{4}-[A-HK-NP-Z1-9]{4}-[A-HK-NP-Z1-9]{4}");

    private static final Map<Character, Values> _crypt = new HashMap<Character, Values>();

    static {
        _crypt.put('A', Values.create(5, 6, 14));
        _crypt.put('B', Values.create(2, 9, 12));
        _crypt.put('C', Values.create(4, 1, 21));
        _crypt.put('D', Values.create(1, 14, 26));
        _crypt.put('E', Values.create(1, 5, 4));
        _crypt.put('F', Values.create(4, 2, 20));
        _crypt.put('G', Values.create(0, 14, 18));
        _crypt.put('H', Values.create(3, 2, 13));
        _crypt.put('K', Values.create(5, 13, 28));
        _crypt.put('L', Values.create(5, 15, 10));
        _crypt.put('M', Values.create(3, 8, 11));
        _crypt.put('N', Values.create(7, 0, 30));
        _crypt.put('P', Values.create(3, 4, 1));
        _crypt.put('Q', Values.create(6, 11, 23));
        _crypt.put('R', Values.create(6, 3, 27));
        _crypt.put('S', Values.create(1, 12, 3));
        _crypt.put('T', Values.create(6, 4, 22));
        _crypt.put('U', Values.create(2, 13, 9));
        _crypt.put('V', Values.create(0, 9, 2));
        _crypt.put('W', Values.create(7, 7, 31));
        _crypt.put('X', Values.create(2, 12, 19));
        _crypt.put('Y', Values.create(7, 11, 17));
        _crypt.put('Z', Values.create(0, 0, 25));
        _crypt.put('1', Values.create(7, 15, 29));
        _crypt.put('2', Values.create(6, 10, 16));
        _crypt.put('3', Values.create(4, 6, 0));
        _crypt.put('4', Values.create(5, 11, 7));
        _crypt.put('5', Values.create(0, 7, 5));
        _crypt.put('6', Values.create(2, 8, 15));
        _crypt.put('7', Values.create(3, 1, 6));
        _crypt.put('8', Values.create(1, 5, 24));
        _crypt.put('9', Values.create(4, 3, 8));
    }

    public static boolean isValid(final String code) {
        final Matcher matcher = CODE_PATTERN.matcher(code);
        if (matcher.matches()) {
            int sum = 0;
            for (int i = 0; i < 2; i++) {
                final char c = code.charAt(i);
                if (_crypt.containsKey(c)) {
                    sum += _crypt.get(c).small;
                } else {
                    return false;
                }
            }
            for (int i = 2; i < 4; i++) {
                final char c = code.charAt(i);
                if (_crypt.containsKey(c)) {
                    sum += _crypt.get(c).medium;
                } else {
                    return false;
                }
            }
            for (int i = 5; i < 9; i++) {
                final char c = code.charAt(i);

                if (_crypt.containsKey(c)) {
                    sum += _crypt.get(c).large;
                } else {
                    return false;
                }
            }
            for (int i = 10; i < 14; i++) {
                final char c = code.charAt(i);
                if (_crypt.containsKey(c)) {
                    sum += _crypt.get(c).large;
                } else {
                    return false;
                }
            }
            for (int i = 15; i < 17; i++) {
                final char c = code.charAt(i);
                if (_crypt.containsKey(c)) {
                    sum += _crypt.get(c).small;
                } else {
                    return false;
                }
            }
            for (int i = 17; i < 19; i++) {
                final char c = code.charAt(i);
                if (_crypt.containsKey(c)) {
                    sum += _crypt.get(c).medium;
                } else {
                    return false;
                }
            }
            if (sum % 23 == 0) {
                return true;
            }
        }
        return false;
    }

    public static String generateCodeString() {
        final StringBuilder key = new StringBuilder();
        // 1st block
        final int number11 = random(8);
        final int number12 = random(8);
        final int number13 = random(16);
        final int number14 = random(16);

        key.append(small(number11));
        key.append(small(number12));
        key.append(medium(number13));
        key.append(medium(number14));

        key.append("-");

        // 2nd block
        int number21 = random(32);
        int number22 = random(32);
        int number23 = random(32);
        int number24 = random(32);

        key.append(large(number21));
        key.append(large(number22));
        key.append(large(number23));
        key.append(large(number24));

        key.append("-");

        // 3rd block
        int number31 = random(32);
        int number32 = random(32);
        int number33 = random(32);
        int number34 = random(32);

        key.append(large(number31));
        key.append(large(number32));
        key.append(large(number33));
        key.append(large(number34));

        key.append("-");

        // 4th block
        final int number41 = random(8);
        final int number42 = random(8);

        key.append(small(number41));
        key.append(small(number42));

        // calculate checksum [medium]
        final int sum = number11 + number12 + number13 + number14 + number21 + number22 + number23 + number24 + number31 + number32 + number33 + number34 + number41 + number42;

        final int missing = 23 - sum % 23;
        final int checkA = random(Math.max(missing - 8, 0), Math.min(missing, 8));
        final int checkB = missing - checkA;

        key.append(medium(checkA));
        key.append(medium(checkB));

        return key.toString();
    }

    private static int random(final int to) {
        return random(0, to);
    }

    private static int random(final int from, final int to) {
        return (int) (from + Math.random() * (to - from));
    }

    private static char small(final int v) {
        final List<Character> cs = new ArrayList<Character>();
        for (final Character c : _crypt.keySet()) {
            final Values values = _crypt.get(c);
            if (values.small == v) {
                cs.add(c);
            }
        }

        final int max = cs.size() - 1;
        return cs.get(random(max));
    }

    private static char medium(final int v) {
        final List<Character> cs = new ArrayList<Character>();
        for (final Character c : _crypt.keySet()) {
            final Values values = _crypt.get(c);
            if (values.medium == v) {
                cs.add(c);
            }
        }
        final int max = cs.size() - 1;
        return cs.get(random(max));
    }

    private static char large(final int v) {
        for (final Character c : _crypt.keySet()) {
            final Values values = _crypt.get(c);
            if (values.large == v) {
                return c;
            }
        }
        return '0';
    }
}
