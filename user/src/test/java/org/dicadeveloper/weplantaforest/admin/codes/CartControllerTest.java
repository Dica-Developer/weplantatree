package org.dicadeveloper.weplantaforest.admin.codes;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.dicadeveloper.weplantaforest.WeplantaforestApplication;
import org.dicadeveloper.weplantaforest.common.testSupport.CleanDbRule;
import org.dicadeveloper.weplantaforest.support.Uris;
import org.dicadeveloper.weplantaforest.testsupport.DbInjecter;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@SpringApplicationConfiguration(classes = WeplantaforestApplication.class)
@IntegrationTest({ "spring.profiles.active=test" })
@DirtiesContext(classMode = ClassMode.AFTER_EACH_TEST_METHOD)
public class CartControllerTest {
    private MockMvc mockMvc;

    @Rule
    @Autowired
    public CleanDbRule _cleanDbRule;

    @Autowired
    private DbInjecter dbInjecter;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Before
    public void setup() {
        this.mockMvc = webAppContextSetup(this.webApplicationContext).build();
    }

    @Test
    @Transactional
    public void testGetShortCartByUserId() throws Exception {
        long timeOfPlanting = System.currentTimeMillis();

        dbInjecter.injectUser("Adam");
        dbInjecter.injectTreeType("wood", "wood desc", 0.5);
        dbInjecter.injectProject("Project A", "Adam", "desc", true, 1.0f, 2.0f);
        dbInjecter.injectProjectArticle("wood", "Project A", 100, 1.0, 0.5);
        dbInjecter.injectTreeToProject("wood", "Adam", 1, timeOfPlanting, "Project A");

        List<Long> treeIds = new ArrayList<>();
        treeIds.add(1L);

        dbInjecter.injectCart("Adam", treeIds, timeOfPlanting);

        this.mockMvc.perform(get(Uris.CART_SHORT_VIEW + "{userId}", 1).accept("application/json"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.[0].id").value(1))
                    .andExpect(jsonPath("$.[0].timeStamp").value(timeOfPlanting))
                    .andExpect(jsonPath("$.[0].treeCount").value(1))
                    .andExpect(jsonPath("$.[0].totalPrice").value(1));
    }

    @Test
    @Transactional
    public void testGetShortCartsByUserId() throws Exception {
        long timeOfPlanting = System.currentTimeMillis();

        dbInjecter.injectUser("Adam");
        dbInjecter.injectTreeType("wood", "wood desc", 0.5);
        dbInjecter.injectTreeType("doow", "wood desc", 0.5);
        dbInjecter.injectProject("Project A", "Adam", "desc", true, 1.0f, 2.0f);
        dbInjecter.injectProjectArticle("wood", "Project A", 100, 1.0, 0.5);
        dbInjecter.injectProjectArticle("doow", "Project A", 100, 1.0, 0.5);

        dbInjecter.injectTreeToProject("wood", "Adam", 1, timeOfPlanting, "Project A");
        dbInjecter.injectTreeToProject("doow", "Adam", 2, timeOfPlanting, "Project A");

        dbInjecter.injectTreeToProject("wood", "Adam", 3, timeOfPlanting, "Project A");
        dbInjecter.injectTreeToProject("doow", "Adam", 4, timeOfPlanting, "Project A");

        List<Long> treeIds = new ArrayList<>();
        treeIds.add(1L);
        treeIds.add(2L);

        dbInjecter.injectCart("Adam", treeIds, timeOfPlanting);

        List<Long> treeIds2 = new ArrayList<>();
        treeIds2.add(3L);
        treeIds2.add(4L);

        dbInjecter.injectCart("Adam", treeIds2, timeOfPlanting);

        this.mockMvc.perform(get(Uris.CART_SHORT_VIEW + "{userId}", 1).accept("application/json"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.[0].id").value(1))
                    .andExpect(jsonPath("$.[0].timeStamp").value(timeOfPlanting))
                    .andExpect(jsonPath("$.[0].treeCount").value(3))
                    .andExpect(jsonPath("$.[0].totalPrice").value(3))
                    .andExpect(jsonPath("$.[1].id").value(2))
                    .andExpect(jsonPath("$.[1].timeStamp").value(timeOfPlanting))
                    .andExpect(jsonPath("$.[1].treeCount").value(7))
                    .andExpect(jsonPath("$.[1].totalPrice").value(7));

    }
}