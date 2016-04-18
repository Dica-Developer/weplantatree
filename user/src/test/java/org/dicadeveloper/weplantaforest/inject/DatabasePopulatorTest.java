package org.dicadeveloper.weplantaforest.inject;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

import org.dicadeveloper.weplantaforest.WeplantaforestApplication;
import org.dicadeveloper.weplantaforest.admin.codes.TeamRepository;
import org.dicadeveloper.weplantaforest.dev.inject.DatabasePopulator;
import org.dicadeveloper.weplantaforest.projects.ProjectRepository;
import org.dicadeveloper.weplantaforest.testsupport.CleanDbRule;
import org.dicadeveloper.weplantaforest.trees.TreeRepository;
import org.dicadeveloper.weplantaforest.trees.UserRepository;
import org.dicadeveloper.weplantaforest.treetypes.TreeTypeRepository;
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
public class DatabasePopulatorTest {

    @Rule
    @Autowired
    public CleanDbRule _cleanDbRule;

    @Autowired
    private DatabasePopulator _databasePopulator;

    @Autowired
    private TreeTypeRepository _treeTypeRepository;

    @Autowired
    private TreeRepository _treeRepository;

    @Autowired
    private UserRepository _userRepository;

    @Autowired
    private ProjectRepository _projectRepository;

    @Autowired
    private TeamRepository _teamRepository;

    @Test
    public void testInsertUsers() throws Exception {
        _databasePopulator.insertUsers();
        assertThat(_userRepository.count()).isEqualTo(4);
    }

    @Test
    public void testInsertDefaultTreeTypes() throws Exception {
        _databasePopulator.insertDefaultTreeTypes();
        assertThat(_treeTypeRepository.count()).isEqualTo(11);
    }

    @Test
    public void testInsertTrees_noTypes() throws Exception {
        try {
            _databasePopulator.insertTrees(10);
            fail("should throw exception");
        } catch (Exception e) {
            assertThat(e.getMessage()).isEqualTo("No TreeTypes set up!");
        }
    }

    @Test
    public void testInsertTrees() throws Exception {
        _databasePopulator.insertUsers();
        _databasePopulator.insertDefaultTreeTypes();
        _databasePopulator.insertTrees(1000);
        assertThat(_treeRepository.count()).isEqualTo(1000);
    }

    @Test
    public void testInsertProjects() throws Exception {
        _databasePopulator.insertUsers();
        _databasePopulator.insertProjects();
        assertThat(_projectRepository.count()).isEqualTo(10);
    }

    @Test
    public void testInsertTeams() throws Exception {
        _databasePopulator.insertUsers();
        _databasePopulator.insertTeams();
        assertThat(_teamRepository.count()).isEqualTo(4);
    }
}
