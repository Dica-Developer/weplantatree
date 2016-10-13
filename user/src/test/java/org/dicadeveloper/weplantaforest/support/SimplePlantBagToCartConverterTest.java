package org.dicadeveloper.weplantaforest.support;

import static org.assertj.core.api.Assertions.assertThat;

import javax.transaction.Transactional;

import org.dicadeveloper.weplantaforest.WeplantaforestApplication;
import org.dicadeveloper.weplantaforest.cart.Cart;
import org.dicadeveloper.weplantaforest.cart.CartRepository;
import org.dicadeveloper.weplantaforest.common.testSupport.CleanDbRule;
import org.dicadeveloper.weplantaforest.planting.plantbag.SimplePlantBag;
import org.dicadeveloper.weplantaforest.testsupport.DbInjecter;
import org.dicadeveloper.weplantaforest.testsupport.PlantPageDataCreater;
import org.dicadeveloper.weplantaforest.user.User;
import org.dicadeveloper.weplantaforest.user.UserRepository;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = WeplantaforestApplication.class)
@IntegrationTest({ "spring.profiles.active=test" })
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
@Transactional
public class SimplePlantBagToCartConverterTest {

    @Rule
    @Autowired
    public CleanDbRule _cleanDbRule;

    @Autowired
    public DbInjecter _dbInjecter;

    @Autowired
    public PlantBagToCartConverter _plantPageDataCartConverter;

    @Autowired
    private UserRepository _userRepository;

    @Autowired
    public CartRepository _cartRepository;

    static boolean entitiesInjected = false;

    @Before
    public void setup() {
        if (!entitiesInjected) {
            _dbInjecter.injectTreeType("wood", "wood", 0.5);
            _dbInjecter.injectTreeType("doow", "doow", 0.5);
            _dbInjecter.injectTreeType("wodo", "doow", 0.5);

            _dbInjecter.injectUser("Adam");

            _dbInjecter.injectProject("Project A", "Adam", "another project", true, 0, 0);

            _dbInjecter.injectProjectArticle("wood", "Project A", 3.0);
            _dbInjecter.injectProjectArticle("doow", "Project A", 1.0);
            _dbInjecter.injectProjectArticle("wodo", "Project A", 1.0);

            entitiesInjected = true;
        }
    }

    @Test
    @Rollback(false)
    public void testConvertFromPlantPageDataToCartOneItem() {
        User buyer = _userRepository.findOne(1L);
        SimplePlantBag plantPageData = PlantPageDataCreater.initializeSimplePlantPageData();
        plantPageData = PlantPageDataCreater.createSimplePlantItemAndAddToSimplePlantPageData(3, 300, "wood", "Project A", plantPageData);

        Cart cart = _plantPageDataCartConverter.convertSimplePlantPageDataToCart(plantPageData, buyer);

        assertThat(cart.getTotalPrice()
                       .doubleValue()).isEqualTo(9.0);
        assertThat(cart.getCartItems()
                       .get(0)
                       .getTree()
                       .getProjectArticle()
                       .getArticleId()).isEqualTo(1L);
        assertThat(cart.getCartItems()
                       .get(0)
                       .getTree()
                       .getAmount()).isEqualTo(3);
        assertThat(cart.getCartItems()
                       .get(0)
                       .getBasePricePerPiece()
                       .doubleValue()).isEqualTo(3.0);
    }

