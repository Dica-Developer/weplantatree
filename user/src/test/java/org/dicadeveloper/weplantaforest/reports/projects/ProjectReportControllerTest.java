package org.dicadeveloper.weplantaforest.reports.projects;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import org.dicadeveloper.weplantaforest.WeplantaforestApplication;
import org.dicadeveloper.weplantaforest.common.support.TimeConstants;
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
public class ProjectReportControllerTest {

    private MockMvc mockMvc;

    @Rule
    @Autowired
    public CleanDbRule _cleanDbRule;

    @Autowired
    private DbInjecter _dbInjecter;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Before
    public void setup() {
        this.mockMvc = webAppContextSetup(this.webApplicationContext).build();
    }

    @Test
    public void testGetProjectReport() throws Exception {
        long timeOfPlanting = System.currentTimeMillis();

        _dbInjecter.injectTreeType("wood", "wooddesc", 0.5);
        _dbInjecter.injectTreeType("doow", "wooddesc", 0.5);

        _dbInjecter.injectUser("Adam");

        _dbInjecter.injectProject("Project A", "Adam", "project A desc", true, 1.0f, 2.0f);
        _dbInjecter.injectProject("Project B", "Adam", "project B desc", true, 3.0f, 4.0f);

        _dbInjecter.injectProjectArticle("wood", "Project A", 100, 1.0, 0.5);
        _dbInjecter.injectProjectArticle("doow", "Project A", 200, 1.0, 0.5);
        _dbInjecter.injectProjectArticle("wood", "Project B", 300, 1.0, 0.5);
        _dbInjecter.injectProjectArticle("doow", "Project B", 500, 1.0, 0.5);

        _dbInjecter.injectTreeToProject("wood", "Adam", 50, timeOfPlanting, "Project A");
        _dbInjecter.injectTreeToProject("doow", "Adam", 30, timeOfPlanting, "Project A");
        _dbInjecter.injectTreeToProject("wood", "Adam", 20, timeOfPlanting, "Project A");

        _dbInjecter.injectTreeToProject("wood", "Adam", 100, timeOfPlanting, "Project B");
        _dbInjecter.injectTreeToProject("wood", "Adam", 100, timeOfPlanting, "Project B");
        _dbInjecter.injectTreeToProject("doow", "Adam", 200, timeOfPlanting, "Project B");

        this.mockMvc.perform(get(Uris.REPORT_ACTIVE_PROJECTS + "?page=0&size=10").accept("application/json"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content[0].projectName").value("Project A"))
                    .andExpect(jsonPath("$.content[0].projectImageFileName").value("Project A"))
                    .andExpect(jsonPath("$.content[0].description").value("project A desc"))
                    .andExpect(jsonPath("$.content[0].latitude").value(1.0))
                    .andExpect(jsonPath("$.content[0].longitude").value(2.0))
                    .andExpect(jsonPath("$.content[0].amountOfMaximumTreesToPlant").value(300))
                    .andExpect(jsonPath("$.content[0].amountOfPlantedTrees").value(100))
                    .andExpect(jsonPath("$.content[1].projectName").value("Project B"))
                    .andExpect(jsonPath("$.content[1].description").value("project B desc"))
                    .andExpect(jsonPath("$.content[1].latitude").value(3.0))
                    .andExpect(jsonPath("$.content[1].longitude").value(4.0))
                    .andExpect(jsonPath("$.content[1].amountOfMaximumTreesToPlant").value(800))
                    .andExpect(jsonPath("$.content[1].amountOfPlantedTrees").value(400))
                    .andExpect(jsonPath("$.content[1].amountOfPlantedTrees").value(400))
                    .andExpect(jsonPath("$.content[1].active").value(true));
    }

    @Test
    public void testGetProjectByProjectName() throws Exception {
        long timeOfPlanting = System.currentTimeMillis();

        _dbInjecter.injectTreeType("wood", "wooddesc", 0.5);
        _dbInjecter.injectTreeType("doow", "wooddesc", 0.5);

        _dbInjecter.injectUser("Adam");

        _dbInjecter.injectProject("Project A", "Adam", "projectdesc", true, 1.0f, 2.0f);

        _dbInjecter.injectProjectArticle("wood", "Project A", 100, 1.0, 0.5);
        _dbInjecter.injectProjectArticle("doow", "Project A", 200, 1.0, 0.5);

        _dbInjecter.injectTreeToProject("wood", "Adam", 50, timeOfPlanting, "Project A");
        _dbInjecter.injectTreeToProject("doow", "Adam", 30, timeOfPlanting, "Project A");
        _dbInjecter.injectTreeToProject("wood", "Adam", 20, timeOfPlanting, "Project A");

        this.mockMvc.perform(get(Uris.PROJECT_SEARCH_NAME + "Project A").accept("application/json"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.projectName").value("Project A"))
                    .andExpect(jsonPath("$.projectImageFileName").value("Project A"))
                    .andExpect(jsonPath("$.description").value("projectdesc"))
                    .andExpect(jsonPath("$.latitude").value(1.0))
                    .andExpect(jsonPath("$.longitude").value(2.0))
                    .andExpect(jsonPath("$.amountOfMaximumTreesToPlant").value(300))
                    .andExpect(jsonPath("$.amountOfPlantedTrees").value(100));

    }

    @Test
    public void testGetExtendedProjecReporttByProjectName() throws Exception {
        long timeOfPlanting = System.currentTimeMillis();

        _dbInjecter.injectTreeType("wood", "wooddesc", 0.5);
        _dbInjecter.injectTreeType("doow", "wooddesc", 0.5);

        _dbInjecter.injectUser("Adam");

        _dbInjecter.injectProject("Project A", "Adam", "projectdesc", true, 1.0f, 2.0f);

        _dbInjecter.injectProjectArticle("wood", "Project A", 100, 1.0, 0.5);
        _dbInjecter.injectProjectArticle("doow", "Project A", 200, 1.0, 0.5);

        _dbInjecter.injectTreeToProject("wood", "Adam", 50, timeOfPlanting, "Project A");
        _dbInjecter.injectTreeToProject("doow", "Adam", 30, timeOfPlanting, "Project A");
        _dbInjecter.injectTreeToProject("wood", "Adam", 20, timeOfPlanting, "Project A");

        _dbInjecter.injectProjectImage("image title 1", "image desc 1", "image1.jpg", timeOfPlanting - TimeConstants.YEAR_IN_MILLISECONDS, "Project A");
        _dbInjecter.injectProjectImage("image title 2", "image desc 2", "image2.jpg", timeOfPlanting - TimeConstants.YEAR_IN_MILLISECONDS * 2, "Project A");
        _dbInjecter.injectProjectImage("image title 3", "image desc 3", "image3.jpg", timeOfPlanting - TimeConstants.YEAR_IN_MILLISECONDS * 3, "Project A");

        this.mockMvc.perform(get(Uris.PROJECT_SEARCH_NAME + "/extended/" + "Project A").accept("application/json"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.projectReportData.projectName").value("Project A"))
                    .andExpect(jsonPath("$.projectReportData.projectImageFileName").value("Project A"))
                    .andExpect(jsonPath("$.projectReportData.description").value("projectdesc"))
                    .andExpect(jsonPath("$.projectReportData.latitude").value(1.0))
                    .andExpect(jsonPath("$.projectReportData.longitude").value(2.0))
                    .andExpect(jsonPath("$.projectReportData.amountOfMaximumTreesToPlant").value(300))
                    .andExpect(jsonPath("$.projectReportData.amountOfPlantedTrees").value(100))
                    .andExpect(jsonPath("$.images[0].title").value("image title 1"))
                    .andExpect(jsonPath("$.images[0].description").value("image desc 1"))
                    .andExpect(jsonPath("$.images[0].imageFileName").value("image1.jpg"))
                    .andExpect(jsonPath("$.images[0].date").value(timeOfPlanting - TimeConstants.YEAR_IN_MILLISECONDS))
                    .andExpect(jsonPath("$.images[1].title").value("image title 2"))
                    .andExpect(jsonPath("$.images[1].description").value("image desc 2"))
                    .andExpect(jsonPath("$.images[1].imageFileName").value("image2.jpg"))
                    .andExpect(jsonPath("$.images[1].date").value(timeOfPlanting - TimeConstants.YEAR_IN_MILLISECONDS * 2))
                    .andExpect(jsonPath("$.images[2].title").value("image title 3"))
                    .andExpect(jsonPath("$.images[2].description").value("image desc 3"))
                    .andExpect(jsonPath("$.images[2].imageFileName").value("image3.jpg"))
                    .andExpect(jsonPath("$.images[2].date").value(timeOfPlanting - TimeConstants.YEAR_IN_MILLISECONDS * 3));
    }

}
