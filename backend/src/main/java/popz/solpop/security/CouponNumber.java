package popz.solpop.security;


import java.util.zip.CRC32;

public class CouponNumber {

    public String generateCoupon(String input) {
        CRC32 crc = new CRC32();
        crc.update(input.getBytes());
        long hash = crc.getValue();

        return Long.toHexString(hash).toUpperCase();
    }


}