    @Test
    @Rollback(false)
    public void testConvertFromPlantPageDataToCartTwoItems() {
        User buyer = _userRepository.findOne(1L);
        SimplePlantBag plantPageData = PlantPageDataCreater.initializeSimplePlantPageData();
        plantPageData = PlantPageDataCreater.createSimplePlantItemAndAddToSimplePlantPageData(3, 300, "wood", "Project A", plantPageData);
        plantPageData = PlantPageDataCreater.createSimplePlantItemAndAddToSimplePlantPageData(1, 100, "doow", "Project A", plantPageData);

        Cart cart = _plantPageDataCartConverter.convertSimplePlantPageDataToCart(plantPageData, buyer);

        assertThat(cart.getTotalPrice()
                       .doubleValue()).isEqualTo(10.0);
        assertThat(cart.getCartItems()
                       .get(0)
                       .getTree()
                       .getAmount()).isIn(1, 3);
        assertThat(cart.getCartItems()
                       .get(0)
                       .getBasePricePerPiece()
                       .doubleValue()).isIn(1.0, 3.0);
        assertThat(cart.getCartItems()
                       .get(0)
                       .getTree()
                       .getProjectArticle()
                       .getArticleId()).isIn(1L, 2L);
        assertThat(cart.getCartItems()
                       .get(1)
                       .getTree()
                       .getAmount()).isIn(1, 3);
        assertThat(cart.getCartItems()
                       .get(1)
                       .getBasePricePerPiece()
                       .doubleValue()).isIn(1.0, 3.0);
        assertThat(cart.getCartItems()
                       .get(1)
                       .getTree()
                       .getProjectArticle()
                       .getArticleId()).isIn(1L, 2L);
    }

    @Test
    @Rollback(false)
    public void testConvertFromPlantPageDataToCartThreeItems() {
        User buyer = _userRepository.findOne(1L);
        SimplePlantBag plantPageData = PlantPageDataCreater.initializeSimplePlantPageData();
        plantPageData = PlantPageDataCreater.createSimplePlantItemAndAddToSimplePlantPageData(3, 300, "wood", "Project A", plantPageData);
        plantPageData = PlantPageDataCreater.createSimplePlantItemAndAddToSimplePlantPageData(1, 100, "doow", "Project A", plantPageData);
        plantPageData = PlantPageDataCreater.createSimplePlantItemAndAddToSimplePlantPageData(2, 100, "wodo", "Project A", plantPageData);

        Cart cart = _plantPageDataCartConverter.convertSimplePlantPageDataToCart(plantPageData, buyer);

        assertThat(cart.getTotalPrice()
                       .doubleValue()).isEqualTo(12.0);
        assertThat(cart.getCartItems()
                       .get(0)
                       .getTree()
                       .getAmount()).isEqualTo(3);
        assertThat(cart.getCartItems()
                       .get(0)
                       .getBasePricePerPiece()
                       .doubleValue()).isEqualTo(3.0);
        assertThat(cart.getCartItems()
                       .get(0)
                       .getTree()
                       .getProjectArticle()
                       .getArticleId()).isEqualTo(1L);
        assertThat(cart.getCartItems()
                       .get(1)
                       .getTree()
                       .getAmount()).isEqualTo(1);
        assertThat(cart.getCartItems()
                       .get(1)
                       .getBasePricePerPiece()
                       .doubleValue()).isEqualTo(1.0);
        assertThat(cart.getCartItems()
                       .get(1)
                       .getTree()
                       .getProjectArticle()
                       .getArticleId()).isEqualTo(2L);
        assertThat(cart.getCartItems()
                       .get(2)
                       .getTree()
                       .getAmount()).isEqualTo(2);
        assertThat(cart.getCartItems()
                       .get(2)
                       .getBasePricePerPiece()
                       .doubleValue()).isEqualTo(1.0);
        assertThat(cart.getCartItems()
                       .get(2)
                       .getTree()
                       .getProjectArticle()
                       .getArticleId()).isEqualTo(3L);
        assertThat(cart.getCartItems()
                       .size()).isEqualTo(3);
    }

    @Test
    @Rollback(false)
    public void testSavetoDBAfterConversion() {
        User buyer = _userRepository.findOne(1L);
        SimplePlantBag plantPageData = PlantPageDataCreater.initializeSimplePlantPageData();
        plantPageData = PlantPageDataCreater.createSimplePlantItemAndAddToSimplePlantPageData(3, 300, "wood", "Project A", plantPageData);

        Cart cart = _plantPageDataCartConverter.convertSimplePlantPageDataToCart(plantPageData, buyer);

        _cartRepository.save(cart);

        assertThat(_cartRepository.count()).isEqualTo(1);
    }

}
