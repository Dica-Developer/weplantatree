package org.dicadeveloper.weplantaforest.dev.inject;

import javax.annotation.PostConstruct;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dicadeveloper.weplantaforest.services.TreeTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DataInjector {

    private final Log LOG = LogFactory.getLog(DataInjector.class);

    private TreeTypeService _treeTypeService;

    private DatabasePopulator _databasePopulator;

    @Autowired
    public DataInjector(TreeTypeService treeTypeService, DatabasePopulator databasePopulator) {
        _treeTypeService = treeTypeService;
        _databasePopulator = databasePopulator;
    }

    @PostConstruct
    private void inject() {
        // TODO jz: Thinking about giving this an extra state table in the db
        // (like db.populates=v23)
        if (!_treeTypeService.existsAtAll()) {
            int treeCount = 15000;
            _databasePopulator.insertDefaultTreeTypes().insertTrees(treeCount);
            LOG.info("Finished injecting " + treeCount + " trees ");
        } else {
            LOG.info("No entities will be injected.");
        }
    }
}
