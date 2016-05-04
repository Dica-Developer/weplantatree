package org.dicadeveloper.weplantaforest.reports.co2;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Date;

import org.assertj.core.data.Offset;
import org.dicadeveloper.weplantaforest.WeplantaforestApplication;
import org.dicadeveloper.weplantaforest.testsupport.CleanDbRule;
import org.dicadeveloper.weplantaforest.testsupport.DbInjecter;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = WeplantaforestApplication.class)
@IntegrationTest({ "spring.profiles.active=test" })
@DirtiesContext(classMode = ClassMode.AFTER_EACH_TEST_METHOD)
public class Co2RepositoryIntegrationTest {

    /**
     * For performance reasons we shifted calculation of co2 from java to the
     * database query. There is a slight but neglectable difference in the
     * results. The expected test results are matching the java version.
     */
    private static final Offset<Double> OK_DELTA_FOR_CO2_SAVING = Offset.offset(0.000001D);

    @Rule
    @Autowired
    public CleanDbRule _cleanDbRule;

    @Autowired
    public DbInjecter _dbInjecter;

    @Autowired
    private Co2Repository _co2Repository;

    @Test
    public void testGetCo2OfAllTrees_NoTimeForSavingCo2() {
        long timeOfPlanting = System.currentTimeMillis();

        _dbInjecter.injectTreeType("wood", "desc", 0.5);
        _dbInjecter.injectUser("Bert");
        _dbInjecter.injectTree("wood", "Bert", 10, timeOfPlanting);

        Co2Data co2 = _co2Repository.getAllTreesAndCo2Saving(timeOfPlanting);
        assertThat(co2.getTreesCount()).isEqualTo(10);
        assertThat(co2.getCo2()).isEqualTo(0.0);
    }

    /**
     * Same test as in TreeDaoImplTest.getCo2SavingByPlantingForPointInTime().
     */
    @Test
    public void testGetCo2SavingByPlantingForPointInTime() {
        _dbInjecter.injectTreeType("wood", "desc", 0.1);
        _dbInjecter.injectUser("Bert");
        _dbInjecter.injectTree("wood", "Bert", 1, new Date(0).getTime());

        Co2Data co2 = _co2Repository.getAllTreesAndCo2Saving(1207077022876l);

        assertThat(co2.getTreesCount()).isEqualTo(1);
        assertThat(co2.getCo2()).isEqualTo(3.8276161874139056D, OK_DELTA_FOR_CO2_SAVING);
    }
}
