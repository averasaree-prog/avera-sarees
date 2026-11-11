package com.saanvi.sarees.config;

import com.saanvi.sarees.entity.*;
import com.saanvi.sarees.enums.DiscountType;
import com.saanvi.sarees.enums.RoleName;
import com.saanvi.sarees.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final ProductReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.initial-email:admin@saanvisarees.com}")
    private String adminEmail;

    @Value("${app.admin.initial-password:Admin@Saanvi2026!}")
    private String adminPassword;

    @Value("${app.admin.initial-name:Saanvi Admin}")
    private String adminName;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           CouponRepository couponRepository,
                           ProductReviewRepository reviewRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.couponRepository = couponRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Checking database initialization status...");
        initRoles();
        initAdminUser();
        initCategories();
        initCoupons();
        initCatalog();
        log.info("Database initialization completed successfully.");
    }

    private void initRoles() {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(RoleName.ROLE_CUSTOMER));
            roleRepository.save(new Role(RoleName.ROLE_ADMIN));
            log.info("Initialized security roles.");
        }
    }

    private void initAdminUser() {
        if (!userRepository.existsByEmail(adminEmail.toLowerCase())) {
            Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                    .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_ADMIN)));
            Role customerRole = roleRepository.findByName(RoleName.ROLE_CUSTOMER)
                    .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_CUSTOMER)));

            User admin = new User();
            admin.setEmail(adminEmail.toLowerCase());
            admin.setFullName(adminName);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setPhone("+91 98765 43210");
            admin.setRoles(new HashSet<>(Arrays.asList(adminRole, customerRole)));

            userRepository.save(admin);
            log.info("Created initial administrator account: {}", adminEmail);
        }
    }

    private void initCategories() {
        if (categoryRepository.count() == 0) {
            List<Category> categories = Arrays.asList(
                new Category("Banarasi Sarees", "banarasi-sarees", "Opulent pure silk brocades woven with intricate gold & silver zari in Varanasi.", "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80", 1),
                new Category("Kanjivaram Silk Sarees", "kanjivaram-silk-sarees", "Heirloom mulberry silk with authentic temple borders from Tamil Nadu.", "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80", 2),
                new Category("Chanderi Sarees", "chanderi-sarees", "Sheer luxury crafted with lightweight silk and gold floral motifs from Madhya Pradesh.", "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80", 3),
                new Category("Organza Sarees", "organza-sarees", "Ethereal translucent drapes adorned with delicate floral thread embroidery.", "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80", 4),
                new Category("Cotton Sarees", "cotton-sarees", "Breathable, hand-spun pure cottons designed for all-day refined comfort.", "https://images.unsplash.com/photo-1583391733975-dd2834fa2f64?auto=format&fit=crop&w=800&q=80", 5),
                new Category("Linen Sarees", "linen-sarees", "Artisanal organic linens featuring contrast selvedge and earthy pastels.", "https://images.unsplash.com/photo-1610030469668-935a4d634997?auto=format&fit=crop&w=800&q=80", 6),
                new Category("Chiffon Sarees", "chiffon-sarees", "Feather-light flowing silhouettes perfect for graceful evening cocktails.", "https://images.unsplash.com/photo-1610030470217-193e62f02540?auto=format&fit=crop&w=800&q=80", 7),
                new Category("Georgette Sarees", "georgette-sarees", "Textured crêpe weave offering effortless drape and embellished borders.", "https://images.unsplash.com/photo-1617627143644-3c66f57007aa?auto=format&fit=crop&w=800&q=80", 8),
                new Category("Printed Sarees", "printed-sarees", "Hand-block Ajrakh, Kalamkari and contemporary digital botanical prints.", "https://images.unsplash.com/photo-1610030470076-26a978ca1496?auto=format&fit=crop&w=800&q=80", 9),
                new Category("Party Wear Sarees", "party-wear-sarees", "Modern shimmering sequin, cutwork, and pre-draped celebration drapes.", "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80", 10),
                new Category("Bridal Sarees", "bridal-sarees", "Magnificent trousseau showstoppers with hand-embroidered zardozi.", "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80", 11),
                new Category("Festive Sarees", "festive-sarees", "Auspicious tones of kumkum crimson, haldi yellow, and peacock teal.", "https://images.unsplash.com/photo-1610030469850-2f98e6c407c9?auto=format&fit=crop&w=800&q=80", 12),
                new Category("Daily Wear Sarees", "daily-wear-sarees", "Crisp Mulmul and Kota Doria sarees ideal for workplace and everyday grace.", "https://images.unsplash.com/photo-1610030470438-fb865ecdd782?auto=format&fit=crop&w=800&q=80", 13)
            );
            categoryRepository.saveAll(categories);
            log.info("Initialized 13 luxury saree categories.");
        }
    }

    private void initCoupons() {
        if (!couponRepository.existsByCodeIgnoreCase("FESTIVE15")) {
            couponRepository.save(new Coupon("FESTIVE15", "Festival Offer — Extra 15% Off on all orders", DiscountType.PERCENTAGE, new BigDecimal("15.00"), new BigDecimal("2000.00"), new BigDecimal("2000.00")));
        }
        if (!couponRepository.existsByCodeIgnoreCase("UTSAV10")) {
            couponRepository.save(new Coupon("UTSAV10", "10% festive discount on all orders above ₹2,999", DiscountType.PERCENTAGE, new BigDecimal("10.00"), new BigDecimal("2999.00"), new BigDecimal("1500.00")));
        }
        if (!couponRepository.existsByCodeIgnoreCase("FIRSTSAANVI")) {
            couponRepository.save(new Coupon("FIRSTSAANVI", "Flat ₹500 off on your maiden purchase above ₹2,499", DiscountType.FLAT, new BigDecimal("500.00"), new BigDecimal("2499.00"), null));
        }
        if (!couponRepository.existsByCodeIgnoreCase("ROYAL500")) {
            couponRepository.save(new Coupon("ROYAL500", "Complimentary ₹500 discount on royal silk sarees", DiscountType.FLAT, new BigDecimal("500.00"), new BigDecimal("3999.00"), null));
        }
        log.info("Initialized promotional coupons including FESTIVE15.");
    }

    private void initCatalog() {
        if (productRepository.count() > 0) return;

        Category banarasi = categoryRepository.findBySlug("banarasi-sarees").orElse(null);
        Category kanjivaram = categoryRepository.findBySlug("kanjivaram-silk-sarees").orElse(null);
        Category chanderi = categoryRepository.findBySlug("chanderi-sarees").orElse(null);
        Category organza = categoryRepository.findBySlug("organza-sarees").orElse(null);
        Category cotton = categoryRepository.findBySlug("cotton-sarees").orElse(null);
        Category linen = categoryRepository.findBySlug("linen-sarees").orElse(null);
        Category party = categoryRepository.findBySlug("party-wear-sarees").orElse(null);
        Category bridal = categoryRepository.findBySlug("bridal-sarees").orElse(null);

        List<Product> sarees = new ArrayList<>();

        // 1. Royal Crimson Katan Banarasi Saree
        sarees.add(createSaree(
                "Royal Crimson Katan Silk Banarasi Saree",
                "SS-BAN-001",
                banarasi,
                "Pure Katan Silk",
                "Kadwa Handloom",
                "Wedding & Festive",
                "Intricate Floral Jaal & Meenakari",
                "Deep Crimson Maroon",
                new BigDecimal("18999.00"),
                new BigDecimal("22500.00"),
                15,
                12,
                true, true, false,
                "A regal masterpiece woven by master artisans in Varanasi using pure Katan silk. The body features intricate floral gold zari jaal enriched with delicate meenakari highlights.",
                Arrays.asList(
                    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
                )
        ));

        // 2. Temple Gold Kanjivaram Silk Saree
        sarees.add(createSaree(
                "Kanchipuram Heirloom Gold Korvai Silk Saree",
                "SS-KAN-002",
                kanjivaram,
                "Pure Mulberry Silk",
                "Korvai Handloom",
                "Bridal & Reception",
                "Mayilkan & Rudraksha Motifs",
                "Temple Gold & Forest Green",
                new BigDecimal("24999.00"),
                new BigDecimal("29999.00"),
                16,
                8,
                true, true, true,
                "An heirloom Kanchipuram drape woven using pure silver and 24-karat gold electroplated zari. Distinct Korvai interlock border with majestic peacocks.",
                Arrays.asList(
                    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80"
                )
        ));

        // 3. Pastel Rose Hand-Embroidered Organza Saree
        sarees.add(createSaree(
                "Pastel Rose Silk Organza Saree with Scalloped Zari",
                "SS-ORG-003",
                organza,
                "Silk Organza",
                "Hand-finished Cutwork",
                "Day Wedding & Soiree",
                "Botanical Resham Flora",
                "Muted Dusty Rose",
                new BigDecimal("8499.00"),
                new BigDecimal("10999.00"),
                22,
                15,
                true, false, true,
                "Ethereal and weightless, this organza saree is hand-finished with delicate French knots and scalloped metallic borders.",
                Arrays.asList(
                    "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1610030469668-935a4d634997?auto=format&fit=crop&w=1000&q=80"
                )
        ));

        // 4. Vintage Ivory Chanderi Silk Saree
        sarees.add(createSaree(
                "Vintage Ivory Chanderi Tissue Silk Saree",
                "SS-CHA-004",
                chanderi,
                "Chanderi Silk Cotton",
                "Traditional Boota Weave",
                "Festive Puja & Celebrations",
                "Ashrafi Gold Coins",
                "Warm Ivory & Antique Gold",
                new BigDecimal("6999.00"),
                new BigDecimal("8500.00"),
                17,
                20,
                true, true, false,
                "Captivating sheer glow woven with fine silk warp and cotton weft. Embellished with classic round Ashrafi boota along the drape.",
                Arrays.asList(
                    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
                )
        ));

        // 5. Handwoven Jamdani Bengal Cotton Saree
        sarees.add(createSaree(
                "Artisanal Jamdani Handloom Cotton Saree",
                "SS-COT-005",
                cotton,
                "100% Fine Combed Cotton",
                "Jamdani Supplementary Weft",
                "Everyday Luxury & Office",
                "Geometrical Paisley",
                "Midnight Indigo & Ecru",
                new BigDecimal("4299.00"),
                new BigDecimal("4999.00"),
                14,
                25,
                false, false, true,
                "Woven thread by thread on pit looms in Bengal. Feathery texture that softens with each gentle wash while keeping you impeccably styled.",
                Arrays.asList(
                    "https://images.unsplash.com/photo-1583391733975-dd2834fa2f64?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1610030470438-fb865ecdd782?auto=format&fit=crop&w=1000&q=80"
                )
        ));

        // 6. Midnight Wine Sequin Glamour Saree
        sarees.add(createSaree(
                "Midnight Wine Cocktail Sequin Georgette Saree",
                "SS-PTY-006",
                party,
                "Pure Viscose Georgette",
                "Micro-Sequin Embroidery",
                "Cocktail & Sangeet Night",
                "Graduated Ombre Sparkle",
                "Deep Maroon Wine",
                new BigDecimal("11499.00"),
                new BigDecimal("13999.00"),
                17,
                10,
                true, true, true,
                "Dazzle under ambient evening lights. Featuring thousands of tonal micro-sequins embedded into lustrous, fluid georgette fabric.",
                Arrays.asList(
                    "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1617627143644-3c66f57007aa?auto=format&fit=crop&w=1000&q=80"
                )
        ));

        // 7. Handcrafted Zardozi Crimson Bridal Saree
        sarees.add(createSaree(
                "Maharani Handcrafted Zardozi Trousseau Saree",
                "SS-BRD-007",
                bridal,
                "Heritage Silk Velvet Border & Georgette",
                "Authentic Dabka & Zardozi",
                "Bridal Wedding Ceremony",
                "Palatial Mughal Arches",
                "Deep Sindoor Red",
                new BigDecimal("28999.00"),
                new BigDecimal("34000.00"),
                14,
                5,
                true, true, false,
                "A bridal heirloom to be cherished across generations. Lavishly embroidered with real dabka, cut-dana, and pearls along the wide scalloped pallu.",
                Arrays.asList(
                    "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
                )
        ));

        // 8. Natural Silver-Border Organic Linen Saree
        sarees.add(createSaree(
                "Natural Muted Sage Organic Linen Saree",
                "SS-LIN-008",
                linen,
                "100 Count Organic Linen",
                "Plain Weave with Silver Selvedge",
                "Contemporary Gathering",
                "Minimalist Contrast Border",
                "Sage Green & Sterling Silver",
                new BigDecimal("5299.00"),
                new BigDecimal("6200.00"),
                14,
                18,
                false, true, true,
                "Crafted from premium European flax spun in India. A breath of serene elegance for discerning connoisseurs of sustainable luxury.",
                Arrays.asList(
                    "https://images.unsplash.com/photo-1610030469668-935a4d634997?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1583391733975-dd2834fa2f64?auto=format&fit=crop&w=1000&q=80"
                )
        ));

        productRepository.saveAll(sarees);
        log.info("Initialized 8 demo luxury sarees with high-definition imagery and technical specifications.");

        // Add genuine demo reviews
        Product banarasiSaree = sarees.get(0);
        ProductReview r1 = new ProductReview();
        r1.setProduct(banarasiSaree);
        r1.setCustomerName("Priyanka Sharma");
        r1.setRating(5);
        r1.setTitle("Breathtaking Craftsmanship");
        r1.setComment("Draped this for my sister's wedding reception in Delhi. The weight of the silk and the sheen of the gold zari exceeded my expectations. Truly world class!");
        r1.setApproved(true);
        r1.setVerifiedPurchase(true);

        ProductReview r2 = new ProductReview();
        r2.setProduct(banarasiSaree);
        r2.setCustomerName("Ananya Deshmukh");
        r2.setRating(5);
        r2.setTitle("Feels like royal royalty");
        r2.setComment("The crimson red tone is pure perfection, not too bright, just the right deep shade. Delivery to Mumbai was swift within 48 hours.");
        r2.setApproved(true);
        r2.setVerifiedPurchase(true);

        reviewRepository.saveAll(Arrays.asList(r1, r2));
    }

    private Product createSaree(String name, String sku, Category category, String fabric, String weave,
                                String occasion, String pattern, String color, BigDecimal price, BigDecimal originalPrice,
                                int discountPct, int stock, boolean isFeatured, boolean isBestSeller, boolean isNewArrival,
                                String description, List<String> imageUrls) {
        Product p = new Product();
        p.setName(name);
        p.setSlug(sku.toLowerCase() + "-" + name.toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-"));
        p.setSku(sku);
        p.setCategory(category);
        p.setFabric(fabric);
        p.setWeave(weave);
        p.setOccasion(occasion);
        p.setPattern(pattern);
        p.setColor(color);
        p.setPrice(price);
        p.setOriginalPrice(originalPrice);
        p.setDiscountPercentage(discountPct);
        p.setStockQuantity(stock);
        p.setFeatured(isFeatured);
        p.setBestSeller(isBestSeller);
        p.setNewArrival(isNewArrival);
        p.setActive(true);
        p.setShortDescription("Authentic handcrafted " + fabric + " saree woven with traditional " + weave + ".");
        p.setDescription(description);
        p.setSareeLengthMeters(new BigDecimal("5.50"));
        p.setBlousePieceDetails("Unstitched matching blouse piece (0.80 meters) included.");
        p.setCareInstructions("Dry clean exclusively. Store in muslin cloth away from direct sunlight.");

        List<ProductImage> images = new ArrayList<>();
        for (int i = 0; i < imageUrls.size(); i++) {
            images.add(new ProductImage(p, imageUrls.get(i), name, i, i == 0));
        }
        p.setImages(images);

        return p;
    }
}
